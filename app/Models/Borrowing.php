<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Borrowing extends Model
{
    use HasFactory;

    protected $fillable = [
        'key_id',
        'user_id',
        'purpose',
        'borrowed_at',
        'expected_return_at',
        'returned_at',
        'status',
        'approved_by',
        'return_condition',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'borrowed_at' => 'datetime',
            'expected_return_at' => 'datetime',
            'returned_at' => 'datetime',
        ];
    }

    public function key(): BelongsTo
    {
        return $this->belongsTo(Key::class, 'key_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['borrowed', 'overdue']);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function isOverdue(): bool
    {
        if ($this->status === 'returned' || $this->status === 'rejected') {
            return false;
        }

        return $this->expected_return_at && $this->expected_return_at->isPast();
    }
}

