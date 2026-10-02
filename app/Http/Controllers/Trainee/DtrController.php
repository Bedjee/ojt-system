<?php

namespace App\Http\Controllers\Trainee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DtrController extends Controller
{
    /**
     * Resolve [startDay, endDay] for a given period key.
     */
    private function resolveRange(string $period, int $daysInMonth): array
    {
        return match ($period) {
            'first'  => [1, 15],
            'second' => [16, $daysInMonth],
            'week1'  => [1, 7],
            'week2'  => [8, 14],
            'week3'  => [15, 21],
            'week4'  => [22, 28],
            'week5'  => [29, $daysInMonth],
            default  => [1, 15],
        };
    }

    /**
     * All periods available for a month of N days, used to render buttons.
     */
    private function availablePeriods(int $daysInMonth): array
    {
        $periods = [
            ['value' => 'first',  'label' => '1–15',          'range' => '1–15',           'group' => 'half'],
            ['value' => 'second', 'label' => "16–{$daysInMonth}", 'range' => "16–{$daysInMonth}", 'group' => 'half'],

            ['value' => 'week1', 'label' => 'Week 1', 'range' => '1–7',  'group' => 'week'],
            ['value' => 'week2', 'label' => 'Week 2', 'range' => '8–14', 'group' => 'week'],
            ['value' => 'week3', 'label' => 'Week 3', 'range' => '15–21','group' => 'week'],
            ['value' => 'week4', 'label' => 'Week 4', 'range' => '22–28','group' => 'week'],
        ];

        if ($daysInMonth >= 29) {
            $periods[] = [
                'value' => 'week5',
                'label' => 'Week 5',
                'range' => "29–{$daysInMonth}",
                'group' => 'week',
            ];
        }

        return $periods;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $trainee = $user->trainee;

        if (!$trainee) {
            return redirect()->route('trainee.dashboard')
                ->with('error', 'Trainee profile not found.');
        }

        $month = $request->input('month', Carbon::now()->format('Y-m'));
        $half  = $request->input('half', 'first');

        $dateFrom    = Carbon::parse($month)->startOfMonth();
        $dateTo      = Carbon::parse($month)->endOfMonth();
        $daysInMonth = $dateFrom->daysInMonth;

        $periods = $this->availablePeriods($daysInMonth);

        // If the requested period isn't valid for this month (e.g. week5 on Feb),
        // fall back to the first half.
        if (!in_array($half, array_column($periods, 'value'), true)) {
            $half = 'first';
        }

        [$startDay, $endDay] = $this->resolveRange($half, $daysInMonth);

        $attendances = Attendance::where('trainee_id', $trainee->id)
            ->whereBetween('date', [$dateFrom, $dateTo])
            ->whereDay('date', '>=', $startDay)
            ->whereDay('date', '<=', $endDay)
            ->orderBy('date', 'asc')
            ->get();

        $records = $attendances->map(function ($att) {
            return [
                'date'         => $att->date->format('Y-m-d'),
                'morning_in'   => $att->morning_time_in?->format('g:i A'),
                'lunch_out'    => $att->lunch_time_out?->format('g:i A'),
                'afternoon_in' => $att->afternoon_time_in?->format('g:i A'),
                'time_out'     => $att->time_out?->format('g:i A'),
                'total_hours'  => $att->total_hours ?? 0,
                'status'       => $att->status,
            ];
        });

        $totalRendered = $attendances->sum('total_hours');
        $totalRequired = $trainee->required_hours;
        $remaining     = $totalRequired - $totalRendered;

        return Inertia::render('Trainee/Dtr/Index', [
            'trainee' => [
                'name'           => $trainee->full_name,
                'department'     => $trainee->department?->name ?? 'N/A',
                'school'         => $trainee->school,
                'course'         => $trainee->course,
                'required_hours' => $trainee->required_hours,
            ],
            'records'    => $records,
            'month'      => $month,
            'half'       => $half,
            'periods'    => $periods,
            'date_from'  => $dateFrom->copy()->day($startDay)->format('F d, Y'),
            'date_to'    => $dateFrom->copy()->day($endDay)->format('F d, Y'),
            'summary'    => [
                'total_rendered' => $totalRendered,
                'total_required' => $totalRequired,
                'remaining'      => $remaining,
                'present'        => $attendances->where('status', 'present')->count(),
                'incomplete'     => $attendances->where('status', 'incomplete')->count(),
                'absent'         => $attendances->where('status', 'absent')->count(),
            ],
        ]);
    }

    public function download(Request $request)
    {
        $user = auth()->user();
        $trainee = $user->trainee;

        if (!$trainee) {
            return back()->with('error', 'Trainee profile not found.');
        }

        $month = $request->input('month', Carbon::now()->format('Y-m'));
        $half  = $request->input('half', 'first');

        $dateFrom    = Carbon::parse($month)->startOfMonth();
        $dateTo      = Carbon::parse($month)->endOfMonth();
        $daysInMonth = $dateFrom->daysInMonth;

        $periods = $this->availablePeriods($daysInMonth);
        if (!in_array($half, array_column($periods, 'value'), true)) {
            $half = 'first';
        }

        [$startDay, $endDay] = $this->resolveRange($half, $daysInMonth);

        // Build array for all days in the selected range
        $records = [];
        for ($i = $startDay; $i <= $endDay; $i++) {
            $date = $dateFrom->copy()->day($i);
            $records[$i] = [
                'day'          => $i,
                'date'         => $date->format('Y-m-d'),
                'morning_in'   => null,
                'lunch_out'    => null,
                'afternoon_in' => null,
                'time_out'     => null,
                'total_hours'  => 0,
                'status'       => 'absent',
            ];
        }

        $attendances = Attendance::where('trainee_id', $trainee->id)
            ->whereBetween('date', [$dateFrom, $dateTo])
            ->whereDay('date', '>=', $startDay)
            ->whereDay('date', '<=', $endDay)
            ->orderBy('date', 'asc')
            ->get();

        foreach ($attendances as $att) {
            $day = $att->date->day;
            $records[$day]['morning_in']   = $att->morning_time_in?->format('g:i A');
            $records[$day]['lunch_out']    = $att->lunch_time_out?->format('g:i A');
            $records[$day]['afternoon_in'] = $att->afternoon_time_in?->format('g:i A');
            $records[$day]['time_out']     = $att->time_out?->format('g:i A');
            $records[$day]['total_hours']  = $att->total_hours ?? 0;
            $records[$day]['status']       = $att->status;
        }

        $periodStart = $dateFrom->copy()->day($startDay);
        $periodEnd   = $dateFrom->copy()->day($endDay);

        $data = [
            'trainee' => [
                'name'       => $trainee->full_name,
                'department' => $trainee->department?->name ?? 'N/A',
            ],
            'month_year'     => $dateFrom->format('F Y'),
            'date_from'      => $periodStart->format('F d, Y'),
            'date_to'        => $periodEnd->format('F d, Y'),
            'records'        => $records,
            'total_rendered' => $attendances->sum('total_hours'),
            'total_required' => $trainee->required_hours,
            'remaining'      => $trainee->required_hours - $attendances->sum('total_hours'),
        ];

        $pdf = app('dompdf.wrapper')->loadView('pdf.dtr', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download(
            "DTR_{$trainee->full_name}_{$periodStart->format('Ymd')}_{$periodEnd->format('Ymd')}_{$half}.pdf"
        );
    }
}