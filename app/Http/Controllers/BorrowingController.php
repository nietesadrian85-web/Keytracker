<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Borrowing;
use App\Models\Key;
use App\Models\User;
use App\Services\OverdueService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BorrowingController extends Controller
{
    /**
     * Display all transactions (Transaction History).
     */
    public function index(Request $request): Response
    {
        OverdueService::checkAndUpdateOverdue();

        $query = Borrowing::with(['key', 'user', 'approver']);

        // Staff can only view their own transactions unless admin
        if (! $request->user()->isAdmin()) {
            $query->where('user_id', $request->user()->id);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('purpose', 'like', "%{$search}%")
                    ->orWhereHas('key', function ($kq) use ($search) {
                        $kq->where('name', 'like', "%{$search}%")
                            ->orWhere('key_code', 'like', "%{$search}%")
                            ->orWhere('location', 'like', "%{$search}%");
                    })
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        if ($keyId = $request->input('key_id')) {
            $query->where('key_id', $keyId);
        }

        if ($startDate = $request->input('start_date')) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate = $request->input('end_date')) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $transactions = $query->latest()->paginate(12)->withQueryString();

        $users = User::select('id', 'name', 'email', 'department')->orderBy('name')->get();
        $keys = Key::select('id', 'name', 'key_code')->orderBy('name')->get();

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'user_id' => $request->input('user_id', ''),
                'key_id' => $request->input('key_id', ''),
                'start_date' => $request->input('start_date', ''),
                'end_date' => $request->input('end_date', ''),
            ],
            'users' => $users,
            'keys' => $keys,
        ]);
    }

    /**
     * Admin view of pending borrowing requests.
     */
    public function requests(Request $request): Response
    {
        OverdueService::checkAndUpdateOverdue();

        $requests = Borrowing::with(['key', 'user'])
            ->where('status', 'pending')
            ->latest()
            ->paginate(15);

        $availableKeys = Key::where('status', 'available')->orderBy('name')->get();

        return Inertia::render('borrowing/requests', [
            'requests' => $requests,
            'availableKeys' => $availableKeys,
        ]);
    }

    /**
     * User's view of their currently borrowed and historical keys.
     */
    public function myBorrowed(Request $request): Response
    {
        OverdueService::checkAndUpdateOverdue();

        $user = $request->user();

        $activeBorrowings = Borrowing::with('key')
            ->where('user_id', $user->id)
            ->whereIn('status', ['borrowed', 'overdue', 'pending'])
            ->latest()
            ->get();

        $historyBorrowings = Borrowing::with('key')
            ->where('user_id', $user->id)
            ->whereIn('status', ['returned', 'rejected', 'lost', 'damaged'])
            ->latest()
            ->paginate(10);

        $availableKeys = Key::where('status', 'available')->orderBy('name')->get();

        return Inertia::render('borrowing/my-borrowed', [
            'activeBorrowings' => $activeBorrowings,
            'historyBorrowings' => $historyBorrowings,
            'availableKeys' => $availableKeys,
        ]);
    }

    /**
     * Submit a request to borrow a key.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'key_id' => ['required', 'exists:keys,id'],
            'purpose' => ['required', 'string', 'max:500'],
            'expected_return_at' => ['required', 'date', 'after:now'],
        ]);

        $key = Key::findOrFail($validated['key_id']);

        if ($key->status !== 'available') {
            return back()->with('error', "Key '{$key->name}' is currently {$key->status} and cannot be requested.");
        }

        $user = $request->user();

        $borrowing = Borrowing::create([
            'key_id' => $key->id,
            'user_id' => $user->id,
            'purpose' => $validated['purpose'],
            'expected_return_at' => Carbon::parse($validated['expected_return_at']),
            'status' => 'pending',
        ]);

        ActivityLog::log(
            'BORROW_REQUEST',
            "User {$user->name} requested to borrow '{$key->name}' ({$key->key_code}) for purpose: '{$borrowing->purpose}'."
        );

        return back()->with('success', "Borrow request for '{$key->name}' submitted successfully.");
    }

    /**
     * Admin approves a borrow request.
     */
    public function approve(Request $request, Borrowing $borrowing): RedirectResponse
    {
        if ($borrowing->status !== 'pending') {
            return back()->with('error', 'This request is not pending.');
        }

        $key = $borrowing->key;
        if ($key->status !== 'available') {
            return back()->with('error', "Key is not available (current status: {$key->status}).");
        }

        $now = Carbon::now();
        $borrowing->update([
            'status' => 'borrowed',
            'borrowed_at' => $now,
            'approved_by' => $request->user()->id,
        ]);

        $key->update(['status' => 'borrowed']);

        ActivityLog::log(
            'APPROVE_BORROW',
            "Approved borrowing of '{$key->name}' for {$borrowing->user->name} until " . $borrowing->expected_return_at?->format('M d, Y H:i')
        );

        return back()->with('success', "Request approved. Key '{$key->name}' is now marked as Borrowed.");
    }

    /**
     * Admin rejects a borrow request.
     */
    public function reject(Request $request, Borrowing $borrowing): RedirectResponse
    {
        if ($borrowing->status !== 'pending') {
            return back()->with('error', 'This request is not pending.');
        }

        $validated = $request->validate([
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $borrowing->update([
            'status' => 'rejected',
            'notes' => $validated['reason'] ?? 'Request was rejected by Administrator.',
        ]);

        ActivityLog::log(
            'REJECT_BORROW',
            "Rejected borrowing request of '{$borrowing->key->name}' for {$borrowing->user->name}."
        );

        return back()->with('success', "Request for '{$borrowing->key->name}' was rejected.");
    }

    /**
     * Admin records key return.
     */
    public function returnKey(Request $request, Borrowing $borrowing): RedirectResponse
    {
        $validated = $request->validate([
            'returned_at' => ['nullable', 'date'],
            'return_condition' => ['required', 'in:good,damaged,missing'],
            'notes' => ['nullable', 'string'],
        ]);

        $returnedAt = $validated['returned_at'] ? Carbon::parse($validated['returned_at']) : Carbon::now();
        $condition = $validated['return_condition'];
        $notes = $validated['notes'] ?? '';

        $key = $borrowing->key;

        // Determine final statuses based on condition
        if ($condition === 'damaged') {
            $borrowingStatus = 'damaged';
            $keyStatus = 'damaged';
        } elseif ($condition === 'missing') {
            $borrowingStatus = 'lost';
            $keyStatus = 'lost';
        } else {
            $borrowingStatus = 'returned';
            $keyStatus = 'available';
        }

        $borrowing->update([
            'status' => $borrowingStatus,
            'returned_at' => $returnedAt,
            'return_condition' => $condition,
            'notes' => trim(($borrowing->notes ?? '') . "\nReturn notes: " . $notes),
        ]);

        $key->update(['status' => $keyStatus]);

        ActivityLog::log(
            'RETURN_KEY',
            "Key '{$key->name}' ({$key->key_code}) returned by {$borrowing->user->name} in '{$condition}' condition. Key status is now '{$keyStatus}'."
        );

        return back()->with('success', "Key '{$key->name}' marked as returned ({$condition}). Key status is now {$keyStatus}.");
    }

    /**
     * Staff reports key as lost or damaged.
     */
    public function reportIssue(Request $request, Borrowing $borrowing): RedirectResponse
    {
        $validated = $request->validate([
            'issue_type' => ['required', 'in:lost,damaged'],
            'notes' => ['required', 'string', 'max:500'],
        ]);

        $issueType = $validated['issue_type'];
        $key = $borrowing->key;

        $status = $issueType === 'lost' ? 'lost' : 'damaged';
        $condition = $issueType === 'lost' ? 'missing' : 'damaged';

        $borrowing->update([
            'status' => $status,
            'return_condition' => $condition,
            'notes' => trim(($borrowing->notes ?? '') . "\nStaff Report ({$issueType}): " . $validated['notes']),
        ]);

        $key->update(['status' => $status]);

        ActivityLog::log(
            strtoupper("KEY_{$issueType}_REPORT"),
            "User {$request->user()->name} reported key '{$key->name}' as {$issueType}. Notes: {$validated['notes']}"
        );

        return back()->with('success', "Thank you. Key '{$key->name}' has been reported as {$issueType}. Administration has been notified.");
    }
}

