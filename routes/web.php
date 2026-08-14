<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Hrmo\DashboardController as HrmoDashboard;
use App\Http\Controllers\Trainee\DashboardController as TraineeDashboard;
use App\Http\Controllers\PasswordChangeController; // <-- added
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ✅ Single root route with conditional logic
Route::get('/', function () {
    if (auth()->check()) {
        $role = auth()->user()->role->value;
        return redirect()->route("{$role}.dashboard");
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified', 'must.change.password'])->group(function () {

    // Password change routes (explicitly allowed by the middleware)
    Route::get('/password/change', [PasswordChangeController::class, 'show'])->name('password.change');
    Route::post('/password/change', [PasswordChangeController::class, 'update'])->name('password.update');

    // Profile routes (from Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboard::class, 'index'])->name('dashboard');
    });

    // HRMO routes
    Route::middleware(['role:hrmo'])->prefix('hrmo')->name('hrmo.')->group(function () {
        Route::get('/dashboard', [HrmoDashboard::class, 'index'])->name('dashboard');
        Route::resource('trainees', \App\Http\Controllers\Hrmo\TraineeController::class)->except(['show']);
        Route::resource('departments', \App\Http\Controllers\Hrmo\DepartmentController::class)->except(['show']);
        // Attendance settings
        Route::get('/attendance-settings/edit', [\App\Http\Controllers\Hrmo\AttendanceSettingController::class, 'edit'])
            ->name('attendance-settings.edit');
        Route::put('/attendance-settings', [\App\Http\Controllers\Hrmo\AttendanceSettingController::class, 'update'])
            ->name('attendance-settings.update');
        Route::get('/qr-code', [\App\Http\Controllers\Hrmo\QrCodeController::class, 'show'])->name('qr-code.show');
        Route::get('/qr-code/download', [\App\Http\Controllers\Hrmo\QrCodeController::class, 'download'])->name('qr-code.download');

        Route::get('/attendance-records', [\App\Http\Controllers\Hrmo\AttendanceRecordController::class, 'index'])->name('attendance-records.index');
Route::get('/attendance-records/export', [\App\Http\Controllers\Hrmo\AttendanceRecordController::class, 'export'])->name('attendance-records.export');


Route::post('/attendance-corrections', [\App\Http\Controllers\Hrmo\AttendanceCorrectionController::class, 'store'])
    ->name('attendance-corrections.store');
Route::get('/attendance-corrections/{attendance}/history', [\App\Http\Controllers\Hrmo\AttendanceCorrectionController::class, 'history'])
    ->name('attendance-corrections.history');


    Route::get('/trainees/{trainee}/attendance', [\App\Http\Controllers\Hrmo\TraineeAttendanceController::class, 'index'])
    ->name('trainees.attendance.index');
Route::post('/trainees/{trainee}/attendance', [\App\Http\Controllers\Hrmo\TraineeAttendanceController::class, 'store'])
    ->name('trainees.attendance.store');
Route::delete('/trainees/{trainee}/attendance/{attendance}', [\App\Http\Controllers\Hrmo\TraineeAttendanceController::class, 'destroy'])
    ->name('trainees.attendance.destroy');

    Route::get('/trainees/{trainee}/attendance-records', [\App\Http\Controllers\Hrmo\TraineeAttendanceController::class, 'list'])
    ->name('trainees.attendance-records.index');

    Route::post('/trainees/{trainee}/reset-password', [\App\Http\Controllers\Hrmo\TraineeController::class, 'resetPassword'])
    ->name('trainees.reset-password');
    });

    // Trainee routes
   Route::middleware(['role:trainee'])->prefix('trainee')->name('trainee.')->group(function () {
    Route::get('/dashboard', [TraineeDashboard::class, 'index'])->name('dashboard');
    Route::get('/scan', [\App\Http\Controllers\Trainee\ScanController::class, 'index'])->name('scan.index');
    Route::post('/scan', [\App\Http\Controllers\Trainee\ScanController::class, 'scan'])->name('scan');
    Route::get('/attendance', [\App\Http\Controllers\Trainee\AttendanceController::class, 'index'])->name('attendance.index');
    Route::get('/attendance/export', [\App\Http\Controllers\Trainee\AttendanceController::class, 'export'])->name('attendance.export');

    Route::get('/profile', [\App\Http\Controllers\Trainee\ProfileController::class, 'edit'])->name('profile.edit');
Route::put('/profile', [\App\Http\Controllers\Trainee\ProfileController::class, 'update'])->name('profile.update');

});
});

require __DIR__.'/auth.php';
