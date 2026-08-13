<?php

namespace App\Http\Controllers\Trainee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $trainee = $user->trainee;

        if (!$trainee) {
            return redirect()->route('trainee.dashboard')
                ->with('error', 'Trainee profile not found.');
        }

        $query = Attendance::where('trainee_id', $trainee->id)
            ->with(['department']);

        // Default to current month if no date filters
        if (!$request->filled('date_from') && !$request->filled('date_to')) {
            $query->whereMonth('date', Carbon::now()->month)
                  ->whereYear('date', Carbon::now()->year);
        } else {
            if ($request->filled('date_from')) {
                $query->whereDate('date', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $query->whereDate('date', '<=', $request->date_to);
            }
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $records = $query->orderBy('date', 'desc')
            ->get()
            ->map(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'date' => $attendance->date->format('Y-m-d'),
                    'morning_time_in' => $attendance->morning_time_in?->format('g:i A'),
                    'lunch_time_out' => $attendance->lunch_time_out?->format('g:i A'),
                    'afternoon_time_in' => $attendance->afternoon_time_in?->format('g:i A'),
                    'time_out' => $attendance->time_out?->format('g:i A'),
                    'morning_hours' => $attendance->morning_hours ?? 0,
                    'afternoon_hours' => $attendance->afternoon_hours ?? 0,
                    'total_hours' => $attendance->total_hours ?? 0,
                    'status' => $attendance->status,
                    'department' => $attendance->department?->name ?? 'N/A',
                ];
            });

        $statuses = ['present', 'absent', 'incomplete'];

        // Unique dates with attendance
        $attendanceDates = $records->pluck('date')->unique()->values()->toArray();

        return Inertia::render('Trainee/Attendance/Index', [
            'records' => $records,
            'attendanceDates' => $attendanceDates,
            'filters' => $request->only(['date_from', 'date_to', 'status']),
            'statuses' => $statuses,
        ]);
    }




    public function export(Request $request)
    {
        $user = auth()->user();
        $trainee = $user->trainee;

        if (!$trainee) {
            return back()->with('error', 'Trainee profile not found.');
        }

        $query = Attendance::where('trainee_id', $trainee->id);

        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $records = $query->orderBy('date', 'desc')->get();

        $csvData = [];
        $csvData[] = ['Date', 'Department', 'Morning In', 'Lunch Out', 'Afternoon In', 'Time Out', 'Morning Hrs', 'Afternoon Hrs', 'Total Hrs', 'Status'];

        foreach ($records as $att) {
            $csvData[] = [
                $att->date->format('Y-m-d'),
                $att->department?->name ?? 'N/A',
                $att->morning_time_in?->format('g:i A') ?? '',
                $att->lunch_time_out?->format('g:i A') ?? '',
                $att->afternoon_time_in?->format('g:i A') ?? '',
                $att->time_out?->format('g:i A') ?? '',
                $att->morning_hours ?? 0,
                $att->afternoon_hours ?? 0,
                $att->total_hours ?? 0,
                $att->status,
            ];
        }

        $filename = 'my_attendance_' . Carbon::now()->format('Ymd_His') . '.csv';
        $handle = fopen('php://temp', 'w+');
        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }
        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return response($content)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}
