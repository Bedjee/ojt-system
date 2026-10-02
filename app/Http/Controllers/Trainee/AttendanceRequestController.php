<?php

namespace App\Http\Controllers\Trainee;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AttendanceRequestController extends Controller
{
    private const FIELDS = ['morning_time_in', 'lunch_time_out', 'afternoon_time_in', 'time_out'];

    public function index()
    {
        $trainee = auth()->user()->trainee;
        abort_unless($trainee, 403);

        $requests = AttendanceRequest::where('trainee_id', $trainee->id)
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get()
            ->map(fn ($r) => [
                'id'               => $r->id,
                'date'             => $r->date->format('Y-m-d'),
                'requested_fields' => $r->requested_fields,
                'field_labels'     => $r->field_labels,
                'requested_times'  => $r->requested_times,
                'reason'           => $r->reason,
                'status'           => $r->status,
                'has_image'        => (bool) $r->verification_image,
                'review_notes'     => $r->review_notes,
                'created_at'       => $r->created_at->format('Y-m-d H:i'),
            ]);

        return Inertia::render('Trainee/AttendanceRequests/Index', [
            'requests' => $requests,
        ]);
    }

    public function create()
    {
        return Inertia::render('Trainee/AttendanceRequests/Create', [
            'fields' => AttendanceRequest::FIELD_LABELS,
        ]);
    }

    /** AJAX: return missing vs existing fields for a given date. */
    public function missingFields(Request $request)
    {
        $trainee = auth()->user()->trainee;
        abort_unless($trainee, 403);

        $date = $request->validate(['date' => 'required|date'])['date'];

        $attendance = Attendance::where('trainee_id', $trainee->id)
            ->whereDate('date', $date)
            ->first();

        $existing = [];
        $missing  = [];
        foreach (self::FIELDS as $f) {
            if ($attendance && $attendance->{$f}) {
                $existing[$f] = $attendance->{$f}->format('g:i A');
            } else {
                $missing[] = $f;
            }
        }

        // Fields already covered by a pending request
        $alreadyRequested = [];
        $pending = AttendanceRequest::where('trainee_id', $trainee->id)
            ->whereDate('date', $date)
            ->whereIn('status', ['pending_letter', 'pending'])
            ->get();
        foreach ($pending as $req) {
            foreach ($req->requested_fields ?? [] as $f) {
                $alreadyRequested[] = $f;
            }
        }

        return response()->json([
            'existing'          => $existing,
            'missing'           => array_values(array_diff($missing, $alreadyRequested)),
            'already_requested' => array_values(array_unique($alreadyRequested)),
        ]);
    }

    public function store(Request $request)
    {
        $trainee = auth()->user()->trainee;
        abort_unless($trainee, 403);

        $data = $request->validate([
            'date'              => 'required|date|before_or_equal:today',
            'requested_fields'  => 'required|array|min:1',
            'requested_fields.*'=> 'in:' . implode(',', self::FIELDS),
            'requested_times'   => 'nullable|array',
            'requested_times.*' => 'nullable|date_format:H:i',
            'reason'            => 'nullable|string|max:1000',
        ]);

        // Reject fields that already have a value in the DB
        $attendance = Attendance::where('trainee_id', $trainee->id)
            ->whereDate('date', $data['date'])
            ->first();

        $conflicts = [];
        foreach ($data['requested_fields'] as $f) {
            if ($attendance && $attendance->{$f}) {
                $conflicts[] = AttendanceRequest::FIELD_LABELS[$f] ?? $f;
            }
        }
        if ($conflicts) {
            return back()->withErrors([
                'requested_fields' => 'These already have values: ' . implode(', ', $conflicts),
            ]);
        }

        // Reject duplicate pending requests
        $existingReqs = AttendanceRequest::where('trainee_id', $trainee->id)
            ->whereDate('date', $data['date'])
            ->whereIn('status', ['pending_letter', 'pending'])
            ->get();

        foreach ($existingReqs as $req) {
            $dupes = array_intersect($data['requested_fields'], $req->requested_fields ?? []);
            if ($dupes) {
                $labels = array_map(fn ($f) => AttendanceRequest::FIELD_LABELS[$f] ?? $f, $dupes);
                return back()->withErrors([
                    'requested_fields' => 'A pending request already covers: ' . implode(', ', $labels),
                ]);
            }
        }

        AttendanceRequest::create([
            'trainee_id'       => $trainee->id,
            'date'             => $data['date'],
            'requested_fields' => $data['requested_fields'],
            'requested_times'  => $data['requested_times'] ?? null,
            'reason'           => $data['reason'] ?? null,
            'status'           => 'pending_letter',
        ]);

        return redirect()->route('trainee.attendance-requests.index')
            ->with('success', 'Request created. Download the letter, get it signed, then upload the photo.');
    }

    /** Stream the PDF letter. */
    public function letter(AttendanceRequest $attendanceRequest)
    {
        $trainee = auth()->user()->trainee;
        abort_unless($trainee && $attendanceRequest->trainee_id === $trainee->id, 403);

        $data = [
            'request'      => $attendanceRequest,
            'trainee'      => $trainee,
            'department'   => $trainee->department,
            'fields'       => $attendanceRequest->field_labels,
            'date'         => $attendanceRequest->date->format('F d, Y'),
            'generated_at' => now()->format('F d, Y g:i A'),
        ];

        $pdf = app('dompdf.wrapper')->loadView('pdf.attendance-request-letter', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download("Attendance_Request_AR-{$attendanceRequest->id}.pdf");
    }

    /** Upload the signed verification picture. */
    public function uploadImage(Request $request, AttendanceRequest $attendanceRequest)
    {
        $trainee = auth()->user()->trainee;
        abort_unless($trainee && $attendanceRequest->trainee_id === $trainee->id, 403);

        if (!in_array($attendanceRequest->status, ['pending_letter', 'pending'])) {
            return back()->withErrors(['image' => 'This request can no longer be edited.']);
        }

        $request->validate(['image' => 'required|image|max:5120']);

        if ($attendanceRequest->verification_image) {
            Storage::disk('public')->delete($attendanceRequest->verification_image);
        }

        $path = $request->file('image')->store("attendance-requests/{$trainee->id}", 'public');

        $attendanceRequest->update([
            'verification_image' => $path,
            'status'             => 'pending',
        ]);

        return back()->with('success', 'Signed letter uploaded. Awaiting HRMO review.');
    }

    public function destroy(AttendanceRequest $attendanceRequest)
    {
        $trainee = auth()->user()->trainee;
        abort_unless($trainee && $attendanceRequest->trainee_id === $trainee->id, 403);

        if (!in_array($attendanceRequest->status, ['pending_letter', 'pending'])) {
            return back()->withErrors(['request' => 'Only pending requests can be cancelled.']);
        }

        if ($attendanceRequest->verification_image) {
            Storage::disk('public')->delete($attendanceRequest->verification_image);
        }

        $attendanceRequest->delete();

        return back()->with('success', 'Request cancelled.');
    }
}