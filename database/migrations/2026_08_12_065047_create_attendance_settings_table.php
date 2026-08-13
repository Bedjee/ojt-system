<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('attendance_settings', function (Blueprint $table) {
        $table->id();
        // Morning Time In window
        $table->time('morning_time_in_start')->default('07:00:00');
        $table->time('morning_time_in_end')->default('11:59:00');
        // Lunch Time Out window
        $table->time('lunch_time_out_start')->default('12:00:00');
        $table->time('lunch_time_out_end')->default('12:30:00');
        // Afternoon Time In window
        $table->time('afternoon_time_in_start')->default('12:31:00');
        $table->time('afternoon_time_in_end')->default('16:59:00');
        // Time Out start (from this time onward)
        $table->time('time_out_start')->default('17:00:00');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_settings');
    }
};
