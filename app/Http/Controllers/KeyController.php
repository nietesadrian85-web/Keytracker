<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Key;
use App\Services\OverdueService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KeyController extends Controller
{
    public function index(Request $request): Response
    {
        OverdueService::checkAndUpdateOverdue();

        $query = Key::with(['activeBorrowing.user']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('key_code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($keyType = $request->input('key_type')) {
            $query->where('key_type', $keyType);
        }

        $keys = $query->latest()->paginate(12)->withQueryString();

        $keyTypes = Key::select('key_type')->distinct()->pluck('key_type')->filter()->values();
        $locations = Key::select('location')->distinct()->pluck('location')->filter()->values();

        return Inertia::render('keys/index', [
            'keys' => $keys,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'key_type' => $request->input('key_type', ''),
            ],
            'keyTypes' => $keyTypes,
            'locations' => $locations,
            'availableKeys' => Key::where('status', 'available')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'key_code' => ['required', 'string', 'max:50', 'unique:keys,key_code'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'key_type' => ['required', 'string', 'max:50'],
            'status' => ['required', 'in:available,borrowed,overdue,lost,damaged'],
        ]);

        $key = Key::create($validated);

        ActivityLog::log(
            'KEY_CREATED',
            "Added new key '{$key->name}' ({$key->key_code}) at {$key->location}."
        );

        return back()->with('success', "Key '{$key->name}' created successfully.");
    }

    public function update(Request $request, Key $key): RedirectResponse
    {
        $validated = $request->validate([
            'key_code' => ['required', 'string', 'max:50', 'unique:keys,key_code,' . $key->id],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'key_type' => ['required', 'string', 'max:50'],
            'status' => ['required', 'in:available,borrowed,overdue,lost,damaged'],
        ]);

        $key->update($validated);

        ActivityLog::log(
            'KEY_UPDATED',
            "Updated details for key '{$key->name}' ({$key->key_code})."
        );

        return back()->with('success', "Key '{$key->name}' updated successfully.");
    }

    public function destroy(Key $key): RedirectResponse
    {
        if ($key->status === 'borrowed' || $key->status === 'overdue') {
            return back()->with('error', "Cannot delete key '{$key->name}' because it is currently borrowed.");
        }

        $name = $key->name;
        $code = $key->key_code;
        $key->delete();

        ActivityLog::log(
            'KEY_DELETED',
            "Deleted key '{$name}' ({$code})."
        );

        return back()->with('success', "Key '{$name}' deleted successfully.");
    }

    public function markLost(Request $request, Key $key): RedirectResponse
    {
        $validated = $request->validate([
            'date_reported' => ['nullable', 'date'],
            'reported_by' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        $key->update(['status' => 'lost']);

        // If there is an active borrowing, mark it as lost too
        if ($active = $key->activeBorrowing) {
            $active->update([
                'status' => 'lost',
                'return_condition' => 'missing',
                'notes' => trim(($active->notes ?? '') . "\nLost report: " . ($validated['notes'] ?? '')),
            ]);
        }

        $reporter = $validated['reported_by'] ?: ($request->user()?->name ?? 'Admin');
        ActivityLog::log(
            'KEY_LOST',
            "Key '{$key->name}' ({$key->key_code}) reported lost by {$reporter}. Notes: " . ($validated['notes'] ?? 'None')
        );

        return back()->with('success', "Key '{$key->name}' has been marked as Lost.");
    }

    public function markDamaged(Request $request, Key $key): RedirectResponse
    {
        $validated = $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        $key->update(['status' => 'damaged']);

        if ($active = $key->activeBorrowing) {
            $active->update([
                'status' => 'damaged',
                'return_condition' => 'damaged',
                'notes' => trim(($active->notes ?? '') . "\nDamaged report: " . ($validated['notes'] ?? '')),
            ]);
        }

        ActivityLog::log(
            'KEY_DAMAGED',
            "Key '{$key->name}' ({$key->key_code}) marked as damaged. Notes: " . ($validated['notes'] ?? 'None')
        );

        return back()->with('success', "Key '{$key->name}' has been marked as Damaged.");
    }
}
