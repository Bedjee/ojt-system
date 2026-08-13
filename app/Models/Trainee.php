<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trainee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'contact_number',
        'school',
        'course',
        'year_level',
        'start_date',
        'expected_end_date',
        'required_hours',
        'department_id',
        'supervisor',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'expected_end_date' => 'date',
        'required_hours' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function getFullNameAttribute(): string
{
    return $this->first_name . ' ' . ($this->middle_name ? $this->middle_name . ' ' : '') . $this->last_name;
}


public function attendances()
{
    return $this->hasMany(Attendance::class);
}

public function getTodayAttendance()
{
    return $this->attendances()->whereDate('date', now()->toDateString())->first();
}



public function getRenderedHoursAttribute()
{
    return $this->attendances()->sum('total_hours');
}

public function getRemainingHoursAttribute()
{
    return $this->required_hours - $this->rendered_hours;
}

public function getCompletionPercentageAttribute()
{
    if ($this->required_hours == 0) return 0;
    return round(($this->rendered_hours / $this->required_hours) * 100, 1);
}
}
