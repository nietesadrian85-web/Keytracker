<?php

use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KeyController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Keys view (all authenticated users can view keys)
    Route::get('keys', [KeyController::class, 'index'])->name('keys.index');

    // Borrowing (Staff & Admin)
    Route::get('borrowing/my-keys', [BorrowingController::class, 'myBorrowed'])->name('borrowing.my-keys');
    Route::post('borrowing/request', [BorrowingController::class, 'store'])->name('borrowing.store');
    Route::post('borrowing/{borrowing}/report-issue', [BorrowingController::class, 'reportIssue'])->name('borrowing.report-issue');

    // Transactions History (Admin sees all, Staff sees own)
    Route::get('transactions', [BorrowingController::class, 'index'])->name('transactions.index');

    // Notifications Center
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');

    // Admin-Only Routes
    Route::middleware(['admin'])->group(function () {
        // Key management actions
        Route::post('keys', [KeyController::class, 'store'])->name('keys.store');
        Route::put('keys/{key}', [KeyController::class, 'update'])->name('keys.update');
        Route::delete('keys/{key}', [KeyController::class, 'destroy'])->name('keys.destroy');
        Route::post('keys/{key}/lost', [KeyController::class, 'markLost'])->name('keys.lost');
        Route::post('keys/{key}/damaged', [KeyController::class, 'markDamaged'])->name('keys.damaged');

        // Borrowing approval / return actions
        Route::get('borrowing/requests', [BorrowingController::class, 'requests'])->name('borrowing.requests');
        Route::post('borrowing/{borrowing}/approve', [BorrowingController::class, 'approve'])->name('borrowing.approve');
        Route::post('borrowing/{borrowing}/reject', [BorrowingController::class, 'reject'])->name('borrowing.reject');
        Route::post('borrowing/{borrowing}/return', [BorrowingController::class, 'returnKey'])->name('borrowing.return');

        // User Management
        Route::get('users', [UserController::class, 'index'])->name('users.index');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::post('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        // Reports
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    });
});

require __DIR__.'/settings.php';
