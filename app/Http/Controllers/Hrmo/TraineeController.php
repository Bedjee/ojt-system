<?php

namespace App\Http\Controllers\Hrmo;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hrmo\TraineeRequest;
use App\Models\Trainee;
use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TraineeController extends Controller
{
public function index(Request $request)
{
    $this->authorize('viewAny', Trainee::class);

    $query = Trainee::with('user', 'department');

    // Search filter
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('first_name', 'LIKE', "%{$search}%")
                ->orWhere('last_name', 'LIKE', "%{$search}%")
                ->orWhere('email', 'LIKE', "%{$search}%");
        });
    }

    // Department filter
    if ($request->filled('department')) {
        $query->where('department_id', $request->department);
    }

    // Status filter
    if ($request->filled('status')) {
        $query->where('status', $request->status);
    }

    $trainees = $query->latest()
        ->paginate(10)
        ->withQueryString() // ✅ this ensures pagination links keep query parameters
        ->through(fn($trainee) => [
            'id' => $trainee->id,
            'full_name' => $trainee->full_name,
            'email' => $trainee->email,
            'school' => $trainee->school,
            'course' => $trainee->course,
            'department' => $trainee->department?->name ?? 'N/A',
            'status' => $trainee->status,
            'start_date' => $trainee->start_date->format('Y-m-d'),
            'required_hours' => $trainee->required_hours,
        ]);

    $departments = Department::where('is_active', true)
        ->orderBy('name')
        ->get(['id', 'name']);

    $statuses = ['active', 'completed', 'cancelled', 'on_hold'];

    return Inertia::render('Hrmo/Trainees/Index', [
        'trainees' => $trainees,
        'filters' => $request->only(['search', 'department', 'status']),
        'departments' => $departments,
        'statuses' => $statuses,
    ]);
}




   public function create()
{
    $this->authorize('create', Trainee::class);

    $departments = Department::where('is_active', true)
        ->orderBy('name')
        ->get(['id', 'name', 'code']);

    return Inertia::render('Hrmo/Trainees/Create', [
        'departments' => $departments,
    ]);
}

    public function store(TraineeRequest $request)
{
    $this->authorize('create', Trainee::class);

    $validated = $request->validated();

    // Default password (you can choose any string)
    $defaultPassword = 'password123'; // or config('app.default_password')

    $user = User::create([
        'name' => $validated['first_name'] . ' ' . $validated['last_name'],
        'email' => $validated['email'],
        'password' => Hash::make($defaultPassword),
        'role' => 'trainee',
        'must_change_password' => true, // force change on next login
    ]);

    $trainee = Trainee::create(array_merge($validated, ['user_id' => $user->id]));

    return redirect()->route('hrmo.trainees.index')
        ->with('success', 'Trainee created with default password. They will be prompted to change it on first login.');
}




    public function edit(Trainee $trainee)
{
    $this->authorize('update', $trainee);

    $departments = Department::where('is_active', true)
        ->orderBy('name')
        ->get(['id', 'name', 'code']);

    return Inertia::render('Hrmo/Trainees/Edit', [
        'trainee' => $trainee->load('user'),
        'departments' => $departments,
    ]);
}



    public function update(TraineeRequest $request, Trainee $trainee)
{
    $this->authorize('update', $trainee);

    $validated = $request->validated();

    // Update trainee record with all validated fields (only those present)
    $trainee->update($validated);

    // Sync user account if email or name changed
    $userUpdate = [];

    // Email
    if (isset($validated['email']) && $trainee->user->email !== $validated['email']) {
        $userUpdate['email'] = $validated['email'];
    }

    // Name (first and last)
    if (isset($validated['first_name']) || isset($validated['last_name'])) {
        $firstName = $validated['first_name'] ?? $trainee->first_name;
        $lastName = $validated['last_name'] ?? $trainee->last_name;
        $userUpdate['name'] = trim($firstName . ' ' . $lastName);
    }

    if (!empty($userUpdate)) {
        $trainee->user->update($userUpdate);
    }

    return redirect()->route('hrmo.trainees.index')
        ->with('success', 'Trainee updated successfully.');
}



    public function destroy(Trainee $trainee)
    {
        $this->authorize('delete', $trainee);

        // Optionally delete the user account as well
        $trainee->user->delete();
        $trainee->delete();

        return redirect()->route('hrmo.trainees.index')
            ->with('success', 'Trainee deleted successfully.');
    }

public function resetPassword(Trainee $trainee)
{
    $this->authorize('update', $trainee);

    $defaultPassword = 'password123';
    $trainee->user->update([
        'password' => Hash::make($defaultPassword),
        'must_change_password' => true,
    ]);

    return redirect()->back()->with('success', 'Password reset to default. Trainee must change it on next login.');
}

}
