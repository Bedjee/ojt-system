<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\AttendanceRequest;
use App\Models\AttendanceSetting;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AttendanceRequestService
{
    public function __construct(private AttendanceService $attendanceService) {}

    /**
     * Approve a request and fill ONLY the missing attendance fields.
     * Never overwrites existing data.
     */
   public function approve(AttendanceRequest $request, int $reviewerId, ?string $notes = null): void
{
    DB::transaction(function () use ($request, $reviewerId, $notes) {
        $trainee = $request->trainee;
        $date    = $request->date;

        $attendance = Attendance::firstOrNew([
            'trainee_id' => $trainee->id,
            'date'       => $date->toDateString(),
        ]);

        if (!$attendance->exists) {
            $attendance->department_id = $trainee->department_id;
            $attendance->status        = 'absent';
        }

        foreach ($request->requested_fields as $field) {
            if (!empty($attendance->{$field})) {
                continue; // never overwrite
            }

            $claimed = $request->requested_times[$field] ?? null;
            $time    = $claimed
                ? Carbon::parse($date->format('Y-m-d').' '.$claimed.':00')
                : $this->defaultTimeFor($field, $date);

            $attendance->{$field} = $time->second(0);
        }

        $attendance->save();

        // Recompute hours + status
        try {
            $this->attendanceService->calculateDailyHours($attendance);
        } catch (\Throwable $e) {
            \Log::error('calculateDailyHours failed during request approval', [
                'attendance_id' => $attendance->id,
                'request_id'    => $request->id,
                'error'         => $e->getMessage(),
                'trace'         => $e->getTraceAsString(),
            ]);
            throw $e; // keep the transaction rollback behavior
        }

        \Log::info('Attendance request approved', [
            'request_id'     => $request->id,
            'attendance_id'  => $attendance->id,
            'date'           => $attendance->date->format('Y-m-d'),
            'filled_fields'  => $request->requested_fields,
            'total_hours'    => $attendance->total_hours,
            'status'         => $attendance->status,
        ]);

        $request->update([
            'status'       => 'approved',
            'reviewed_by'  => $reviewerId,
            'reviewed_at'  => now(),
            'review_notes' => $notes,
        ]);
    });
}
    /**
     * Fallback times when the trainee didn't provide a specific time.
     * Pulls from AttendanceSetting so it matches your configured schedule.
     */
    private function defaultTimeFor(string $field, Carbon $date): Carbon
    {
        $settings = AttendanceSetting::getSettings();
        $dateStr  = $date->format('Y-m-d');

        $default = match ($field) {
            'morning_time_in'   => $settings->morning_time_in_start,
            'lunch_time_out'    => $settings->lunch_time_out_start,
            'afternoon_time_in' => $settings->afternoon_time_in_start,
            'time_out'          => $settings->time_out_start,
            default             => Carbon::parse('08:00:00'),
        };

        return Carbon::parse($dateStr . ' ' . $default->format('H:i:s'));
    }
}