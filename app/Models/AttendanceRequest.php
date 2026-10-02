<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRequest extends Model
{
    protected $fillable = [
        'trainee_id', 'date', 'requested_fields', 'requested_times',
        'reason', 'verification_image', 'status',
        'reviewed_by', 'reviewed_at', 'review_notes',
    ];

    protected $casts = [
        'date'             => 'date',
        'requested_fields' => 'array',
        'requested_times'  => 'array',
        'reviewed_at'      => 'datetime',
    ];

    /** DB slot => human-readable label */
    public const FIELD_LABELS = [
        'morning_time_in'   => 'Morning Time In',
        'lunch_time_out'    => 'Morning Time Out (Lunch Break)',
        'afternoon_time_in' => 'Afternoon Time In (Back from Lunch)',
        'time_out'          => 'Time Out (End of Day)',
    ];

    public function trainee(): BelongsTo
    {
        return $this->belongsTo(Trainee::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function scopePending($q)
    {
        return $q->where('status', 'pending');
    }

    public function getFieldLabelsAttribute(): array
    {
        return collect($this->requested_fields ?? [])
            ->map(fn ($f) => self::FIELD_LABELS[$f] ?? $f)
            ->values()
            ->all();
    }
}