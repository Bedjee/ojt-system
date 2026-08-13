<?php

namespace App\Http\Controllers\Hrmo;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceSettingController extends Controller
{
    public function edit()
    {
        $this->authorize('update', AttendanceSetting::class);

        $settings = AttendanceSetting::getSettings();

        return Inertia::render('Hrmo/AttendanceSettings/Edit', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $this->authorize('update', AttendanceSetting::class);

        $validated = $request->validate([
            'morning_time_in_start' => 'required|date_format:H:i',
            'morning_time_in_end' => 'required|date_format:H:i|after:morning_time_in_start',
            'lunch_time_out_start' => 'required|date_format:H:i',
            'lunch_time_out_end' => 'required|date_format:H:i|after:lunch_time_out_start',
            'afternoon_time_in_start' => 'required|date_format:H:i',
            'afternoon_time_in_end' => 'required|date_format:H:i|after:afternoon_time_in_start',
            'time_out_start' => 'required|date_format:H:i',
        ]);

        $settings = AttendanceSetting::getSettings();
        $settings->update($validated);

        return redirect()->route('hrmo.attendance-settings.edit')
            ->with('success', 'Attendance settings updated successfully.');
    }
}
