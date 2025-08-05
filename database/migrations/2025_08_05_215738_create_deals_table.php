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
        Schema::create('deals', function (Blueprint $table) {
            $table->id();
            
            // Core Relationships
            $table->foreignId('lead_id')->constrained('leads')->onDelete('cascade');
            $table->foreignId('car_id')->nullable()->constrained('cars')->onDelete('set null');
            $table->foreignId('customer_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Deal Pipeline Status
            $table->enum('status', [
                'new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 
                'agreement_pending', 'financing', 'inspection', 'finalizing', 
                'completed', 'cancelled', 'lost'
            ])->default('new');
            $table->integer('stage_order')->default(1); // For pipeline ordering
            
            // Deal Type and Source
            $table->enum('deal_type', ['buy_car', 'sell_car', 'trade_in', 'consultation']);
            $table->string('deal_source')->nullable(); // How the deal originated
            
            // Financial Information
            $table->decimal('vehicle_price', 10, 2)->nullable(); // Agreed vehicle price
            $table->decimal('commission_rate', 5, 4)->default(0.01); // 1% default
            $table->decimal('commission_amount', 10, 2)->nullable(); // Calculated commission
            $table->decimal('savings_amount', 10, 2)->nullable(); // Customer savings
            $table->decimal('financing_amount', 10, 2)->nullable(); // Loan amount
            $table->decimal('down_payment', 10, 2)->nullable();
            $table->string('financing_partner')->nullable(); // Bank/finance company
            
            // Deal Management
            $table->foreignId('assigned_agent_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->integer('priority')->default(3); // 1=high, 2=medium, 3=low
            $table->decimal('probability', 3, 2)->default(0.50); // 0.00 to 1.00 (50% default)
            
            // Timeline Tracking
            $table->timestamp('first_contact_at')->nullable();
            $table->timestamp('proposal_sent_at')->nullable();
            $table->timestamp('agreement_signed_at')->nullable();
            $table->timestamp('expected_close_date')->nullable();
            $table->timestamp('actual_close_date')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            
            // Deal Details and Notes
            $table->text('description')->nullable();
            $table->text('customer_requirements')->nullable();
            $table->text('negotiation_notes')->nullable();
            $table->text('internal_notes')->nullable(); // Private notes for team
            $table->json('deal_terms')->nullable(); // Structured deal terms
            
            // Document Management
            $table->json('documents')->nullable(); // Array of document references
            $table->string('contract_url')->nullable(); // Link to signed contract
            $table->string('signature_request_id')->nullable(); // External signature service ID
            $table->timestamp('contract_signed_at')->nullable();
            
            // Competition and Market Data
            $table->json('competitor_offers')->nullable(); // Other offers customer has
            $table->decimal('market_comparison', 10, 2)->nullable(); // How we compare to market
            $table->text('unique_selling_points')->nullable();
            
            // Follow-up and Communication
            $table->timestamp('next_follow_up_at')->nullable();
            $table->string('next_action')->nullable(); // What needs to happen next
            $table->enum('communication_preference', ['email', 'phone', 'in_person', 'video_call'])->nullable();
            
            // Deal Outcome Analysis
            $table->string('lost_reason')->nullable(); // Why deal was lost
            $table->text('lessons_learned')->nullable(); // Post-deal analysis
            $table->integer('customer_satisfaction_score')->nullable(); // 1-10 rating
            $table->boolean('referral_potential')->default(false);
            
            // Insurance Integration
            $table->string('insurance_partner')->nullable();
            $table->decimal('insurance_commission', 10, 2)->nullable();
            $table->boolean('insurance_sold')->default(false);
            
            $table->timestamps();
            
            // Indexes for performance and reporting
            $table->index(['status', 'assigned_agent_id']);
            $table->index(['deal_type', 'status', 'created_at']);
            $table->index(['expected_close_date', 'probability']);
            $table->index(['lead_id', 'status']);
            $table->index(['car_id', 'status']);
            $table->index(['commission_amount', 'actual_close_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
