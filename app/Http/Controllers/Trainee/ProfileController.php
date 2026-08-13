<?php

namespace App\Http\Controllers\Trainee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        $trainee = $user->trainee;

        if (!$trainee) {
            return redirect()->route('trainee.dashboard')
                ->with('error', 'Trainee profile not found.');
        }

        return Inertia::render('Trainee/Profile/Edit', [
            'trainee' => $trainee->load('user'),
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $trainee = $user->trainee;

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'contact_number' => 'nullable|string|max:20',
            'school' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'year_level' => 'required|string|max:50',
        ]);

        // Update user
        $user->update([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
        ]);

        // Update trainee (including email for consistency)
        $trainee->update([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'contact_number' => $validated['contact_number'],
            'school' => $validated['school'],
            'course' => $validated['course'],
            'year_level' => $validated['year_level'],
        ]);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }
}
