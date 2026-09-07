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
     * Display the DTR page for the trainee.
     */
   public function index(Request $request)
{
    $user = auth()->user();
    $trainee = $user->trainee;

    if (!$trainee) {
        return redirect()->route('trainee.dashboard')
            ->with('error', 'Trainee profile not found.');
    }

    $month = $request->input('month', Carbon::now()->format('Y-m'));
    $half = $request->input('half', 'first'); // 'first' or 'second'

    $dateFrom = Carbon::parse($month)->startOfMonth();
    $dateTo = Carbon::parse($month)->endOfMonth();

    // Determine day range based on half
    if ($half === 'first') {
        $startDay = 1;
        $endDay = 15;
    } else { // second
        $startDay = 16;
        $endDay = $dateFrom->daysInMonth;
    }

    $attendances = Attendance::where('trainee_id', $trainee->id)
        ->whereBetween('date', [$dateFrom, $dateTo])
        ->whereDay('date', '>=', $startDay)
        ->whereDay('date', '<=', $endDay)
        ->orderBy('date', 'asc')
        ->get();

    $records = $attendances->map(function ($att) {
        return [
            'date' => $att->date->format('Y-m-d'),
            'morning_in' => $att->morning_time_in?->format('g:i A'),
            'lunch_out' => $att->lunch_time_out?->format('g:i A'),
            'afternoon_in' => $att->afternoon_time_in?->format('g:i A'),
            'time_out' => $att->time_out?->format('g:i A'),
            'total_hours' => $att->total_hours ?? 0,
            'status' => $att->status,
        ];
    });

    $totalRendered = $attendances->sum('total_hours');
    $totalRequired = $trainee->required_hours;
    $remaining = $totalRequired - $totalRendered;

    $present = $attendances->where('status', 'present')->count();
    $incomplete = $attendances->where('status', 'incomplete')->count();
    $absent = $attendances->where('status', 'absent')->count();

    return Inertia::render('Trainee/Dtr/Index', [
        'trainee' => [
            'name' => $trainee->full_name,
            'department' => $trainee->department?->name ?? 'N/A',
            'school' => $trainee->school,
            'course' => $trainee->course,
            'required_hours' => $trainee->required_hours,
        ],
        'records' => $records,
        'month' => $month,
        'half' => $half,
        'date_from' => $dateFrom->format('F d, Y'),
        'date_to' => $dateTo->format('F d, Y'),
        'summary' => [
            'total_rendered' => $totalRendered,
            'total_required' => $totalRequired,
            'remaining' => $remaining,
            'present' => $present,
            'incomplete' => $incomplete,
            'absent' => $absent,
        ],
    ]);
}




    /**
     * Download the DTR as PDF.
     */
 public function download(Request $request)
{
    $user = auth()->user();
    $trainee = $user->trainee;

    if (!$trainee) {
        return back()->with('error', 'Trainee profile not found.');
    }

    $month = $request->input('month', Carbon::now()->format('Y-m'));
    $half = $request->input('half', 'first');

    $dateFrom = Carbon::parse($month)->startOfMonth();
    $dateTo = Carbon::parse($month)->endOfMonth();

    if ($half === 'first') {
        $startDay = 1;
        $endDay = 15;
    } else {
        $startDay = 16;
        $endDay = $dateFrom->daysInMonth;
    }

    // Build array for all days in the selected half
    $records = [];
    for ($i = $startDay; $i <= $endDay; $i++) {
        $date = $dateFrom->copy()->day($i);
        $records[$i] = [
            'day' => $i,
            'date' => $date->format('Y-m-d'),
            'morning_in' => null,
            'lunch_out' => null,
            'afternoon_in' => null,
            'time_out' => null,
            'total_hours' => 0,
            'status' => 'absent',
        ];
    }

    // Fetch actual attendance records and merge
    $attendances = Attendance::where('trainee_id', $trainee->id)
        ->whereBetween('date', [$dateFrom, $dateTo])
        ->whereDay('date', '>=', $startDay)
        ->whereDay('date', '<=', $endDay)
        ->orderBy('date', 'asc')
        ->get();

    foreach ($attendances as $att) {
        $day = $att->date->day;
        $records[$day]['morning_in'] = $att->morning_time_in?->format('g:i A');
        $records[$day]['lunch_out'] = $att->lunch_time_out?->format('g:i A');
        $records[$day]['afternoon_in'] = $att->afternoon_time_in?->format('g:i A');
        $records[$day]['time_out'] = $att->time_out?->format('g:i A');
        $records[$day]['total_hours'] = $att->total_hours ?? 0;
        $records[$day]['status'] = $att->status;
    }

    $data = [
        'trainee' => [
            'name' => $trainee->full_name,
            'department' => $trainee->department?->name ?? 'N/A',
        ],
        'month_year' => $dateFrom->format('F Y'),
        'date_from' => $dateFrom->format('F d, Y'),
        'date_to' => $dateTo->format('F d, Y'),
        'records' => $records,
        'total_rendered' => $attendances->sum('total_hours'),
        'total_required' => $trainee->required_hours,
        'remaining' => $trainee->required_hours - $attendances->sum('total_hours'),
    ];

    $pdf = app('dompdf.wrapper')->loadView('pdf.dtr', $data);
    $pdf->setPaper('A4', 'portrait');

    return $pdf->download("DTR_{$trainee->full_name}_{$dateFrom->format('Ymd')}_{$dateTo->format('Ymd')}_{$half}.pdf");
}

}
