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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('car_id')->nullable()->constrained('cars')->onDelete('set null');
            $table->foreignId('assigned_agent_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('status', ['open', 'in_progress', 'waiting_customer', 'closed'])->default('open');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('type', ['general_inquiry', 'car_inquiry', 'appointment', 'financing', 'service', 'complaint'])->default('general_inquiry');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamp('customer_last_read_at')->nullable();
            $table->timestamp('agent_last_read_at')->nullable();
            $table->boolean('has_unread_customer_messages')->default(false);
            $table->boolean('has_unread_agent_messages')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['customer_id', 'status', 'last_message_at']);
            $table->index(['assigned_agent_id', 'status', 'last_message_at']);
            $table->index(['car_id', 'created_at']);
            $table->index(['status', 'priority', 'last_message_at']);
            $table->index(['type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
