<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainee_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->json('requested_fields');           // ["morning_time_in","lunch_time_out", ...]
            $table->json('requested_times')->nullable(); // {"morning_time_in":"08:00", ...}
            $table->text('reason')->nullable();
            $table->string('verification_image')->nullable();
            $table->enum('status', ['pending_letter', 'pending', 'approved', 'rejected'])
                  ->default('pending_letter');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();

            $table->index(['trainee_id', 'date']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_requests');
    }
};