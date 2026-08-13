<?php

namespace App\Http\Controllers\Hrmo;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AttendanceCorrectionController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('update', Attendance::class);

        $validated = $request->validate([
            'attendance_id' => 'required|exists:attendances,id',
            'field' => 'required|in:morning_time_in,lunch_time_out,afternoon_time_in,time_out',
            'new_value' => 'nullable|date_format:Y-m-d H:i:s',
            'reason' => 'required|string|min:5|max:500',
        ]);

        $attendance = Attendance::findOrFail($validated['attendance_id']);

        // Prevent corrections on completed trainees
        if ($attendance->trainee->status === 'completed') {
            return back()->with('error', 'Cannot correct attendance for a completed trainee.');
        }

        // Store old value before update
        $oldValue = $attendance->{$validated['field']}?->format('Y-m-d H:i:s');

        DB::beginTransaction();

        try {
            // Update the attendance record
            $attendance->update([
                $validated['field'] => $validated['new_value'],
            ]);

            // Recalculate hours if needed
            $this->recalculateHours($attendance);

            // Create correction record
            AttendanceCorrection::create([
                'attendance_id' => $attendance->id,
                'corrected_by' => auth()->id(),
                'trainee_id' => $attendance->trainee_id,
                'old_values' => [
                    $validated['field'] => $oldValue,
                ],
                'new_values' => [
                    $validated['field'] => $validated['new_value'],
                ],
                'reason' => $validated['reason'],
            ]);

            DB::commit();

            return back()->with('success', 'Attendance corrected successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Attendance correction failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to correct attendance. Please try again.');
        }
    }

    private function recalculateHours(Attendance $attendance)
    {
        $morningHours = 0;
        $afternoonHours = 0;

        if ($attendance->morning_time_in && $attendance->lunch_time_out) {
            $morningHours = $attendance->morning_time_in->diffInHours($attendance->lunch_time_out);
        }

        if ($attendance->afternoon_time_in && $attendance->time_out) {
            $afternoonHours = $attendance->afternoon_time_in->diffInHours($attendance->time_out);
        }

        $totalHours = $morningHours + $afternoonHours;

        $attendance->morning_hours = round($morningHours, 2);
        $attendance->afternoon_hours = round($afternoonHours, 2);
        $attendance->total_hours = round($totalHours, 2);
        $attendance->status = $totalHours > 0 ? 'present' : 'incomplete';
        $attendance->save();
    }

    public function history(Attendance $attendance)
    {
        $this->authorize('view', $attendance);

        $corrections = $attendance->corrections()
            ->with(['correctedBy', 'trainee'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn($correction) => [
                'id' => $correction->id,
                'corrected_by' => $correction->correctedBy->name,
                'trainee' => $correction->trainee->full_name,
                'old_values' => $correction->old_values,
                'new_values' => $correction->new_values,
                'reason' => $correction->reason,
                'created_at' => $correction->created_at->format('Y-m-d H:i:s'),
            ]);

        return response()->json($corrections);
    }
}
