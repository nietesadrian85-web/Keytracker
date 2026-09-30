<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Borrowing;
use App\Services\OverdueService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        OverdueService::checkAndUpdateOverdue();

        $user = $request->user();

        // Overdue notifications
        $overdueQuery = Borrowing::with(['key', 'user'])
            ->where('status', 'overdue')
            ->latest('expected_return_at');

        if (! $user->isAdmin()) {
            $overdueQuery->where('user_id', $user->id);
        }
        $overdueItems = $overdueQuery->take(10)->get();

        // Pending requests notifications
        $pendingQuery = Borrowing::with(['key', 'user'])
            ->where('status', 'pending')
            ->latest();

        if (! $user->isAdmin()) {
            $pendingQuery->where('user_id', $user->id);
        }
        $pendingItems = $pendingQuery->take(10)->get();

        // Recent issues (lost or damaged)
        $issueQuery = Borrowing::with(['key', 'user'])
            ->whereIn('status', ['lost', 'damaged'])
            ->latest('updated_at');

        if (! $user->isAdmin()) {
            $issueQuery->where('user_id', $user->id);
        }
        $issueItems = $issueQuery->take(10)->get();

        // Recent logs
        $logs = ActivityLog::with('user')
            ->latest()
            ->take(15)
            ->get();

        return Inertia::render('notifications/index', [
            'overdueItems' => $overdueItems,
            'pendingItems' => $pendingItems,
            'issueItems' => $issueItems,
            'logs' => $logs,
        ]);
    }
}

