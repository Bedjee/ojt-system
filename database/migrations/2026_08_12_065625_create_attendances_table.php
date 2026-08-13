<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up()
{
    Schema::create('attendances', function (Blueprint $table) {
        $table->id();
        $table->foreignId('trainee_id')->constrained('trainees')->onDelete('cascade');
        $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
        $table->date('date');
        $table->dateTime('morning_time_in')->nullable();
        $table->dateTime('lunch_time_out')->nullable();
        $table->dateTime('afternoon_time_in')->nullable();
        $table->dateTime('time_out')->nullable();
        $table->decimal('morning_hours', 5, 2)->nullable(); // e.g., 4.25
        $table->decimal('afternoon_hours', 5, 2)->nullable();
        $table->decimal('total_hours', 5, 2)->nullable();
        $table->enum('status', ['present', 'absent', 'incomplete'])->default('incomplete');
        $table->timestamps();

        $table->unique(['trainee_id', 'date']);
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
