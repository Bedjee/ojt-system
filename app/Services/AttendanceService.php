<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\AttendanceSetting;
use App\Models\Trainee;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AttendanceService
{
    protected $settings;

    public function __construct()
    {
        $this->settings = AttendanceSetting::getSettings();
    }

    /**
     * Process a QR scan – determines the next logical action and records it.
     */
    public function processScan(
    Trainee $trainee,
    string $scannedData,
    $currentTime = null,
    $latitude = null,
    $longitude = null
) {
    // 1. Validate QR secret
    $secret = config('app.attendance_qr_secret', 'OJT_ATTENDANCE_2025');
    if ($scannedData !== $secret) {
        throw new \Exception('Invalid QR code.');
    }

    // 2. Check if trainee is completed
    if ($trainee->status === 'completed') {
        throw new \Exception('You have already completed your OJT. No further attendance allowed.');
    }

    $now = $currentTime ? Carbon::parse($currentTime) : Carbon::now();

    // 3. Geofencing validation (if department has coordinates and geofencing enabled)
    $department = $trainee->department;
    if ($department && $department->geofencing_enabled && $department->latitude && $department->longitude) {
        if ($latitude === null || $longitude === null) {
            throw new \Exception('Location access is required to record attendance. Please enable GPS.');
        }

        $distance = \App\Helpers\GeolocationHelper::calculateDistance(
            $department->latitude,
            $department->longitude,
            $latitude,
            $longitude
        );

        if ($distance > $department->allowed_radius) {
            throw new \Exception(sprintf(
                'You are too far from your department location. Distance: %d meters. Maximum allowed: %d meters.',
                round($distance),
                $department->allowed_radius
            ));
        }
    } else {
        // If no location set, we still record the scanned location for audit (without validation)
        // but we allow attendance to proceed.
    }

    // 4. Get or create today's attendance record
    $attendance = Attendance::firstOrNew([
        'trainee_id' => $trainee->id,
        'date' => $now->toDateString(),
    ]);

    if (!$attendance->exists) {
        $attendance->department_id = $trainee->department_id;
    }

    // Store scanned location (if provided)
    if ($latitude !== null && $longitude !== null) {
        $attendance->scanned_latitude = $latitude;
        $attendance->scanned_longitude = $longitude;
        if ($department && $department->latitude && $department->longitude) {
            $attendance->distance_from_department = (int) round(
                \App\Helpers\GeolocationHelper::calculateDistance(
                    $department->latitude,
                    $department->longitude,
                    $latitude,
                    $longitude
                )
            );
        }
    }

    // 5. Determine the next logical action
    $result = $this->determineAction($now, $attendance);

    if ($result['action'] === null) {
        throw new \Exception($result['message']);
    }

    // 6. Record the action
    $this->recordAction($attendance, $result['action'], $now);

    // 7. Recalculate hours after Time Out
    if ($result['action'] === 'time_out') {
        $this->calculateDailyHours($attendance);
    }

    // 8. Build feedback
    return $this->buildFeedback($attendance, $trainee, $result['action'], $now, $result['message']);
}
    /**
     * Determine the next logical action with clear messaging.
     */
protected function determineAction(Carbon $now, Attendance $attendance)
{
    $time = $now->format('H:i:s');
    $timeDisplay = $now->format('g:i A');

    $morningStart = $this->settings->morning_time_in_start->format('H:i:s');
    $morningEnd   = $this->settings->morning_time_in_end->format('H:i:s');
    $lunchStart   = $this->settings->lunch_time_out_start->format('H:i:s');
    $lunchEnd     = $this->settings->lunch_time_out_end->format('H:i:s');
    $afternoonStart = $this->settings->afternoon_time_in_start->format('H:i:s');
    $afternoonEnd   = $this->settings->afternoon_time_in_end->format('H:i:s');
    $timeoutStart   = $this->settings->time_out_start->format('H:i:s');

    Log::debug('Determining action', [
        'time' => $time,
        'morning_in' => $attendance->morning_time_in,
        'lunch_out' => $attendance->lunch_time_out,
        'afternoon_in' => $attendance->afternoon_time_in,
        'time_out' => $attendance->time_out,
    ]);

    // ---- 1. If already timed out, block all ----
    if (!is_null($attendance->time_out)) {
        return [
            'action' => null,
            'message' => "You already clocked out today at " . $attendance->time_out->format('g:i A') . ". Your attendance for today is complete.",
        ];
    }

    // ---- 2. If afternoon_in exists and we are in time‑out window, allow time out ----
    if (!is_null($attendance->afternoon_time_in) && $time >= $timeoutStart) {
        return [
            'action' => 'time_out',
            'message' => "Time Out recorded successfully at {$timeDisplay}. Have a great evening!",
        ];
    }

    // ---- 3. Duplicate checks for other actions (only if not in time‑out) ----
    // Prevent duplicate morning in
    if (!is_null($attendance->morning_time_in) && $time >= $morningStart && $time <= $morningEnd) {
        return [
            'action' => null,
            'message' => "Your morning Time In was already recorded at " . $attendance->morning_time_in->format('g:i A') . ".",
        ];
    }

    // Prevent duplicate lunch out
    if (!is_null($attendance->lunch_time_out) && $time >= $lunchStart && $time <= $lunchEnd) {
        return [
            'action' => null,
            'message' => "Your lunch Time Out was already recorded at " . $attendance->lunch_time_out->format('g:i A') . ".",
        ];
    }

    // Prevent duplicate afternoon in
    if (!is_null($attendance->afternoon_time_in) && $time >= $afternoonStart && $time <= $afternoonEnd) {
        return [
            'action' => null,
            'message' => "Your afternoon Time In was already recorded at " . $attendance->afternoon_time_in->format('g:i A') . ".",
        ];
    }

    // ---- 4. Normal flow: Morning In ----
    if (is_null($attendance->morning_time_in)) {
        if ($time >= $morningStart && $time <= $morningEnd) {
            return ['action' => 'morning_time_in', 'message' => "Morning Time In recorded successfully at {$timeDisplay}."];
        }
        if ($time >= $afternoonStart && $time <= $afternoonEnd) {
            return ['action' => 'afternoon_time_in', 'message' => "Afternoon Time In recorded successfully at {$timeDisplay}."];
        }
        if ($time >= $timeoutStart) {
            return ['action' => null, 'message' => "You have not clocked in today. Please see HR for assistance."];
        }
        if ($time < $morningStart) {
            return ['action' => null, 'message' => "Good morning! It's too early ({$timeDisplay}). The earliest allowed Time In is " . $this->settings->morning_time_in_start->format('g:i A') . "."];
        }
        return ['action' => null, 'message' => "No valid attendance action at this time. (Current time: {$timeDisplay})"];
    }

    // ---- 5. Normal flow: Lunch Out ----
    if (is_null($attendance->lunch_time_out)) {
        if ($time >= $lunchStart && $time <= $lunchEnd) {
            return ['action' => 'lunch_time_out', 'message' => "Lunch Time Out recorded successfully at {$timeDisplay}."];
        }
        if ($time >= $afternoonStart && $time <= $afternoonEnd) {
            return ['action' => 'afternoon_time_in', 'message' => "Afternoon Time In recorded successfully at {$timeDisplay}."];
        }
        // If we are past afternoon and still no lunch out, maybe allow time out?
        // Already handled at step 2, but if we get here, it's between windows.
        return ['action' => null, 'message' => "You have a morning Time In, but it's not time for lunch, afternoon in, or time out. Current time: {$timeDisplay}"];
    }

    // ---- 6. Normal flow: Afternoon In ----
    if (is_null($attendance->afternoon_time_in)) {
        if ($time >= $afternoonStart && $time <= $afternoonEnd) {
            return ['action' => 'afternoon_time_in', 'message' => "Afternoon Time In recorded successfully at {$timeDisplay}."];
        }
        // If after afternoon and we haven't clocked in, but time out is not allowed without afternoon in? Already handled above.
        return ['action' => null, 'message' => "Your lunch is done, but afternoon Time In hasn't started yet. Please wait until " . $this->settings->afternoon_time_in_start->format('g:i A') . "."];
    }

    // ---- 7. Should never reach here ----
    Log::error('Unexpected fallback triggered in determineAction', [
        'attendance' => $attendance->toArray(),
        'current_time' => $now->toDateTimeString(),
    ]);
    return [
        'action' => null,
        'message' => "Unable to determine attendance action. Please contact HR for assistance. (Current time: {$timeDisplay})",
    ];
}
    /**
     * Record the action (set the appropriate datetime field).
     */
    protected function recordAction(Attendance &$attendance, string $action, Carbon $now)
    {
        switch ($action) {
            case 'morning_time_in':
                $attendance->morning_time_in = $now;
                break;
            case 'lunch_time_out':
                $attendance->lunch_time_out = $now;
                break;
            case 'afternoon_time_in':
                $attendance->afternoon_time_in = $now;
                break;
            case 'time_out':
                $attendance->time_out = $now;
                break;
        }
        $attendance->save();
    }

    /**
     * Calculate morning, afternoon, and total hours after time out.
     */
    /**
 * Calculate morning, afternoon, and total hours.
 * Total is capped at 8 hours per day.
 */
protected function calculateDailyHours(Attendance $attendance)
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

    // Cap total at 8 hours per day
    $totalHours = min($totalHours, 8);

    $attendance->morning_hours = round($morningHours, 2);
    $attendance->afternoon_hours = round($afternoonHours, 2);
    $attendance->total_hours = round($totalHours, 2);
    $attendance->status = $totalHours > 0 ? 'present' : 'incomplete';
    $attendance->save();
}



    /**
     * Build human‑centered feedback for the trainee.
     */
    protected function buildFeedback(Attendance $attendance, Trainee $trainee, string $action, Carbon $now, string $actionMessage)
    {
        $actionLabels = [
            'morning_time_in' => 'Time In',
            'lunch_time_out' => 'Lunch Out',
            'afternoon_time_in' => 'Afternoon In',
            'time_out' => 'Time Out',
        ];

        $name = $trainee->first_name;

        $customMessages = [
            'morning_time_in' => "Good morning, {$name}! {$actionMessage}",
            'lunch_time_out' => "{$actionMessage}",
            'afternoon_time_in' => "Welcome back, {$name}! {$actionMessage}",
            'time_out' => "{$actionMessage}",
        ];

        $message = $customMessages[$action] ?? $actionMessage;

        // For Time Out, add summary
        if ($action === 'time_out') {
            $totalToday = $attendance->total_hours ?? 0;
            $rendered = $trainee->rendered_hours;
            $remaining = $trainee->remaining_hours;
            $percent = $trainee->completion_percentage;

            $message .= "\n\nYou rendered {$totalToday} hours today.";
            $message .= "\nTotal: {$rendered} hrs | Remaining: {$remaining} hrs";
            $message .= "\nCompletion: {$percent}%";
        }

        return [
            'action' => $action,
            'action_label' => $actionLabels[$action] ?? 'Attendance',
            'message' => $message,
            'recorded_at' => $now->toDateTimeString(),
            'today_hours' => $attendance->total_hours ?? 0,
            'total_rendered' => $trainee->rendered_hours,
            'remaining_hours' => $trainee->remaining_hours,
            'completion_percent' => $trainee->completion_percentage,
        ];
    }
}
