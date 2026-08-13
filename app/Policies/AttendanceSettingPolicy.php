<?php

namespace App\Policies;

use App\Models\AttendanceSetting;
use App\Models\User;

class AttendanceSettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isHrmo() || $user->isAdmin();
    }

    public function view(User $user): bool
    {
        return $user->isHrmo() || $user->isAdmin();
    }

    public function update(User $user): bool
    {
        return $user->isHrmo() || $user->isAdmin();
    }
}
