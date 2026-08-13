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
        // Fetch filters from request
        $search = $request->input('search');
        $departmentFilter = $request->input('department');
        $statusFilter = $request->input('status');
        $dateFilter = $request->input('date', Carbon::today()->toDateString());

        // 1. Statistics
        $totalActive = Trainee::where('status', 'active')->count();
        $totalCompleted = Trainee::where('status', 'completed')->count();

        // 2. Currently Present (have morning time in, no time out today)
        $currentlyPresent = Attendance::whereDate('date', Carbon::today())
            ->whereNotNull('morning_time_in')
            ->whereNull('time_out')
            ->count();

        // 3. Currently Out (have time out today)
        $currentlyOut = Attendance::whereDate('date', Carbon::today())
            ->whereNotNull('time_out')
            ->count();

        // 4. Total Hours Rendered (sum of all attendance records)
        $totalHoursRendered = Attendance::sum('total_hours');

        // 5. Trainees Near Completion (>= 80%)
        $nearCompletion = Trainee::with('attendances')
            ->get()
            ->filter(function ($trainee) {
                $percent = $trainee->completion_percentage;
                return $percent >= 80 && $percent < 100 && $trainee->status === 'active';
            })
            ->count();

        // 6. Attendance Issues (incomplete today)
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

        // 7. Build the monitoring table query
        $query = Trainee::with(['attendances' => function ($q) use ($dateFilter) {
            $q->whereDate('date', $dateFilter);
        }, 'department']);

        // Apply filters
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

        // 8. Get departments for filter dropdown
        $departments = Department::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        // 9. Get statuses for filter dropdown
        $statuses = ['active', 'completed', 'cancelled', 'on_hold'];

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
        ]);
    }
}
