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
        Schema::table('users', function (Blueprint $table) {
            // Only add fields that don't already exist
            // phone and role already exist
            
            // Personal details
            $table->date('date_of_birth')->nullable()->after('role');
            $table->string('address')->nullable()->after('date_of_birth');
            $table->string('city')->nullable()->after('address');
            $table->string('postal_code')->nullable()->after('city');
            
            // Communication preferences
            $table->enum('preferred_contact_method', ['email', 'phone', 'sms'])->default('email')->after('postal_code');
            $table->boolean('marketing_consent')->default(false)->after('preferred_contact_method');
            
            // Customer notes for admin use (update existing customer_notes if exists)
            if (!Schema::hasColumn('users', 'customer_notes')) {
                $table->text('customer_notes')->nullable()->after('marketing_consent');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'date_of_birth',
                'address',
                'city',
                'postal_code',
                'preferred_contact_method',
                'marketing_consent',
                'customer_notes'
            ]);
        });
    }
};