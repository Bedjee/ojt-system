<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'HRMO User',
            'email' => 'hrmo@example.com',
            'password' => bcrypt('password'),
            'role' => 'hrmo',
        ]);

        User::factory()->create([
            'name' => 'Trainee User',
            'email' => 'trainee@example.com',
            'password' => bcrypt('password'),
            'role' => 'trainee',
        ]);
    }
}
