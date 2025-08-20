<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, we'll recreate the table with the correct constraint
        if (DB::getDriverName() === 'sqlite') {
            DB::transaction(function () {
                // Create a temporary table with all data
                DB::statement('CREATE TEMPORARY TABLE cars_backup AS SELECT * FROM cars');
                
                // Drop the current table
                DB::statement('DROP TABLE cars');
                
                // Recreate with proper constraint
                DB::statement("
                    CREATE TABLE cars (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        make VARCHAR NOT NULL,
                        model VARCHAR NOT NULL,
                        variant VARCHAR,
                        year INTEGER NOT NULL,
                        registration_number VARCHAR,
                        vin VARCHAR,
                        price NUMERIC NOT NULL,
                        original_price NUMERIC,
                        market_value NUMERIC,
                        price_negotiable TINYINT(1) NOT NULL DEFAULT '1',
                        mileage INTEGER,
                        fuel_type VARCHAR,
                        transmission VARCHAR,
                        engine_size INTEGER,
                        power_hp INTEGER,
                        drivetrain VARCHAR,
                        color VARCHAR,
                        doors INTEGER,
                        seats INTEGER,
                        condition VARCHAR CHECK (condition IN ('new', 'excellent', 'very_good', 'good', 'fair', 'poor')) NOT NULL DEFAULT 'good',
                        status VARCHAR CHECK (status IN ('available', 'reserved', 'sold', 'inactive')) NOT NULL DEFAULT 'available',
                        condition_notes TEXT,
                        defects TEXT,
                        features TEXT,
                        safety_features TEXT,
                        comfort_features TEXT,
                        technical_features TEXT,
                        inspection_date DATE,
                        inspection_passed TINYINT(1),
                        previous_owners INTEGER,
                        accident_history TINYINT(1) NOT NULL DEFAULT '0',
                        service_history TEXT,
                        seller_type VARCHAR,
                        seller_name VARCHAR,
                        seller_contact VARCHAR,
                        seller_notes TEXT,
                        created_by_id INTEGER,
                        featured TINYINT(1) NOT NULL DEFAULT '0',
                        view_count INTEGER NOT NULL DEFAULT '0',
                        inquiry_count INTEGER NOT NULL DEFAULT '0',
                        published_at DATETIME,
                        expires_at DATETIME,
                        external_data TEXT,
                        external_data_updated_at DATETIME,
                        slug VARCHAR,
                        description TEXT,
                        marketing_text TEXT,
                        tags TEXT,
                        created_at DATETIME,
                        updated_at DATETIME,
                        FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
                    )
                ");
                
                // Restore data
                DB::statement('INSERT INTO cars SELECT * FROM cars_backup');
                
                // Drop temporary table
                DB::statement('DROP TABLE cars_backup');
                
                // Recreate indexes
                DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS cars_registration_number_unique ON cars(registration_number)');
                DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS cars_vin_unique ON cars(vin)');
                DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS cars_slug_unique ON cars(slug)');
                DB::statement('CREATE INDEX IF NOT EXISTS cars_make_model_year_index ON cars(make, model, year)');
                DB::statement('CREATE INDEX IF NOT EXISTS cars_price_status_index ON cars(price, status)');
                DB::statement('CREATE INDEX IF NOT EXISTS cars_fuel_type_transmission_index ON cars(fuel_type, transmission)');
                DB::statement('CREATE INDEX IF NOT EXISTS cars_status_featured_published_at_index ON cars(status, featured, published_at)');
                DB::statement('CREATE INDEX IF NOT EXISTS cars_mileage_year_index ON cars(mileage, year)');
                DB::statement('CREATE INDEX IF NOT EXISTS cars_make_index ON cars(make)');
                DB::statement('CREATE INDEX IF NOT EXISTS cars_model_index ON cars(model)');
                DB::statement('CREATE INDEX IF NOT EXISTS cars_variant_index ON cars(variant)');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is not easily reversible
        // The rollback would recreate the old constraint without 'very_good'
        // which could cause data loss if any records have 'very_good' condition
    }
};
