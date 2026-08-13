<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\RoleEnum;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;


     protected $fillable = [
        'name',
        'email',
        'password',
        'role',           // <-- add this
        'must_change_password', // add this
    ];


     protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => RoleEnum::class,   // <-- cast to enum
         'must_change_password' => 'boolean',
    ];

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->role === RoleEnum::ADMIN;
    }

    public function isHrmo(): bool
    {
        return $this->role === RoleEnum::HRMO;
    }

    public function isTrainee(): bool
    {
        return $this->role === RoleEnum::TRAINEE;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function trainee()
{
    return $this->hasOne(Trainee::class);
}
}
