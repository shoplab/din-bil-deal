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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('car_id')->constrained('cars')->onDelete('cascade');
            $table->foreignId('assigned_agent_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Appointment details
            $table->enum('type', ['viewing', 'test_drive', 'consultation', 'delivery'])->default('viewing');
            $table->enum('status', ['requested', 'confirmed', 'completed', 'cancelled', 'no_show'])->default('requested');
            $table->datetime('appointment_date');
            $table->integer('duration_minutes')->default(60);
            
            // Customer information
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone')->nullable();
            $table->text('customer_message')->nullable();
            
            // Location and logistics
            $table->string('location')->default('showroom');
            $table->string('address')->nullable();
            $table->text('special_requirements')->nullable();
            
            // Admin notes and follow-up
            $table->text('admin_notes')->nullable();
            $table->text('completion_notes')->nullable();
            $table->datetime('confirmed_at')->nullable();
            $table->datetime('completed_at')->nullable();
            $table->datetime('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            
            // Reminders and notifications
            $table->boolean('reminder_sent')->default(false);
            $table->datetime('reminder_sent_at')->nullable();
            $table->boolean('follow_up_required')->default(true);
            $table->datetime('follow_up_date')->nullable();
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['customer_id', 'appointment_date']);
            $table->index(['car_id', 'appointment_date']);
            $table->index(['assigned_agent_id', 'appointment_date']);
            $table->index('appointment_date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};