<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PasswordChangeController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/ChangePassword');
    }

   public function update(Request $request)
{
    $request->validate([
        'current_password' => 'required|string',
        'new_password' => 'required|string|min:8|confirmed',
    ]);

    $user = $request->user();

    // Verify current password
    if (!Hash::check($request->current_password, $user->password)) {
        return back()->withErrors(['current_password' => 'Current password is incorrect.']);
    }

    // Update password and clear the flag
    $user->update([
        'password' => Hash::make($request->new_password),
        'must_change_password' => false,
    ]);

    // ✅ Redirect to the user's role-specific dashboard
    $role = $user->role->value; // 'admin', 'hrmo', or 'trainee'
    return redirect()->route("{$role}.dashboard")
        ->with('success', 'Password changed successfully.');
}



}
