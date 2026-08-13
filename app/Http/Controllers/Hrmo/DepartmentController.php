<?php

namespace App\Http\Controllers\Hrmo;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hrmo\DepartmentRequest;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     */
    public function index()
    {
        $this->authorize('viewAny', Department::class);

        $departments = Department::latest()->paginate(10);

        return Inertia::render('Hrmo/Departments/Index', [
            'departments' => $departments,
        ]);
    }

    /**
     * Show the form for creating a new department.
     */
    public function create()
    {
        $this->authorize('create', Department::class);

        return Inertia::render('Hrmo/Departments/Create');
    }

    /**
     * Store a newly created department.
     */
    public function store(DepartmentRequest $request)
    {
        $this->authorize('create', Department::class);

        // $request->validated() includes:
        // name, code, description, is_active,
        // latitude, longitude, allowed_radius, geofencing_enabled
        Department::create($request->validated());

        return redirect()->route('hrmo.departments.index')
            ->with('success', 'Department created successfully.');
    }

    /**
     * Show the form for editing the specified department.
     */
    public function edit(Department $department)
    {
        $this->authorize('update', $department);

        return Inertia::render('Hrmo/Departments/Edit', [
            'department' => $department,
        ]);
    }

    /**
     * Update the specified department.
     */
    public function update(DepartmentRequest $request, Department $department)
    {
        $this->authorize('update', $department);

        // $request->validated() includes all fields including geofencing ones
        $department->update($request->validated());

        return redirect()->route('hrmo.departments.index')
            ->with('success', 'Department updated successfully.');
    }

    /**
     * Remove the specified department.
     */
    public function destroy(Department $department)
    {
        $this->authorize('delete', $department);

        // Prevent deletion if trainees are assigned
        if ($department->trainees()->exists()) {
            return back()->with('error', 'Cannot delete department with assigned trainees.');
        }

        $department->delete();

        return redirect()->route('hrmo.departments.index')
            ->with('success', 'Department deleted successfully.');
    }
}
