<?php

namespace App\Http\Controllers\Hrmo;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Trainee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceRecordController extends Controller
{
     public function index(Request $request)
    {
        $this->authorize('viewAny', Trainee::class);

        $query = Trainee::with('department');

        // Search by name or email
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'LIKE', "%{$request->search}%")
                    ->orWhere('last_name', 'LIKE', "%{$request->search}%")
                    ->orWhere('email', 'LIKE', "%{$request->search}%");
            });
        }

        // Filter by department
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $trainees = $query->orderBy('first_name')
            ->paginate(15)
            ->through(function ($trainee) {
                return [
                    'id' => $trainee->id,
                    'name' => $trainee->full_name,
                    'email' => $trainee->email,
                    'department' => $trainee->department?->name ?? 'N/A',
                    'status' => $trainee->status,
                    'required_hours' => $trainee->required_hours,
                    'rendered_hours' => $trainee->rendered_hours,
                    'remaining_hours' => $trainee->remaining_hours,
                    'progress' => $trainee->completion_percentage,
                ];
            });

        // For filter dropdowns
        $departments = Department::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $statuses = ['active', 'completed', 'cancelled', 'on_hold'];

        return Inertia::render('Hrmo/AttendanceRecords/Index', [
            'trainees' => $trainees,
            'filters' => $request->only(['search', 'department_id', 'status']),
            'departments' => $departments,
            'statuses' => $statuses,
        ]);
    }





    public function export(Request $request)
    {
        $this->authorize('viewAny', Attendance::class);

        $query = Attendance::with(['trainee', 'department']);

        // Apply same filters
        if ($request->filled('date_from')) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->date_to);
        }
        if ($request->filled('trainee_id')) {
            $query->where('trainee_id', $request->trainee_id);
        }
        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $records = $query->orderBy('date', 'desc')->get();

        $csvData = [];
        $csvData[] = ['Trainee', 'Department', 'Date', 'Morning In', 'Lunch Out', 'Afternoon In', 'Time Out', 'Morning Hours', 'Afternoon Hours', 'Total Hours', 'Status'];

        foreach ($records as $att) {
            $csvData[] = [
                $att->trainee?->full_name ?? 'Deleted',
                $att->department?->name ?? 'N/A',
                $att->date->format('Y-m-d'),
                $att->morning_time_in?->format('g:i A') ?? '',
                $att->lunch_time_out?->format('g:i A') ?? '',
                $att->afternoon_time_in?->format('g:i A') ?? '',
                $att->time_out?->format('g:i A') ?? '',
                $att->morning_hours ?? 0,
                $att->afternoon_hours ?? 0,
                $att->total_hours ?? 0,
                $att->status,
            ];
        }

        $filename = 'attendance_records_' . Carbon::now()->format('Ymd_His') . '.csv';
        $handle = fopen('php://temp', 'w+');
        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }
        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return response($content)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}
