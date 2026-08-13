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
    Schema::create('attendance_corrections', function (Blueprint $table) {
        $table->id();
        $table->foreignId('attendance_id')->constrained()->onDelete('cascade');
        $table->foreignId('corrected_by')->constrained('users')->onDelete('cascade');
        $table->foreignId('trainee_id')->constrained()->onDelete('cascade');
        $table->json('old_values');
        $table->json('new_values');
        $table->text('reason');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_corrections');
    }
};
