<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
    'name',
    'code',
    'description',
    'is_active',
    'latitude',
    'longitude',
    'allowed_radius',
    'geofencing_enabled',
];

protected $casts = [
    'is_active' => 'boolean',
    'geofencing_enabled' => 'boolean',
    'latitude' => 'decimal:7',
    'longitude' => 'decimal:7',
    'allowed_radius' => 'integer',
];

    public function trainees()
    {
        return $this->hasMany(Trainee::class);
    }
}
