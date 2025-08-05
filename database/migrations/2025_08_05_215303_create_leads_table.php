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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            
            // Customer Information
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            
            // Lead Source and Type
            $table->enum('source', ['needs_analysis', 'car_deal_request', 'sell_car', 'website_contact']);
            $table->enum('type', ['buy_car', 'sell_car', 'needs_analysis']);
            
            // Lead Status Management
            $table->enum('status', ['open', 'in_process', 'waiting', 'finance', 'done', 'cancelled']);
            $table->integer('priority')->default(3); // 1=high, 2=medium, 3=low
            
            // Assignment and Ownership
            $table->foreignId('assigned_agent_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('created_by_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Lead Details
            $table->text('description')->nullable();
            $table->json('preferences')->nullable(); // Store needs analysis results, preferences, etc.
            $table->decimal('budget_min', 10, 2)->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            
            // Contact Preferences
            $table->enum('preferred_contact_method', ['email', 'phone', 'both'])->default('both');
            $table->boolean('marketing_consent')->default(false);
            
            // Tracking Fields
            $table->timestamp('first_contact_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->decimal('estimated_value', 10, 2)->nullable(); // Potential commission value
            $table->integer('lead_score')->default(0); // Lead scoring for prioritization
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['status', 'assigned_agent_id']);
            $table->index(['source', 'created_at']);
            $table->index(['lead_score', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
