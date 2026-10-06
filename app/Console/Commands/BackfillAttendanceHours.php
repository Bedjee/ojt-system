<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class BackfillAttendanceHours extends Command
{
    /**
     * Usage examples:
     *   php artisan attendance:backfill-hours --dry-run
     *   php artisan attendance:backfill-hours
     *   php artisan attendance:backfill-hours --from=2026-01-01 --to=2026-09-30
     *   php artisan attendance:backfill-hours --only-approved-requests
     */
    protected $signature = 'attendance:backfill-hours
                            {--dry-run : Show what would change without saving anything}
                            {--from= : Only process rows with date >= this (YYYY-MM-DD)}
                            {--to= : Only process rows with date <= this (YYYY-MM-DD)}
                            {--only-approved-requests : Only rows that have an approved AttendanceRequest}
                            {--chunk=500 : Rows per batch}
                            {--force : Skip the confirmation prompt}';

    protected $description = 'Recompute morning_hours, afternoon_hours, total_hours, and status for existing attendance rows.';

    public function handle(AttendanceService $service): int
    {
        $dryRun     = (bool) $this->option('dry-run');
        $onlyReq    = (bool) $this->option('only-approved-requests');
        $chunk      = max(1, (int) $this->option('chunk'));
        $from       = $this->option('from');
        $to         = $this->option('to');

        // ---------- Build the base query ----------
        $query = Attendance::query()->orderBy('id');

        if ($from) {
            $query->whereDate('date', '>=', $from);
        }
        if ($to) {
            $query->whereDate('date', '<=', $to);
        }

        if ($onlyReq) {
            // Attendance rows that were touched by an approved request.
            $query->whereIn(
                DB::raw('(trainee_id, date)'),
                \App\Models\AttendanceRequest::where('status', 'approved')
                    ->select('trainee_id', 'date')
                    ->get()
                    ->map(fn ($r) => [$r->trainee_id, $r->date->toDateString()])
                    ->all()
            );
        }

        $total = (clone $query)->count();

        // ---------- Summary + confirmation ----------
        $this->info('Attendance hours backfill');
        $this->line('  Rows matched     : ' . $total);
        $this->line('  Date range       : ' . ($from ?? 'any') . ' → ' . ($to ?? 'any'));
        $this->line('  Only approved req: ' . ($onlyReq ? 'yes' : 'no'));
        $this->line('  Mode             : ' . ($dryRun ? 'DRY RUN (no writes)' : 'APPLY'));
        $this->newLine();

        if ($total === 0) {
            $this->warn('Nothing to process.');
            return self::SUCCESS;
        }

        if (!$dryRun && !$this->option('force') && !$this->confirm("Proceed to recalculate {$total} rows?", true)) {
            $this->warn('Aborted.');
            return self::FAILURE;
        }

        // ---------- Progress bar ----------
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $changed    = 0;
        $unchanged  = 0;
        $failures   = 0;
        $samples    = [];

        // ---------- Chunked processing ----------
        $query->chunkById($chunk, function ($rows) use (
            $service, $dryRun, $bar,
            &$changed, &$unchanged, &$failures, &$samples
        ) {
            foreach ($rows as $attendance) {
                try {
                    $before = [
                        'morning_hours'   => (float) ($attendance->morning_hours ?? 0),
                        'afternoon_hours' => (float) ($attendance->afternoon_hours ?? 0),
                        'total_hours'     => (float) ($attendance->total_hours ?? 0),
                        'status'          => $attendance->status,
                    ];

                    if ($dryRun) {
                        // Recompute in-memory only
                        $this->recompute($service, $attendance);
                    } else {
                        // Wrap each row so a single failure doesn't abort the batch
                        DB::transaction(function () use ($service, $attendance) {
                            $service->calculateDailyHours($attendance);
                        });
                    }

                    $after = [
                        'morning_hours'   => (float) ($attendance->morning_hours ?? 0),
                        'afternoon_hours' => (float) ($attendance->afternoon_hours ?? 0),
                        'total_hours'     => (float) ($attendance->total_hours ?? 0),
                        'status'          => $attendance->status,
                    ];

                    if ($before !== $after) {
                        $changed++;
                        if (count($samples) < 5) {
                            $samples[] = [
                                'id'      => $attendance->id,
                                'date'    => $attendance->date->format('Y-m-d'),
                                'before'  => $before,
                                'after'   => $after,
                            ];
                        }
                    } else {
                        $unchanged++;
                    }
                } catch (\Throwable $e) {
                    $failures++;
                    $this->newLine();
                    $this->error("Row #{$attendance->id} failed: {$e->getMessage()}");
                }

                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine(2);

        // ---------- Sample changes ----------
        if (!empty($samples)) {
            $this->info($dryRun ? 'Sample of changes (DRY RUN):' : 'Sample of changes:');
            $this->table(
                ['ID', 'Date', 'Before total', 'After total', 'Before status', 'After status'],
                array_map(fn ($s) => [
                    $s['id'],
                    $s['date'],
                    $s['before']['total_hours'],
                    $s['after']['total_hours'],
                    $s['before']['status'],
                    $s['after']['status'],
                ], $samples)
            );
        }

        // ---------- Final summary ----------
        $this->newLine();
        $this->line('  Changed   : ' . $changed);
        $this->line('  Unchanged : ' . $unchanged);
        $this->line('  Failed    : ' . $failures);

        if ($dryRun) {
            $this->warn('DRY RUN — nothing was saved. Re-run without --dry-run to apply.');
        } else {
            $this->info('Backfill complete.');
        }

        return $failures > 0 ? self::FAILURE : self::SUCCESS;
    }

    /**
     * Recompute hours in-memory (used in dry-run mode only).
     * Mirrors AttendanceService::calculateDailyHours() but without save().
     */
    private function recompute(AttendanceService $service, Attendance $attendance): void
    {
        // The service is designed to save. For dry-run we temporarily swap
        // in a no-op save by using reflection is messy, so simplest is to
        // compute manually here using the same logic path.

        $settings = \App\Models\AttendanceSetting::getSettings();
        $dateStr  = $attendance->date->format('Y-m-d');

        $morningStart   = Carbon::parse($dateStr.' '.$settings->morning_time_in_start->format('H:i:s'));
        $morningEnd     = Carbon::parse($dateStr.' '.$settings->lunch_time_out_start->format('H:i:s'));
        $afternoonStart = Carbon::parse($dateStr.' '.$settings->afternoon_time_in_start->format('H:i:s'));
        $afternoonEnd   = Carbon::parse($dateStr.' '.$settings->time_out_start->format('H:i:s'));

        $morningCap = 4; $afternoonCap = 4; $dailyCap = 8;

        $morningHours = 0;
        if ($attendance->morning_time_in) {
            $start = $attendance->morning_time_in->gt($morningStart) ? $attendance->morning_time_in : $morningStart;
            $end   = $attendance->lunch_time_out
                ? ($attendance->lunch_time_out->lt($morningEnd) ? $attendance->lunch_time_out : $morningEnd)
                : $morningEnd;
            if ($end->gt($start)) {
                $morningHours = min($start->floatDiffInHours($end), $morningCap);
            }
        }

        $afternoonHours = 0;
        if ($attendance->afternoon_time_in) {
            $start = $attendance->afternoon_time_in->gt($afternoonStart) ? $attendance->afternoon_time_in : $afternoonStart;
            $end   = $attendance->time_out
                ? ($attendance->time_out->lt($afternoonEnd) ? $attendance->time_out : $afternoonEnd)
                : $afternoonEnd;
            if ($end->gt($start)) {
                $afternoonHours = min($start->floatDiffInHours($end), $afternoonCap);
            }
        }

        $attendance->morning_hours   = round($morningHours, 2);
        $attendance->afternoon_hours = round($afternoonHours, 2);
        $attendance->total_hours     = round(min($morningHours + $afternoonHours, $dailyCap), 2);

        $hasAll = $attendance->morning_time_in && $attendance->lunch_time_out
               && $attendance->afternoon_time_in && $attendance->time_out;
        $hasAny = $attendance->morning_time_in || $attendance->lunch_time_out
               || $attendance->afternoon_time_in || $attendance->time_out;
        $attendance->status = $hasAll ? 'present' : ($hasAny ? 'incomplete' : 'absent');
    }
}