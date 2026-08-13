<?php

namespace App\Http\Controllers\Trainee;

use App\Http\Controllers\Controller;
use App\Models\Trainee;
use App\Services\AttendanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScanController extends Controller
{
    protected $attendanceService;

    public function __construct(AttendanceService $attendanceService)
    {
        $this->attendanceService = $attendanceService;
    }

    public function index()
    {
        return Inertia::render('Trainee/Scan');
    }

   public function scan(Request $request)
{
    $request->validate([
        'scanned_data' => 'required|string',
        'latitude' => 'nullable|numeric|between:-90,90',
        'longitude' => 'nullable|numeric|between:-180,180',
    ]);

    $user = $request->user();
    $trainee = $user->trainee;

    if (!$trainee) {
        return response()->json(['error' => 'Trainee profile not found.'], 404);
    }

    try {
        $feedback = $this->attendanceService->processScan(
            $trainee,
            $request->scanned_data,
            null,
            $request->latitude,
            $request->longitude
        );
        return response()->json($feedback);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
}


}
