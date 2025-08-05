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
            // Role-based access control
            $table->enum('role', ['admin', 'manager', 'agent', 'customer'])->default('customer')->after('email_verified_at');
            $table->boolean('is_active')->default(true)->after('role');
            
            // Additional user information for agents/staff
            $table->string('phone')->nullable()->after('email');
            $table->string('department')->nullable()->after('is_active');
            $table->text('bio')->nullable()->after('department');
            $table->json('permissions')->nullable()->after('bio'); // Custom permissions
            
            // Employment and professional info
            $table->date('hire_date')->nullable()->after('permissions');
            $table->string('employee_id')->nullable()->unique()->after('hire_date');
            $table->foreignId('manager_id')->nullable()->constrained('users')->onDelete('set null')->after('employee_id');
            
            // Performance and activity tracking
            $table->integer('leads_assigned')->default(0)->after('manager_id');
            $table->integer('deals_closed')->default(0)->after('leads_assigned');
            $table->decimal('total_commission', 10, 2)->default(0)->after('deals_closed');
            $table->timestamp('last_login_at')->nullable()->after('total_commission');
            
            // Indexes for performance
            $table->index(['role', 'is_active']);
            $table->index(['manager_id', 'role']);
            $table->index(['employee_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
            $table->dropIndex(['role', 'is_active']);
            $table->dropIndex(['manager_id', 'role']);
            $table->dropIndex(['employee_id']);
            
            $table->dropColumn([
                'role', 'is_active', 'phone', 'department', 'bio', 'permissions',
                'hire_date', 'employee_id', 'manager_id', 'leads_assigned', 
                'deals_closed', 'total_commission', 'last_login_at'
            ]);
        });
    }
};
