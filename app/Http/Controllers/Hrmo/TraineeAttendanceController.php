<?php

namespace App\Http\Controllers\Hrmo;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Trainee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TraineeAttendanceController extends Controller
{
    public function index(Trainee $trainee)
    {
        $this->authorize('viewAny', Attendance::class);

        // Get all attendance records for this trainee (for calendar highlighting)
        $records = $trainee->attendances()
            ->with('department')
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($att) {
                return [
                    'id' => $att->id,
                    'date' => $att->date->format('Y-m-d'),
                    'morning_time_in' => $att->morning_time_in?->format('g:i A'),
                    'lunch_time_out' => $att->lunch_time_out?->format('g:i A'),
                    'afternoon_time_in' => $att->afternoon_time_in?->format('g:i A'),
                    'time_out' => $att->time_out?->format('g:i A'),
                    'morning_hours' => $att->morning_hours ?? 0,
                    'afternoon_hours' => $att->afternoon_hours ?? 0,
                    'total_hours' => $att->total_hours ?? 0,
                    'status' => $att->status,
                    'department' => $att->department?->name ?? 'N/A',
                    'is_manual' => $att->is_manual,
                ];
            });

        // Build array of dates with attendance (for highlighting)
        $attendanceDates = $records->pluck('date')->unique()->values()->toArray();

        return Inertia::render('Hrmo/Trainees/Attendance/Index', [
            'trainee' => [
                'id' => $trainee->id,
                'full_name' => $trainee->full_name,
                'department' => $trainee->department?->name ?? 'N/A',
                'required_hours' => $trainee->required_hours,
                'rendered_hours' => $trainee->rendered_hours,
            ],
            'records' => $records,
            'attendanceDates' => $attendanceDates,
        ]);
    }

    public function store(Request $request, Trainee $trainee)
    {
        $this->authorize('update', $trainee);

        $validated = $request->validate([
            'date' => 'required|date',
            'morning_time_in' => 'nullable|date_format:H:i',
            'lunch_time_out' => 'nullable|date_format:H:i|after:morning_time_in',
            'afternoon_time_in' => 'nullable|date_format:H:i|after:lunch_time_out',
            'time_out' => 'nullable|date_format:H:i|after:afternoon_time_in',
        ]);

        // Parse date and times
        $date = Carbon::parse($validated['date']);
        $morningIn = $validated['morning_time_in'] ? Carbon::parse($validated['date'] . ' ' . $validated['morning_time_in']) : null;
        $lunchOut = $validated['lunch_time_out'] ? Carbon::parse($validated['date'] . ' ' . $validated['lunch_time_out']) : null;
        $afternoonIn = $validated['afternoon_time_in'] ? Carbon::parse($validated['date'] . ' ' . $validated['afternoon_time_in']) : null;
        $timeOut = $validated['time_out'] ? Carbon::parse($validated['date'] . ' ' . $validated['time_out']) : null;

        // Find or create attendance record for this date
        $attendance = Attendance::firstOrNew([
            'trainee_id' => $trainee->id,
            'date' => $date->toDateString(),
        ]);

        // If record exists and is already from QR (non‑manual), we should not overwrite?
        // For safety, we allow update but mark as manual.
        $attendance->department_id = $trainee->department_id; // current dept at time of addition
        $attendance->morning_time_in = $morningIn;
        $attendance->lunch_time_out = $lunchOut;
        $attendance->afternoon_time_in = $afternoonIn;
        $attendance->time_out = $timeOut;
        $attendance->is_manual = true; // mark as manually added

        // Recalculate hours (capped at 8)
        $this->calculateHours($attendance);

        $attendance->save();

        // Optionally update trainee's total rendered hours? Not needed – computed on the fly.

        return redirect()->back()->with('success', 'Attendance saved successfully.');
    }

    public function destroy(Trainee $trainee, Attendance $attendance)
    {
        $this->authorize('delete', $trainee);

        // Only allow deletion of manual records
        if (!$attendance->is_manual) {
            return back()->with('error', 'Cannot delete QR‑based attendance.');
        }

        $attendance->delete();

        return redirect()->back()->with('success', 'Attendance record deleted.');
    }

