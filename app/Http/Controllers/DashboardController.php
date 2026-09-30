<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Borrowing;
use App\Models\Key;
use App\Services\OverdueService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        // Automatically ensure overdue statuses are up to date
        OverdueService::checkAndUpdateOverdue();

        $user = $request->user();

        // Overall key counts
        $totalKeys = Key::count();
        $availableKeys = Key::where('status', 'available')->count();
        $borrowedKeys = Key::where('status', 'borrowed')->count();
        $overdueKeys = Key::where('status', 'overdue')->count();
        $lostKeys = Key::where('status', 'lost')->count();
        $damagedKeys = Key::where('status', 'damaged')->count();
        $pendingRequestsCount = Borrowing::where('status', 'pending')->count();

        // Recent borrowing activity
        $recentActivity = ActivityLog::with('user')
            ->latest()
            ->take(8)
            ->get();

        // Pending requests for quick approval
        $pendingRequests = Borrowing::with(['key', 'user'])
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get();

        // Overdue keys list with borrower info
        $overdueList = Borrowing::with(['key', 'user'])
            ->where('status', 'overdue')
            ->latest('expected_return_at')
            ->take(6)
            ->get();

        // Recent returned keys
        $recentReturned = Borrowing::with(['key', 'user', 'approver'])
            ->where('status', 'returned')
            ->latest('returned_at')
            ->take(5)
            ->get();

        // Staff-specific active borrowings
        $myActiveBorrowings = Borrowing::with('key')
            ->where('user_id', $user->id)
            ->whereIn('status', ['borrowed', 'overdue', 'pending'])
            ->latest()
            ->get();

        // Status breakdown data for simple visual chart
        $statusBreakdown = [
            ['name' => 'Available', 'count' => $availableKeys, 'color' => '#10B981'],
            ['name' => 'Borrowed', 'count' => $borrowedKeys, 'color' => '#3B82F6'],
            ['name' => 'Overdue', 'count' => $overdueKeys, 'color' => '#EF4444'],
            ['name' => 'Lost', 'count' => $lostKeys, 'color' => '#6B7280'],
            ['name' => 'Damaged', 'count' => $damagedKeys, 'color' => '#F59E0B'],
        ];

        $availableKeysList = Key::where('status', 'available')->orderBy('name')->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_keys' => $totalKeys,
                'available_keys' => $availableKeys,
                'borrowed_keys' => $borrowedKeys,
                'overdue_keys' => $overdueKeys,
                'lost_keys' => $lostKeys,
                'damaged_keys' => $damagedKeys,
                'pending_requests' => $pendingRequestsCount,
            ],
            'recentActivity' => $recentActivity,
            'pendingRequests' => $pendingRequests,
            'overdueList' => $overdueList,
            'recentReturned' => $recentReturned,
            'myActiveBorrowings' => $myActiveBorrowings,
            'statusBreakdown' => $statusBreakdown,
            'availableKeys' => $availableKeysList,
        ]);
    }
}
