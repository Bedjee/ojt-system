<?php

namespace App\Http\Controllers\Hrmo;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceRequest;
use App\Services\AttendanceRequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AttendanceRequestController extends Controller
{
    public function __construct(private AttendanceRequestService $service) {}

    public function index(Request $request)
    {
        $status = $request->input('status', 'pending');

        $query = AttendanceRequest::with(['trainee.department', 'reviewer'])
            ->orderByDesc('created_at');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $requests = $query->paginate(20)->through(fn ($r) => [
            'id'           => $r->id,
            'trainee'      => $r->trainee?->full_name ?? 'Unknown',
            'department'   => $r->trainee?->department?->name ?? 'N/A',
            'date'         => $r->date->format('Y-m-d'),
            'fields'       => $r->requested_fields,
            'field_labels' => $r->field_labels,
            'reason'       => $r->reason,
            'status'       => $r->status,
            'has_image'    => (bool) $r->verification_image,
            'reviewed_by'  => $r->reviewer?->name,
            'reviewed_at'  => $r->reviewed_at?->format('Y-m-d H:i'),
            'created_at'   => $r->created_at->format('Y-m-d H:i'),
        ]);

        return Inertia::render('Hrmo/AttendanceRequests/Index', [
            'requests' => $requests,
            'filters'  => ['status' => $status],
            'counts'   => [
                'pending_letter' => AttendanceRequest::where('status', 'pending_letter')->count(),
                'pending'        => AttendanceRequest::where('status', 'pending')->count(),
                'approved'       => AttendanceRequest::where('status', 'approved')->count(),
                'rejected'       => AttendanceRequest::where('status', 'rejected')->count(),
            ],
        ]);
    }

    public function show(AttendanceRequest $attendanceRequest)
    {
        $attendanceRequest->load(['trainee.department', 'reviewer']);

        $existing = Attendance::where('trainee_id', $attendanceRequest->trainee_id)
            ->whereDate('date', $attendanceRequest->date)
            ->first();

        return Inertia::render('Hrmo/AttendanceRequests/Show', [
            'request' => [
                'id'              => $attendanceRequest->id,
                'trainee'         => $attendanceRequest->trainee?->full_name,
                'department'      => $attendanceRequest->trainee?->department?->name ?? 'N/A',
                'date'            => $attendanceRequest->date->format('Y-m-d'),
                'fields'          => $attendanceRequest->requested_fields,
                'field_labels'    => $attendanceRequest->field_labels,
                'requested_times' => $attendanceRequest->requested_times,
                'reason'          => $attendanceRequest->reason,
                'status'          => $attendanceRequest->status,
                'image_url'       => $attendanceRequest->verification_image
                    ? Storage::disk('public')->url($attendanceRequest->verification_image)
                    : null,
                'review_notes'    => $attendanceRequest->review_notes,
                'reviewer'        => $attendanceRequest->reviewer?->name,
                'reviewed_at'     => $attendanceRequest->reviewed_at?->format('Y-m-d H:i'),
                'created_at'      => $attendanceRequest->created_at->format('Y-m-d H:i'),
            ],
            'existingAttendance' => [
                'morning_time_in'   => $existing?->morning_time_in?->format('g:i A'),
                'lunch_time_out'    => $existing?->lunch_time_out?->format('g:i A'),
                'afternoon_time_in' => $existing?->afternoon_time_in?->format('g:i A'),
                'time_out'          => $existing?->time_out?->format('g:i A'),
            ],
        ]);
    }

    public function approve(Request $request, AttendanceRequest $attendanceRequest)
    {
        $data = $request->validate(['review_notes' => 'nullable|string|max:1000']);

        if ($attendanceRequest->status !== 'pending') {
            return back()->withErrors(['status' => 'Only requests in "pending" status can be approved.']);
        }

        $this->service->approve($attendanceRequest, auth()->id(), $data['review_notes'] ?? null);

        return redirect()->route('hrmo.attendance-requests.index')
            ->with('success', 'Request approved and attendance recorded.');
    }

    public function reject(Request $request, AttendanceRequest $attendanceRequest)
    {
        $data = $request->validate(['review_notes' => 'required|string|max:1000']);

        if (!in_array($attendanceRequest->status, ['pending', 'pending_letter'])) {
            return back()->withErrors(['status' => 'This request has already been reviewed.']);
        }

        $attendanceRequest->update([
            'status'       => 'rejected',
            'reviewed_by'  => auth()->id(),
            'reviewed_at'  => now(),
            'review_notes' => $data['review_notes'],
        ]);

        return back()->with('success', 'Request rejected.');
    }
}