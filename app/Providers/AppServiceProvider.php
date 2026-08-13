<?php

namespace App\Providers;

use App\Models\Trainee;
use App\Policies\TraineePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Trainee::class, TraineePolicy::class);
         Gate::policy(Department::class, DepartmentPolicy::class);
         Gate::policy(AttendanceSetting::class, AttendanceSettingPolicy::class);
          Gate::policy(Attendance::class, AttendancePolicy::class);

          date_default_timezone_set('Asia/Manila');
    }
}
