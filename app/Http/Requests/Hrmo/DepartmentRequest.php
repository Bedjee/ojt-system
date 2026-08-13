<?php

namespace App\Http\Requests\Hrmo;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->isHrmo() || auth()->user()->isAdmin();
    }

   public function rules(): array
{
    $departmentId = $this->route('department')?->id;

    return [
        'name' => 'required|string|max:255',
        'code' => ['required', 'string', 'max:50', Rule::unique('departments', 'code')->ignore($departmentId)],
        'description' => 'nullable|string',
        'is_active' => 'boolean',
        'latitude' => 'nullable|numeric|between:-90,90',
        'longitude' => 'nullable|numeric|between:-180,180',
        'allowed_radius' => 'nullable|integer|min:10|max:10000',
        'geofencing_enabled' => 'boolean',
    ];
}


}
