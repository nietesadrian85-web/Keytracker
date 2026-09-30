<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\Borrowing;
use App\Models\Key;
use Carbon\Carbon;

class OverdueService
{
    /**
     * Scan and update all borrowings that have exceeded their expected return date.
     *
     * @return int Number of borrowings marked overdue
     */
    public static function checkAndUpdateOverdue(): int
    {
        $now = Carbon::now();

        // Get borrowings that are currently 'borrowed' or 'approved' but past due
        $overdueBorrowings = Borrowing::whereIn('status', ['borrowed', 'approved'])
            ->whereNotNull('expected_return_at')
            ->where('expected_return_at', '<', $now)
            ->with(['key', 'user'])
            ->get();

        $count = 0;

        foreach ($overdueBorrowings as $borrowing) {
            $borrowing->update(['status' => 'overdue']);

            if ($borrowing->key && $borrowing->key->status === 'borrowed') {
                $borrowing->key->update(['status' => 'overdue']);
            }

            ActivityLog::log(
                'KEY_OVERDUE',
                "Key '{$borrowing->key?->name}' ({$borrowing->key?->key_code}) borrowed by {$borrowing->user?->name} is now overdue (due: {$borrowing->expected_return_at?->format('M d, Y H:i')}).",
                $borrowing->user_id
            );

            $count++;
        }

        return $count;
    }
}