/**
 * Calculate hours using the same working schedule logic.
 */
private function calculateHours(Attendance $attendance)
{
    $morningHours = 0;
    $afternoonHours = 0;

    $date = $attendance->date;

    $morningStart = Carbon::parse($date->format('Y-m-d') . ' 08:00:00');
    $morningEnd   = Carbon::parse($date->format('Y-m-d') . ' 12:00:00');
    $afternoonStart = Carbon::parse($date->format('Y-m-d') . ' 13:00:00');
    $afternoonEnd   = Carbon::parse($date->format('Y-m-d') . ' 17:00:00');

    if ($attendance->morning_time_in && $attendance->lunch_time_out) {
        $morningIn  = $attendance->morning_time_in;
        $lunchOut   = $attendance->lunch_time_out;
        $actualStart = $morningIn->gt($morningStart) ? $morningIn : $morningStart;
        $actualEnd   = $lunchOut->lt($morningEnd) ? $lunchOut : $morningEnd;
        if ($actualEnd->gt($actualStart)) {
            $morningHours = $actualStart->diffInHours($actualEnd, true);
        }
    }

    if ($attendance->afternoon_time_in && $attendance->time_out) {
        $afternoonIn = $attendance->afternoon_time_in;
        $timeOut     = $attendance->time_out;
        $actualStart = $afternoonIn->gt($afternoonStart) ? $afternoonIn : $afternoonStart;
        $actualEnd   = $timeOut->lt($afternoonEnd) ? $timeOut : $afternoonEnd;
        if ($actualEnd->gt($actualStart)) {
            $afternoonHours = $actualStart->diffInHours($actualEnd, true);
        }
    }

    $totalHours = $morningHours + $afternoonHours;
    $totalHours = min($totalHours, 8);

    $attendance->morning_hours   = round($morningHours, 2);
    $attendance->afternoon_hours = round($afternoonHours, 2);
    $attendance->total_hours     = round($totalHours, 2);

    // Status
    if ($attendance->morning_time_in && $attendance->lunch_time_out &&
        $attendance->afternoon_time_in && $attendance->time_out) {
        $attendance->status = 'present';
    } elseif ($attendance->morning_time_in || $attendance->lunch_time_out ||
              $attendance->afternoon_time_in || $attendance->time_out) {
        $attendance->status = 'incomplete';
    } else {
        $attendance->status = 'absent';
    }

    $attendance->save();
}


    public function list(Request $request, Trainee $trainee)
{
    $this->authorize('view', $trainee);

    $query = $trainee->attendances()
        ->with('department')
        ->orderBy('date', 'desc');

    // Apply filters
    if ($request->filled('date_from')) {
        $query->whereDate('date', '>=', $request->date_from);
    }
    if ($request->filled('date_to')) {
        $query->whereDate('date', '<=', $request->date_to);
    }
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    // Paginate with 25 rows per page for compact view
    $records = $query->paginate(25)
        ->through(function ($attendance) {
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
                'is_manual' => $attendance->is_manual,
            ];
        });

    $statuses = ['present', 'absent', 'incomplete'];

    return Inertia::render('Hrmo/Trainees/AttendanceList', [
        'trainee' => [
            'id' => $trainee->id,
            'full_name' => $trainee->full_name,
            'email' => $trainee->email,
            'department' => $trainee->department?->name ?? 'N/A',
            'required_hours' => $trainee->required_hours,
            'rendered_hours' => $trainee->rendered_hours,
            'remaining_hours' => $trainee->remaining_hours,
            'progress' => $trainee->completion_percentage,
        ],
        'records' => $records,
        'filters' => $request->only(['date_from', 'date_to', 'status']),
        'statuses' => $statuses,
    ]);
}



}
