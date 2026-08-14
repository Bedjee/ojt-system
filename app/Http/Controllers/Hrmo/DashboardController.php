<?php

namespace App\Http\Controllers\Hrmo;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Trainee;
use App\Models\Department;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Filters
        $search = $request->input('search');
        $departmentFilter = $request->input('department');
        $statusFilter = $request->input('status');
        $dateFilter = $request->input('date', Carbon::today()->toDateString());

        // ========== STATISTICS ==========
        $totalActive = Trainee::where('status', 'active')->count();
        $totalCompleted = Trainee::where('status', 'completed')->count();

        $currentlyPresent = Attendance::whereDate('date', Carbon::today())
            ->whereNotNull('morning_time_in')
            ->whereNull('time_out')
            ->count();

        $currentlyOut = Attendance::whereDate('date', Carbon::today())
            ->whereNotNull('time_out')
            ->count();

        $totalHoursRendered = Attendance::sum('total_hours');

        // Near Completion (>=80% and <100% active) - computed in PHP after fetching
        $nearCompletion = Trainee::where('status', 'active')->get()
            ->filter(fn($t) => $t->completion_percentage >= 80 && $t->completion_percentage < 100)
            ->count();

        $attendanceIssues = Attendance::whereDate('date', Carbon::today())
            ->where(function ($query) {
                $query->where('status', 'incomplete')
                    ->orWhere(function ($q) {
                        $q->whereNotNull('morning_time_in')
                            ->whereNull('lunch_time_out')
                            ->whereNull('afternoon_time_in')
                            ->whereNull('time_out');
                    });
            })->count();

        // ========== MONITORING TABLE ==========
        $query = Trainee::with(['attendances' => function ($q) use ($dateFilter) {
            $q->whereDate('date', $dateFilter);
        }, 'department']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'LIKE', "%{$search}%")
                    ->orWhere('last_name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        if ($departmentFilter) {
            $query->where('department_id', $departmentFilter);
        }
        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        $trainees = $query->orderBy('first_name')->get()->map(function ($trainee) use ($dateFilter) {
            $todayAttendance = $trainee->attendances->first();
            return [
                'id' => $trainee->id,
                'name' => $trainee->full_name,
                'department' => $trainee->department?->name ?? 'N/A',
                'today_hours' => $todayAttendance?->total_hours ?? 0,
                'total_hours' => $trainee->rendered_hours,
                'remaining_hours' => $trainee->remaining_hours,
                'progress' => $trainee->completion_percentage,
                'status' => $trainee->status,
                'today_status' => $todayAttendance?->status ?? 'absent',
            ];
        });

        $departments = Department::where('is_active', true)->orderBy('name')->get(['id', 'name']);
        $statuses = ['active', 'completed', 'cancelled', 'on_hold'];

        // ========== CHART DATA ==========

        // 1. Department Progress (use withSum to avoid N+1)
        $departmentProgress = Department::with(['trainees' => function ($q) {
            $q->withSum('attendances', 'total_hours'); // adds attendances_sum_total_hours
        }])->get()->map(function ($dept) {
            $totalRendered = $dept->trainees->sum('attendances_sum_total_hours');
            $totalRequired = $dept->trainees->sum('required_hours');
            return [
                'name' => $dept->name,
                'required' => $totalRequired,
                'rendered' => $totalRendered,
                'completion' => $totalRequired > 0 ? round(($totalRendered / $totalRequired) * 100, 1) : 0,
            ];
        });

        // 2. Top 3 Trainees (by rendered hours) – using withSum
        $topTrainees = Trainee::with('department')
            ->withSum('attendances', 'total_hours')
            ->where('status', 'active')
            ->orderBy('attendances_sum_total_hours', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($t) {
                return [
                    'name' => $t->full_name,
                    'department' => $t->department?->name ?? 'N/A',
                    'rendered' => $t->attendances_sum_total_hours ?? 0,
                    'required' => $t->required_hours,
                ];
            });

        // 3. Lowest 5 Trainees
        $lowestTrainees = Trainee::with('department')
            ->withSum('attendances', 'total_hours')
            ->where('status', 'active')
            ->orderBy('attendances_sum_total_hours', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($t) {
                return [
                    'name' => $t->full_name,
                    'department' => $t->department?->name ?? 'N/A',
                    'rendered' => $t->attendances_sum_total_hours ?? 0,
                    'required' => $t->required_hours,
                ];
            });

        // 4. Overall Progress (direct sums)
        $totalRequiredAll = Trainee::sum('required_hours');
        $totalRenderedAll = Attendance::sum('total_hours');
        $overallProgress = [
            'required' => $totalRequiredAll,
            'rendered' => $totalRenderedAll,
            'completion' => $totalRequiredAll > 0 ? round(($totalRenderedAll / $totalRequiredAll) * 100, 1) : 0,
        ];

        // 5. Near Completion List (>=80% and <100%, active)
        $nearCompletionList = Trainee::with('department')
            ->where('status', 'active')
            ->get()
            ->filter(function ($t) {
                $p = $t->completion_percentage;
                return $p >= 80 && $p < 100;
            })
            ->values()
            ->map(function ($t) {
                return [
                    'name' => $t->full_name,
                    'department' => $t->department?->name ?? 'N/A',
                    'progress' => $t->completion_percentage,
                ];
            });

        // 6. Attendance Summary (today)
        $today = Carbon::today();
        $attendanceSummary = [
            'present' => Attendance::whereDate('date', $today)->where('status', 'present')->count(),
            'absent' => Attendance::whereDate('date', $today)->where('status', 'absent')->count(),
            'incomplete' => Attendance::whereDate('date', $today)->where('status', 'incomplete')->count(),
        ];

        // 7. Incomplete Records (last 7 days)
        $incompleteRecords = Attendance::with('trainee')
            ->where('status', 'incomplete')
            ->whereDate('date', '>=', Carbon::today()->subDays(7))
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($att) {
                return [
                    'trainee' => $att->trainee?->full_name ?? 'Unknown',
                    'date' => $att->date->format('Y-m-d'),
                    'missing' => $att->time_out ? 'Missing? Actually incomplete' : 'Missing Time Out',
                ];
            });

        // 8. Daily Trends (last 30 days)
        $trendData = Attendance::whereDate('date', '>=', Carbon::today()->subDays(30))
            ->groupBy('date')
            ->selectRaw('date, sum(total_hours) as total_hours, count(*) as total_records')
            ->get()
            ->map(function ($row) {
                return [
                    'date' => $row->date->format('Y-m-d'),
                    'total_hours' => round($row->total_hours, 2),
                    'records' => $row->total_records,
                ];
            });

        // ========== RETURN ==========
        return Inertia::render('Hrmo/Dashboard', [
            'stats' => [
                'totalActive' => $totalActive,
                'totalCompleted' => $totalCompleted,
                'currentlyPresent' => $currentlyPresent,
                'currentlyOut' => $currentlyOut,
                'totalHoursRendered' => round($totalHoursRendered, 2),
                'nearCompletion' => $nearCompletion,
                'attendanceIssues' => $attendanceIssues,
            ],
            'trainees' => $trainees,
            'departments' => $departments,
            'statuses' => $statuses,
            'filters' => [
                'search' => $search,
                'department' => $departmentFilter,
                'status' => $statusFilter,
                'date' => $dateFilter,
            ],
            'departmentProgress' => $departmentProgress,
            'topTrainees' => $topTrainees,
            'lowestTrainees' => $lowestTrainees,
            'overallProgress' => $overallProgress,
            'nearCompletionList' => $nearCompletionList,
            'attendanceSummary' => $attendanceSummary,
            'incompleteRecords' => $incompleteRecords,
            'trendData' => $trendData,
        ]);
    }
}
