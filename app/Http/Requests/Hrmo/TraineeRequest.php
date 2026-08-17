<?php

namespace App\Http\Requests\Hrmo;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TraineeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isHrmo() || auth()->user()->isAdmin();
    }

    public function rules(): array
    {
        $trainee = $this->route('trainee');
        $isUpdate = !is_null($trainee);
        $userId = $trainee ? $trainee->user_id : null;
        $traineeId = $trainee ? $trainee->id : null;

        return [
            // Personal Information
            'first_name' => $isUpdate
                ? ['nullable', 'string', 'max:255']
                : ['required', 'string', 'max:255'],

            'middle_name' => ['nullable', 'string', 'max:255'],

            'last_name' => $isUpdate
                ? ['nullable', 'string', 'max:255']
                : ['required', 'string', 'max:255'],

            'email' => $isUpdate
                ? ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId), Rule::unique('trainees', 'email')->ignore($traineeId)]
                : ['required', 'email', 'max:255', Rule::unique('users', 'email'), Rule::unique('trainees', 'email')],

            'contact_number' => ['nullable', 'string', 'max:20'],

            // Academic Information
            'school' => $isUpdate
                ? ['nullable', 'string', 'max:255']
                : ['required', 'string', 'max:255'],

            'course' => $isUpdate
                ? ['nullable', 'string', 'max:255']
                : ['required', 'string', 'max:255'],

            'year_level' => $isUpdate
                ? ['nullable', 'string', 'max:50']
                : ['required', 'string', 'max:50'],

            // OJT Details
            'start_date' => $isUpdate
                ? ['nullable', 'date']
                : ['required', 'date'],

            'expected_end_date' => [
                'nullable',
                'date',
                function ($attribute, $value, $fail) {
                    if ($value && $this->filled('start_date')) {
                        if (strtotime($value) <= strtotime($this->input('start_date'))) {
                            $fail('The expected end date must be after the start date.');
                        }
                    }
                },
            ],

            'required_hours' => $isUpdate
                ? ['nullable', 'integer', 'min:1']
                : ['required', 'integer', 'min:1'],

            'department_id' => ['nullable', 'exists:departments,id'],

            'supervisor' => ['nullable', 'string', 'max:255'],

            'status' => $isUpdate
                ? ['nullable', Rule::in(['active', 'completed', 'cancelled', 'on_hold'])]
                : ['required', Rule::in(['active', 'completed', 'cancelled', 'on_hold'])],
        ];
    }
}
