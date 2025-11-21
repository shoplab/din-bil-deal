<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // SQLite doesn't support modifying enum, so we'll drop and recreate
        Schema::table('form_questions', function (Blueprint $table) {
            $table->dropColumn('type');
        });

        Schema::table('form_questions', function (Blueprint $table) {
            $table->string('type')->default('single_select')->after('image_url');
        });
    }

    public function down(): void
    {
        Schema::table('form_questions', function (Blueprint $table) {
            $table->dropColumn('type');
        });

        Schema::table('form_questions', function (Blueprint $table) {
            $table->enum('type', ['multiselect', 'single_select', 'slider', 'image_select'])->after('image_url');
        });
    }
};
