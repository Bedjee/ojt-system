<?php

namespace App\Http\Requests\Hrmo;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TraineeRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only HRMO and Admin can manage trainees
        return auth()->user()->isHrmo() || auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        $traineeId = $this->route('trainee')?->id;

        return [
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . ($this->user_id ?? 'NULL') . '|unique:trainees,email,' . $traineeId,
            'contact_number' => 'nullable|string|max:20',
            'school' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'year_level' => 'required|string|max:50',
            'start_date' => 'required|date',
            'expected_end_date' => 'nullable|date|after:start_date',
            'required_hours' => 'required|integer|min:1',
            'department_id' => 'nullable|exists:departments,id',
            'supervisor' => 'nullable|string|max:255',
            'status' => ['required', Rule::in(['active', 'completed', 'cancelled', 'on_hold'])],
        ];
    }
}
