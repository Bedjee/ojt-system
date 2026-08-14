<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class RecalculateAttendance extends Command
{
    protected $signature = 'attendance:recalculate';
    protected $description = 'Recalculate hours and status for all attendance records using the new logic.';

    public function handle(AttendanceService $attendanceService)
    {
        $this->info('Recalculating attendance records...');

        $records = Attendance::all();
        $count = $records->count();
        $bar = $this->output->createProgressBar($count);

        foreach ($records as $attendance) {
            // We need to access the private method calculateDailyHours from AttendanceService.
            // We'll use a reflection or move the logic to a shared helper.
            // For simplicity, we'll copy the calculation logic here.
            $this->recalculateRecord($attendance);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Recalculated {$count} attendance records.");
    }

    private function recalculateRecord(Attendance $attendance)
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
}
