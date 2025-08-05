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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            
            // Basic Vehicle Information
            $table->string('make'); // Volvo, BMW, Audi, etc.
            $table->string('model'); // XC90, 3 Series, A4, etc.
            $table->string('variant')->nullable(); // Specific trim/variant
            $table->integer('year');
            $table->string('registration_number')->unique()->nullable(); // Swedish reg number
            $table->string('vin')->unique()->nullable(); // Vehicle Identification Number
            
            // Pricing Information
            $table->decimal('price', 10, 2); // SEK
            $table->decimal('original_price', 10, 2)->nullable(); // Original asking price
            $table->decimal('market_value', 10, 2)->nullable(); // Estimated market value
            $table->boolean('price_negotiable')->default(true);
            
            // Technical Specifications
            $table->integer('mileage')->nullable(); // kilometers
            $table->string('fuel_type')->nullable(); // petrol, diesel, electric, hybrid
            $table->string('transmission')->nullable(); // manual, automatic
            $table->integer('engine_size')->nullable(); // cc
            $table->integer('power_hp')->nullable(); // horsepower
            $table->string('drivetrain')->nullable(); // fwd, rwd, awd
            $table->string('color')->nullable();
            $table->integer('doors')->nullable();
            $table->integer('seats')->nullable();
            
            // Vehicle Status and Condition
            $table->enum('condition', ['new', 'excellent', 'good', 'fair', 'poor'])->default('good');
            $table->enum('status', ['available', 'reserved', 'sold', 'inactive'])->default('available');
            $table->text('condition_notes')->nullable();
            $table->json('defects')->nullable(); // List of known issues/defects
            
            // Features and Equipment
            $table->json('features')->nullable(); // Array of car features
            $table->json('safety_features')->nullable(); // Safety equipment
            $table->json('comfort_features')->nullable(); // Comfort/convenience features
            $table->json('technical_features')->nullable(); // Technical equipment
            
            // Inspection and Documentation
            $table->date('inspection_date')->nullable(); // Swedish vehicle inspection
            $table->boolean('inspection_passed')->nullable();
            $table->integer('previous_owners')->nullable();
            $table->boolean('accident_history')->default(false);
            $table->text('service_history')->nullable();
            
            // Seller Information
            $table->string('seller_type')->nullable(); // dealer, private, company
            $table->string('seller_name')->nullable();
            $table->string('seller_contact')->nullable();
            $table->text('seller_notes')->nullable();
            
            // Admin and Management
            $table->foreignId('created_by_id')->nullable()->constrained('users')->onDelete('set null');
            $table->boolean('featured')->default(false);
            $table->integer('view_count')->default(0);
            $table->integer('inquiry_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            
            // External Data Integration
            $table->json('external_data')->nullable(); // car.info API data
            $table->timestamp('external_data_updated_at')->nullable();
            
            // SEO and Marketing
            $table->string('slug')->unique()->nullable(); // URL-friendly identifier
            $table->text('description')->nullable();
            $table->text('marketing_text')->nullable();
            $table->json('tags')->nullable(); // Searchable tags
            
            $table->timestamps();
            
            // Indexes for performance and filtering
            $table->index(['make', 'model', 'year']);
            $table->index(['price', 'status']);
            $table->index(['fuel_type', 'transmission']);
            $table->index(['status', 'featured', 'published_at']);
            $table->index(['mileage', 'year']);
            // Note: Full-text search removed for SQLite compatibility
            $table->index(['make']);
            $table->index(['model']);
            $table->index(['variant']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
