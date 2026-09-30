<?php

namespace App\Http\Controllers;

use App\Models\Borrowing;
use App\Models\Key;
use App\Services\OverdueService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        OverdueService::checkAndUpdateOverdue();

        $range = $request->input('range', 'month'); // 'today', 'week', 'month', 'year', 'all', 'custom'
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Borrowing::query();

        if ($range === 'today') {
            $query->whereDate('created_at', Carbon::today());
        } elseif ($range === 'week') {
            $query->where('created_at', '>=', Carbon::now()->startOfWeek());
        } elseif ($range === 'month') {
            $query->where('created_at', '>=', Carbon::now()->startOfMonth());
        } elseif ($range === 'year') {
            $query->where('created_at', '>=', Carbon::now()->startOfYear());
        } elseif ($range === 'custom' && $startDate && $endDate) {
            $query->whereDate('created_at', '>=', $startDate)
                ->whereDate('created_at', '<=', $endDate);
        }

        $totalTransactions = (clone $query)->count();
        $borrowedCount = (clone $query)->where('status', 'borrowed')->count();
        $returnedCount = (clone $query)->where('status', 'returned')->count();
        $overdueCount = (clone $query)->where('status', 'overdue')->count();
        $lostCount = (clone $query)->where('status', 'lost')->count();
        $damagedCount = (clone $query)->where('status', 'damaged')->count();

        // Most borrowed keys
        $mostBorrowedKeys = (clone $query)
            ->select('key_id', DB::raw('count(*) as borrow_count'))
            ->groupBy('key_id')
            ->orderByDesc('borrow_count')
            ->take(6)
            ->with('key')
            ->get()
            ->map(function ($item) {
                return [
                    'key_id' => $item->key_id,
                    'key_name' => $item->key?->name ?? 'Unknown Key',
                    'key_code' => $item->key?->key_code ?? 'N/A',
                    'location' => $item->key?->location ?? 'N/A',
                    'borrow_count' => $item->borrow_count,
                ];
            });

        // Activity breakdown by department
        $departmentBreakdown = (clone $query)
            ->join('users', 'borrowings.user_id', '=', 'users.id')
            ->select('users.department', DB::raw('count(*) as count'))
            ->whereNotNull('users.department')
            ->groupBy('users.department')
            ->orderByDesc('count')
            ->take(6)
            ->get();

        return Inertia::render('reports/index', [
            'metrics' => [
                'total_transactions' => $totalTransactions,
                'borrowed' => $borrowedCount,
                'returned' => $returnedCount,
                'overdue' => $overdueCount,
                'lost' => $lostCount,
                'damaged' => $damagedCount,
            ],
            'mostBorrowedKeys' => $mostBorrowedKeys,
            'departmentBreakdown' => $departmentBreakdown,
            'filters' => [
                'range' => $range,
                'start_date' => $startDate ?? '',
                'end_date' => $endDate ?? '',
            ],
        ]);
    }
}

