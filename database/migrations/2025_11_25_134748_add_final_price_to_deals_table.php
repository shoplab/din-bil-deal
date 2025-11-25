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
        Schema::table('deals', function (Blueprint $table) {
            $table->decimal('final_price', 10, 2)->nullable()->after('vehicle_price');
            $table->decimal('deposit_amount', 10, 2)->nullable()->after('down_payment');
            $table->text('deal_notes')->nullable()->after('internal_notes');
            $table->text('closing_notes')->nullable()->after('deal_notes');
            $table->string('documents_status')->nullable()->after('contract_signed_at');
            $table->string('financing_status')->nullable()->after('financing_amount');
            $table->string('insurance_status')->nullable()->after('insurance_sold');
            $table->string('inspection_status')->nullable()->after('insurance_status');
            $table->timestamp('closed_at')->nullable()->after('actual_close_date');
            $table->text('competitor_info')->nullable()->after('competitor_offers');
            $table->timestamp('next_action_date')->nullable()->after('next_follow_up_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deals', function (Blueprint $table) {
            $table->dropColumn([
                'final_price',
                'deposit_amount',
                'deal_notes',
                'closing_notes',
                'documents_status',
                'financing_status',
                'insurance_status',
                'inspection_status',
                'closed_at',
                'competitor_info',
                'next_action_date',
            ]);
        });
    }
};
