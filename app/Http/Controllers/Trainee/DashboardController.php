<?php

namespace App\Http\Controllers\Trainee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $trainee = $user->trainee;

        if (!$trainee) {
            return Inertia::render('Trainee/Dashboard', [
                'trainee' => null,
                'todayAttendance' => null,
                'recentAttendances' => [],
                'progress' => null,
            ]);
        }

        // Today's attendance
        $todayAttendance = $trainee->attendances()
            ->whereDate('date', Carbon::today())
            ->first();

        // Recent attendances (last 5)
        $recentAttendances = $trainee->attendances()
            ->with('department')
            ->whereDate('date', '<', Carbon::today())
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($att) => [
                'date' => $att->date->format('M d, Y'),
                'morning_time_in' => $att->morning_time_in?->format('g:i A'),
                'lunch_time_out' => $att->lunch_time_out?->format('g:i A'),
                'afternoon_time_in' => $att->afternoon_time_in?->format('g:i A'),
                'time_out' => $att->time_out?->format('g:i A'),
                'total_hours' => $att->total_hours ?? 0,
                'status' => $att->status,
            ]);

        // Progress
        $rendered = $trainee->rendered_hours;
        $required = $trainee->required_hours;
        $remaining = $trainee->remaining_hours;
        $percent = $trainee->completion_percentage;

        return Inertia::render('Trainee/Dashboard', [
            'trainee' => [
                'id' => $trainee->id,
                'first_name' => $trainee->first_name,
                'last_name' => $trainee->last_name,
                'email' => $trainee->email,
                'school' => $trainee->school,
                'course' => $trainee->course,
                'year_level' => $trainee->year_level,
                'start_date' => $trainee->start_date->format('M d, Y'),
                'expected_end_date' => $trainee->expected_end_date?->format('M d, Y'),
                'required_hours' => $required,
                'department' => $trainee->department?->name ?? 'N/A',
                'supervisor' => $trainee->supervisor ?? 'N/A',
                'status' => $trainee->status,
            ],
            'todayAttendance' => $todayAttendance ? [
                'date' => $todayAttendance->date->format('Y-m-d'),
                'morning_time_in' => $todayAttendance->morning_time_in?->format('g:i A'),
                'lunch_time_out' => $todayAttendance->lunch_time_out?->format('g:i A'),
                'afternoon_time_in' => $todayAttendance->afternoon_time_in?->format('g:i A'),
                'time_out' => $todayAttendance->time_out?->format('g:i A'),
                'morning_hours' => $todayAttendance->morning_hours ?? 0,
                'afternoon_hours' => $todayAttendance->afternoon_hours ?? 0,
                'total_hours' => $todayAttendance->total_hours ?? 0,
                'status' => $todayAttendance->status,
            ] : null,
            'recentAttendances' => $recentAttendances,
            'progress' => [
                'rendered' => $rendered,
                'required' => $required,
                'remaining' => $remaining,
                'percent' => $percent,
            ],
        ]);
    }
}
