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
        Schema::create('lead_activities', function (Blueprint $table) {
            $table->id();
            
            // Core Relationships
            $table->foreignId('lead_id')->constrained('leads')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null'); // Who performed the activity
            $table->foreignId('deal_id')->nullable()->constrained('deals')->onDelete('set null'); // Related deal if applicable
            
            // Activity Details
            $table->enum('activity_type', [
                'created', 'status_changed', 'assigned', 'contacted', 'email_sent', 'call_made', 
                'meeting_scheduled', 'proposal_sent', 'document_signed', 'payment_received',
                'note_added', 'follow_up_scheduled', 'lead_qualified', 'deal_created', 'deal_closed'
            ]);
            $table->string('activity_title'); // Short description
            $table->text('description')->nullable(); // Detailed description
            
            // Activity Context
            $table->json('activity_data')->nullable(); // Structured data about the activity
            $table->string('old_value')->nullable(); // Previous value for changes
            $table->string('new_value')->nullable(); // New value for changes
            
            // Communication Details
            $table->enum('communication_method', ['email', 'phone', 'sms', 'in_person', 'video_call', 'system'])->nullable();
            $table->text('communication_content')->nullable(); // Email content, call notes, etc.
            $table->string('communication_subject')->nullable(); // Email subject, call purpose
            $table->enum('communication_direction', ['inbound', 'outbound'])->nullable();
            $table->boolean('communication_successful')->nullable(); // Was contact successful
            
            // Scheduling and Follow-up
            $table->timestamp('scheduled_at')->nullable(); // When activity was scheduled
            $table->timestamp('completed_at')->nullable(); // When activity was completed
            $table->timestamp('follow_up_at')->nullable(); // Next follow-up scheduled
            $table->string('follow_up_type')->nullable(); // Type of follow-up needed
            
            // Priority and Status
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->enum('status', ['pending', 'completed', 'cancelled', 'failed'])->default('completed');
            $table->text('outcome')->nullable(); // Result of the activity
            
            // Integration and External References
            $table->string('external_id')->nullable(); // ID from external system (email service, etc.)
            $table->string('external_url')->nullable(); // Link to external resource
            $table->json('metadata')->nullable(); // Additional metadata
            
            // Analytics and Tracking
            $table->integer('duration_minutes')->nullable(); // How long activity took
            $table->decimal('cost', 8, 2)->nullable(); // Cost of activity (if applicable)
            $table->boolean('billable')->default(false); // Is this billable to customer
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['lead_id', 'created_at']);
            $table->index(['user_id', 'activity_type']);
            $table->index(['activity_type', 'created_at']);
            $table->index(['status', 'scheduled_at']);
            $table->index(['follow_up_at', 'status']);
            $table->index(['deal_id', 'activity_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lead_activities');
    }
};
