<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       Schema::create('trainees', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('first_name');
    $table->string('middle_name')->nullable();
    $table->string('last_name');
    $table->string('email')->unique();
    $table->string('contact_number')->nullable();
    $table->string('school');
    $table->string('course');
    $table->string('year_level');
    $table->date('start_date');
    $table->date('expected_end_date')->nullable();
    $table->integer('required_hours')->default(500);
    // department_id removed for now
    $table->string('supervisor')->nullable();
    $table->enum('status', ['active', 'completed', 'cancelled', 'on_hold'])->default('active');
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('trainees');
    }
};
