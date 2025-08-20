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
        // For SQLite, we need to recreate the table with the new enum values
        // First, let's check if we're using SQLite
        if (DB::getDriverName() === 'sqlite') {
            // SQLite doesn't support altering enums, so we use a different approach
            DB::statement("
                DROP TABLE IF EXISTS cars_new;
                CREATE TABLE cars_new AS SELECT * FROM cars;
                DROP TABLE cars;
                CREATE TABLE cars (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    make VARCHAR NOT NULL,
                    model VARCHAR NOT NULL,
                    variant VARCHAR,
                    year INTEGER NOT NULL,
                    registration_number VARCHAR UNIQUE,
                    vin VARCHAR UNIQUE,
                    price DECIMAL(10,2) NOT NULL,
                    original_price DECIMAL(10,2),
                    market_value DECIMAL(10,2),
                    price_negotiable BOOLEAN DEFAULT 1,
                    mileage INTEGER,
                    fuel_type VARCHAR,
                    transmission VARCHAR,
                    engine_size INTEGER,
                    power_hp INTEGER,
                    drivetrain VARCHAR,
                    color VARCHAR,
                    doors INTEGER,
                    seats INTEGER,
                    condition VARCHAR CHECK(condition IN ('new', 'excellent', 'very_good', 'good', 'fair', 'poor')) DEFAULT 'good',
                    status VARCHAR CHECK(status IN ('available', 'reserved', 'sold', 'inactive')) DEFAULT 'available',
                    condition_notes TEXT,
                    defects JSON,
                    features JSON,
                    safety_features JSON,
                    comfort_features JSON,
                    technical_features JSON,
                    inspection_date DATE,
                    inspection_passed BOOLEAN,
                    previous_owners INTEGER,
                    accident_history BOOLEAN DEFAULT 0,
                    service_history TEXT,
                    seller_type VARCHAR,
                    seller_name VARCHAR,
                    seller_contact VARCHAR,
                    seller_notes TEXT,
                    created_by_id INTEGER,
                    featured BOOLEAN DEFAULT 0,
                    view_count INTEGER DEFAULT 0,
                    inquiry_count INTEGER DEFAULT 0,
                    published_at TIMESTAMP,
                    expires_at TIMESTAMP,
                    external_data JSON,
                    external_data_updated_at TIMESTAMP,
                    slug VARCHAR UNIQUE,
                    description TEXT,
                    marketing_text TEXT,
                    tags JSON,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP,
                    interested_car_id INTEGER,
                    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
                );
                INSERT INTO cars SELECT * FROM cars_new;
                DROP TABLE cars_new;
            ");
            
            // Recreate indexes (with IF NOT EXISTS for safety)
            DB::statement('CREATE INDEX IF NOT EXISTS cars_make_model_year_index ON cars(make, model, year)');
            DB::statement('CREATE INDEX IF NOT EXISTS cars_price_status_index ON cars(price, status)');
            DB::statement('CREATE INDEX IF NOT EXISTS cars_fuel_type_transmission_index ON cars(fuel_type, transmission)');
            DB::statement('CREATE INDEX IF NOT EXISTS cars_status_featured_published_at_index ON cars(status, featured, published_at)');
            DB::statement('CREATE INDEX IF NOT EXISTS cars_mileage_year_index ON cars(mileage, year)');
            DB::statement('CREATE INDEX IF NOT EXISTS cars_make_index ON cars(make)');
            DB::statement('CREATE INDEX IF NOT EXISTS cars_model_index ON cars(model)');
            DB::statement('CREATE INDEX IF NOT EXISTS cars_variant_index ON cars(variant)');
        } else {
            // For MySQL/PostgreSQL
            DB::statement("ALTER TABLE cars MODIFY COLUMN condition ENUM('new', 'excellent', 'very_good', 'good', 'fair', 'poor') DEFAULT 'good'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration is not easily reversible, especially for SQLite
        // In a production environment, you would handle this more carefully
        if (DB::getDriverName() === 'sqlite') {
            // For rollback, we would recreate the table without 'very_good'
            // But this is destructive and should be handled carefully in production
            DB::statement("
                DROP TABLE IF EXISTS cars_new;
                CREATE TABLE cars_new AS SELECT * FROM cars;
                DROP TABLE cars;
                CREATE TABLE cars (
                    -- Same structure but condition enum without 'very_good'
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    make VARCHAR NOT NULL,
                    model VARCHAR NOT NULL,
                    variant VARCHAR,
                    year INTEGER NOT NULL,
                    registration_number VARCHAR UNIQUE,
                    vin VARCHAR UNIQUE,
                    price DECIMAL(10,2) NOT NULL,
                    original_price DECIMAL(10,2),
                    market_value DECIMAL(10,2),
                    price_negotiable BOOLEAN DEFAULT 1,
                    mileage INTEGER,
                    fuel_type VARCHAR,
                    transmission VARCHAR,
                    engine_size INTEGER,
                    power_hp INTEGER,
                    drivetrain VARCHAR,
                    color VARCHAR,
                    doors INTEGER,
                    seats INTEGER,
                    condition VARCHAR CHECK(condition IN ('new', 'excellent', 'good', 'fair', 'poor')) DEFAULT 'good',
                    status VARCHAR CHECK(status IN ('available', 'reserved', 'sold', 'inactive')) DEFAULT 'available',
                    condition_notes TEXT,
                    defects JSON,
                    features JSON,
                    safety_features JSON,
                    comfort_features JSON,
                    technical_features JSON,
                    inspection_date DATE,
                    inspection_passed BOOLEAN,
                    previous_owners INTEGER,
                    accident_history BOOLEAN DEFAULT 0,
                    service_history TEXT,
                    seller_type VARCHAR,
                    seller_name VARCHAR,
                    seller_contact VARCHAR,
                    seller_notes TEXT,
                    created_by_id INTEGER,
                    featured BOOLEAN DEFAULT 0,
                    view_count INTEGER DEFAULT 0,
                    inquiry_count INTEGER DEFAULT 0,
                    published_at TIMESTAMP,
                    expires_at TIMESTAMP,
                    external_data JSON,
                    external_data_updated_at TIMESTAMP,
                    slug VARCHAR UNIQUE,
                    description TEXT,
                    marketing_text TEXT,
                    tags JSON,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP,
                    interested_car_id INTEGER,
                    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL
                );
                INSERT INTO cars SELECT * FROM cars_new WHERE condition != 'very_good';
                DROP TABLE cars_new;
            ");
        } else {
            DB::statement("ALTER TABLE cars MODIFY COLUMN condition ENUM('new', 'excellent', 'good', 'fair', 'poor') DEFAULT 'good'");
        }
    }
};
