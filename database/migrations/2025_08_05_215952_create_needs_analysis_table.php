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
        Schema::create('needs_analysis', function (Blueprint $table) {
            $table->id();
            
            // Core Relationships
            $table->foreignId('customer_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('lead_id')->nullable()->constrained('leads')->onDelete('cascade');
            $table->string('session_id')->nullable(); // For anonymous users
            
            // Basic Customer Info
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_phone')->nullable();
            
            // Budget and Financing
            $table->decimal('budget_min', 10, 2)->nullable();
            $table->decimal('budget_max', 10, 2)->nullable();
            $table->enum('budget_flexibility', ['strict', 'flexible', 'very_flexible'])->nullable();
            $table->enum('payment_method', ['cash', 'financing', 'leasing', 'mixed'])->nullable();
            $table->boolean('trade_in_vehicle')->default(false);
            $table->decimal('trade_in_value', 10, 2)->nullable();
            
            // Vehicle Preferences
            $table->json('preferred_makes')->nullable(); // Array of preferred brands
            $table->json('preferred_models')->nullable(); // Array of preferred models
            $table->enum('vehicle_type', ['sedan', 'suv', 'hatchback', 'wagon', 'coupe', 'convertible', 'pickup', 'van'])->nullable();
            $table->enum('size_preference', ['small', 'medium', 'large', 'extra_large'])->nullable();
            $table->integer('min_year')->nullable();
            $table->integer('max_mileage')->nullable();
            
            // Usage Patterns
            $table->enum('primary_use', ['commuting', 'family', 'business', 'leisure', 'mixed'])->nullable();
            $table->integer('annual_mileage')->nullable();
            $table->enum('driving_environment', ['city', 'highway', 'mixed', 'rural'])->nullable();
            $table->integer('passengers_needed')->nullable(); // Number of passengers regularly
            $table->boolean('cargo_space_important')->default(false);
            
            // Fuel and Environmental Preferences
            $table->json('fuel_preferences')->nullable(); // petrol, diesel, electric, hybrid
            $table->enum('environmental_priority', ['low', 'medium', 'high'])->nullable();
            $table->boolean('fuel_economy_important')->default(false);
            
            // Features and Equipment
            $table->json('must_have_features')->nullable(); // Required features
            $table->json('nice_to_have_features')->nullable(); // Preferred features
            $table->json('safety_priorities')->nullable(); // Safety features importance
            $table->json('comfort_priorities')->nullable(); // Comfort features importance
            $table->json('technology_priorities')->nullable(); // Tech features importance
            
            // Lifestyle and Personal Preferences
            $table->enum('lifestyle', ['urban_professional', 'family_oriented', 'outdoor_enthusiast', 'luxury_seeker', 'practical_driver'])->nullable();
            $table->json('activities')->nullable(); // Hobbies/activities affecting car choice
            $table->boolean('brand_loyalty')->default(false);
            $table->string('preferred_brand')->nullable();
            
            // Timeline and Urgency
            $table->enum('purchase_timeline', ['immediate', 'one_month', 'three_months', 'six_months', 'flexible'])->nullable();
            $table->enum('urgency_level', ['low', 'medium', 'high', 'urgent'])->nullable();
            $table->text('timeline_notes')->nullable();
            
            // Experience and Knowledge
            $table->enum('car_knowledge_level', ['beginner', 'intermediate', 'expert'])->nullable();
            $table->boolean('first_time_buyer')->default(false);
            $table->integer('previous_cars_owned')->nullable();
            $table->string('current_vehicle')->nullable();
            
            // Complete Questionnaire Data
            $table->json('responses')->nullable(); // All questionnaire responses
            $table->integer('questions_answered')->default(0);
            $table->integer('total_questions')->default(0);
            $table->decimal('completion_percentage', 5, 2)->default(0.00);
            
            // Matching and Scoring
            $table->json('compatibility_scores')->nullable(); // Car ID => compatibility score
            $table->json('recommended_cars')->nullable(); // Top recommended car IDs
            $table->decimal('profile_completeness', 5, 2)->default(0.00); // How complete the profile is
            $table->integer('matching_confidence')->default(0); // 0-100 confidence in matches
            
            // Analysis Results
            $table->text('needs_summary')->nullable(); // AI-generated summary
            $table->json('priority_factors')->nullable(); // What matters most to customer
            $table->json('constraints')->nullable(); // Limiting factors
            $table->json('opportunities')->nullable(); // Upselling opportunities
            
            // Status and Workflow
            $table->enum('status', ['draft', 'completed', 'reviewed', 'matched', 'contacted'])->default('draft');
            $table->boolean('consent_marketing')->default(false);
            $table->boolean('consent_contact')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['customer_id', 'status']);
            $table->index(['completion_percentage', 'status']);
            $table->index(['budget_min', 'budget_max']);
            $table->index(['purchase_timeline', 'urgency_level']);
            $table->index(['session_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('needs_analysis');
    }
};
