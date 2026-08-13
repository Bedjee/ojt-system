<?php

namespace App\Policies;

use App\Models\Trainee;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TraineePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isHrmo() || $user->isAdmin();
    }

    public function view(User $user, Trainee $trainee): bool
    {
        return $user->isHrmo() || $user->isAdmin() || $user->id === $trainee->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isHrmo() || $user->isAdmin();
    }

    public function update(User $user, Trainee $trainee): bool
    {
        return $user->isHrmo() || $user->isAdmin();
    }

    public function delete(User $user, Trainee $trainee): bool
    {
        return $user->isHrmo() || $user->isAdmin();
    }
}
