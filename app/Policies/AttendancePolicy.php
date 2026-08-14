<?php

namespace App\Policies;

use App\Models\Attendance;
use App\Models\User;

class AttendancePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isHrmo() || $user->isAdmin();
    }

    public function view(User $user, Attendance $attendance): bool
    {
        return $user->isHrmo() || $user->isAdmin() || $user->id === $attendance->trainee->user_id;
    }

   public function update(User $user, Attendance $attendance)
{
    return $user->isHrmo() || $user->isAdmin();
}


}
