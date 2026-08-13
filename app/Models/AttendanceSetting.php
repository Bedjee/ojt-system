<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttendanceSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'morning_time_in_start',
        'morning_time_in_end',
        'lunch_time_out_start',
        'lunch_time_out_end',
        'afternoon_time_in_start',
        'afternoon_time_in_end',
        'time_out_start',
    ];

    protected $casts = [
        'morning_time_in_start' => 'datetime:H:i',
        'morning_time_in_end' => 'datetime:H:i',
        'lunch_time_out_start' => 'datetime:H:i',
        'lunch_time_out_end' => 'datetime:H:i',
        'afternoon_time_in_start' => 'datetime:H:i',
        'afternoon_time_in_end' => 'datetime:H:i',
        'time_out_start' => 'datetime:H:i',
    ];

    // Helper to get the single settings record
    public static function getSettings()
    {
        return self::firstOrCreate([], [
            'morning_time_in_start' => '07:00:00',
            'morning_time_in_end' => '11:59:00',
            'lunch_time_out_start' => '12:00:00',
            'lunch_time_out_end' => '12:30:00',
            'afternoon_time_in_start' => '12:31:00',
            'afternoon_time_in_end' => '16:59:00',
            'time_out_start' => '17:00:00',
        ]);
    }
}
