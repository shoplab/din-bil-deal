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
        Schema::create('car_images', function (Blueprint $table) {
            $table->id();
            
            // Core Relationship
            $table->foreignId('car_id')->constrained('cars')->onDelete('cascade');
            
            // Image Storage
            $table->string('filename'); // Original filename
            $table->string('path'); // Storage path
            $table->string('url'); // Public URL
            $table->string('thumbnail_path')->nullable(); // Thumbnail version
            $table->string('thumbnail_url')->nullable(); // Thumbnail public URL
            
            // Image Metadata
            $table->string('alt_text')->nullable(); // For accessibility
            $table->string('title')->nullable(); // Image title/caption
            $table->text('description')->nullable(); // Detailed description
            $table->enum('type', ['exterior', 'interior', 'engine', 'dashboard', 'trunk', 'wheels', 'other'])->default('exterior');
            
            // Display and Ordering
            $table->integer('sort_order')->default(0); // Display order
            $table->boolean('is_primary')->default(false); // Main listing image
            $table->boolean('is_featured')->default(false); // Featured in gallery
            $table->boolean('is_360')->default(false); // 360-degree view
            
            // Technical Details
            $table->string('mime_type')->nullable(); // image/jpeg, image/png
            $table->integer('file_size')->nullable(); // In bytes
            $table->integer('width')->nullable(); // Image width
            $table->integer('height')->nullable(); // Image height
            $table->string('color_profile')->nullable(); // sRGB, Adobe RGB, etc.
            
            // Upload and Processing
            $table->foreignId('uploaded_by_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('processing_status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->text('processing_error')->nullable(); // Error message if processing failed
            $table->timestamp('processed_at')->nullable();
            
            // Optimization and Variants
            $table->json('variants')->nullable(); // Different sizes/formats generated
            $table->boolean('optimized')->default(false); // Whether image has been optimized
            $table->integer('compression_quality')->nullable(); // JPEG quality used
            
            // Usage Tracking
            $table->integer('view_count')->default(0);
            $table->timestamp('last_viewed_at')->nullable();
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['car_id', 'sort_order']);
            $table->index(['car_id', 'is_primary']);
            $table->index(['car_id', 'type']);
            $table->index(['processing_status', 'created_at']);
            $table->unique(['car_id', 'is_primary'], 'unique_primary_per_car');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_images');
    }
};
