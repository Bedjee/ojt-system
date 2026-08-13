<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'trainee_id',
        'department_id',
        'date',
        'morning_time_in',
        'lunch_time_out',
        'afternoon_time_in',
        'time_out',
        'morning_hours',
        'afternoon_hours',
        'total_hours',
        'status',
        'is_manual',
    'scanned_latitude',
    'scanned_longitude',
    'distance_from_department',
    ];

    protected $casts = [
        'date' => 'date',
        'morning_time_in' => 'datetime',
        'lunch_time_out' => 'datetime',
        'afternoon_time_in' => 'datetime',
        'time_out' => 'datetime',
        'morning_hours' => 'decimal:2',
        'afternoon_hours' => 'decimal:2',
        'total_hours' => 'decimal:2',
        'scanned_latitude' => 'decimal:7',
    'scanned_longitude' => 'decimal:7',
    'distance_from_department' => 'integer',
    ];

    public function trainee()
    {
        return $this->belongsTo(Trainee::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function corrections()
{
    return $this->hasMany(AttendanceCorrection::class);
}

public function getIsCorrectedAttribute()
{
    return $this->corrections()->exists();
}
}
