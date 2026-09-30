<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Key extends Model
{
    use HasFactory;

    protected $fillable = [
        'key_code',
        'name',
        'description',
        'location',
        'key_type',
        'status',
    ];

    public function borrowings(): HasMany
    {
        return $this->hasMany(Borrowing::class, 'key_id');
    }

    public function activeBorrowing(): HasOne
    {
        return $this->hasOne(Borrowing::class, 'key_id')
            ->whereIn('status', ['borrowed', 'overdue', 'pending'])
            ->latestOfMany();
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeBorrowed($query)
    {
        return $query->where('status', 'borrowed');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'overdue');
    }
}

