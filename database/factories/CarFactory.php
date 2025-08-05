<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Car;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Swedish car market popular makes/models
        $carData = $this->getRandomCarData();
        $make = $carData['make'];
        $model = $carData['model'];
        $variant = $this->faker->optional(0.6)->randomElement($carData['variants'] ?? []);
        
        $year = $this->faker->numberBetween(2015, 2024);
        $mileage = $this->calculateMileage($year);
        $price = $this->calculatePrice($make, $model, $year, $mileage);
        $marketValue = $price * $this->faker->randomFloat(2, 1.05, 1.25);
        
        return [
            'make' => $make,
            'model' => $model,
            'variant' => $variant,
            'year' => $year,
            'registration_number' => $this->generateSwedishRegNumber(),
            'vin' => $this->generateVIN(),
            'price' => $price,
            'original_price' => $price * $this->faker->randomFloat(2, 1.00, 1.15),
            'market_value' => $marketValue,
            'price_negotiable' => $this->faker->boolean(80), // 80% negotiable
            'mileage' => $mileage,
            'fuel_type' => $this->faker->randomElement(['petrol', 'diesel', 'electric', 'hybrid']),
            'transmission' => $this->faker->randomElement(['automatic', 'manual']),
            'engine_size' => $this->faker->numberBetween(1200, 3000),
            'power_hp' => $this->faker->numberBetween(100, 400),
            'drivetrain' => $this->faker->randomElement(['fwd', 'rwd', 'awd']),
            'color' => $this->faker->randomElement([
                'Svart', 'Vit', 'Grå', 'Silver', 'Blå', 'Röd', 
                'Grön', 'Beige', 'Brun', 'Gul'
            ]),
            'doors' => $this->faker->randomElement([3, 4, 5]),
            'seats' => $this->faker->numberBetween(2, 7),
            'condition' => $this->faker->randomElement(['new', 'excellent', 'good', 'fair']),
            'status' => $this->faker->randomElement(['available', 'reserved', 'sold']),
            'condition_notes' => $this->faker->optional(0.3)->text(200),
            'defects' => $this->faker->optional(0.2)->randomElements([
                'Mindre repor på lack', 'Slitage på säten', 'Stöt i farg', 
                'Mindre buckla', 'Sliten ratt', 'Repor på fälgar'
            ], rand(1, 3)),
            'features' => $this->generateFeatures(),
            'safety_features' => $this->generateSafetyFeatures(),
            'comfort_features' => $this->generateComfortFeatures(),
            'technical_features' => $this->generateTechnicalFeatures(),
            'inspection_date' => $this->faker->optional(0.8)->dateTimeBetween('-2 years', '+1 year'),
            'inspection_passed' => $this->faker->boolean(90),
            'previous_owners' => $this->faker->numberBetween(1, 4),
            'accident_history' => $this->faker->boolean(15), // 15% have accident history
            'service_history' => $this->faker->optional(0.7)->text(300),
            'seller_type' => $this->faker->randomElement(['dealer', 'private', 'company']),
            'seller_name' => $this->faker->optional(0.8)->name(),
            'seller_contact' => $this->faker->optional(0.8)->phoneNumber(),
            'created_by_id' => User::where('role', 'admin')->inRandomOrder()->first()?->id,
            'featured' => $this->faker->boolean(20), // 20% featured
            'view_count' => $this->faker->numberBetween(0, 500),
            'inquiry_count' => $this->faker->numberBetween(0, 50),
            'published_at' => $this->faker->optional(0.8)->dateTimeBetween('-30 days', 'now'),
            'expires_at' => $this->faker->optional(0.3)->dateTimeBetween('+30 days', '+90 days'),
            'description' => $this->generateCarDescription($make, $model, $year),
            'marketing_text' => $this->faker->optional(0.5)->text(150),
            'tags' => $this->faker->optional(0.6)->randomElements([
                'familjebil', 'ekonomisk', 'miljövänlig', 'sportig', 
                'lyxig', 'praktisk', 'pålitlig', 'låg_miltall'
            ], rand(1, 4)),
            'created_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ];
    }
    
    private function getRandomCarData(): array
    {
        $swedishPopularCars = [
            ['make' => 'Volvo', 'model' => 'XC60', 'variants' => ['T5', 'T6', 'T8', 'B5', 'B6']],
            ['make' => 'Volvo', 'model' => 'XC90', 'variants' => ['T5', 'T6', 'T8', 'B5', 'B6']],
            ['make' => 'Volvo', 'model' => 'V90', 'variants' => ['T5', 'T6', 'T8', 'Cross Country']],
            ['make' => 'Volvo', 'model' => 'S90', 'variants' => ['T5', 'T6', 'T8']],
            ['make' => 'BMW', 'model' => '3 Series', 'variants' => ['320i', '330i', '320d', '330d', 'M340i']],
            ['make' => 'BMW', 'model' => 'X3', 'variants' => ['xDrive20i', 'xDrive30i', 'xDrive20d', 'xDrive30d']],
            ['make' => 'BMW', 'model' => '5 Series', 'variants' => ['520i', '530i', '520d', '530d']],
            ['make' => 'Audi', 'model' => 'A4', 'variants' => ['35 TFSI', '40 TFSI', '35 TDI', '40 TDI']],
            ['make' => 'Audi', 'model' => 'Q5', 'variants' => ['40 TDI', '45 TFSI', '50 TDI']],
            ['make' => 'Mercedes-Benz', 'model' => 'C-Class', 'variants' => ['C200', 'C220d', 'C300', 'AMG C43']],
            ['make' => 'Mercedes-Benz', 'model' => 'GLC', 'variants' => ['GLC200', 'GLC220d', 'GLC300']],
            ['make' => 'Toyota', 'model' => 'RAV4', 'variants' => ['2.0', '2.5 Hybrid', 'Plug-in Hybrid']],
            ['make' => 'Volkswagen', 'model' => 'Golf', 'variants' => ['1.0 TSI', '1.5 TSI', '2.0 TDI', 'GTI']],
            ['make' => 'Volkswagen', 'model' => 'Tiguan', 'variants' => ['1.5 TSI', '2.0 TSI', '2.0 TDI']],
            ['make' => 'Tesla', 'model' => 'Model 3', 'variants' => ['Standard Range', 'Long Range', 'Performance']],
            ['make' => 'Tesla', 'model' => 'Model Y', 'variants' => ['Long Range', 'Performance']],
        ];
        
        return $this->faker->randomElement($swedishPopularCars);
    }
    
    private function calculateMileage(int $year): int
    {
        $age = now()->year - $year;
        $averageMileagePerYear = $this->faker->numberBetween(10000, 25000);
        return $age * $averageMileagePerYear + $this->faker->numberBetween(-10000, 10000);
    }
    
    private function calculatePrice(string $make, string $model, int $year, int $mileage): int
    {
        // Base prices for different makes (approximate Swedish market)
        $basePrices = [
            'Volvo' => 450000,
            'BMW' => 520000,
            'Audi' => 500000,
            'Mercedes-Benz' => 550000,
            'Toyota' => 350000,
            'Volkswagen' => 320000,
            'Tesla' => 600000,
        ];
        
        $basePrice = $basePrices[$make] ?? 300000;
        
        // Depreciation per year (rough estimate)
        $age = now()->year - $year;
        $depreciationRate = 0.15; // 15% per year
        $ageDepreciation = 1 - min($age * $depreciationRate, 0.7); // Max 70% depreciation
        
        // Mileage impact
        $mileageImpact = 1 - min($mileage / 300000, 0.3); // Max 30% impact from mileage
        
        $finalPrice = $basePrice * $ageDepreciation * $mileageImpact;
        
        // Add some randomness
        $finalPrice *= $this->faker->randomFloat(2, 0.85, 1.15);
        
        return (int) max($finalPrice, 50000); // Minimum 50k SEK
    }
    
    private function generateSwedishRegNumber(): string
    {
        // Swedish registration format: ABC123 or ABC12A
        $letters = strtoupper($this->faker->lexify('???'));
        $numbers = $this->faker->numerify('###');
        return $letters . $numbers;
    }
    
    private function generateVIN(): string
    {
        return strtoupper($this->faker->bothify('?##############??'));
    }
    
    private function generateFeatures(): array
    {
        $allFeatures = [
            'Luftkonditionering', 'Cruise control', 'Parkeringssensorer', 
            'Backkamera', 'Navigationsystem', 'Bluetooth', 'Handsfree',
            'El-fönster fram', 'El-fönster bak', 'Centrallås', 'Alarm',
            'Metalliclack', 'Tintade rutor', 'Dragkrok', 'Takräcke'
        ];
        
        return $this->faker->randomElements($allFeatures, rand(3, 8));
    }
    
    private function generateSafetyFeatures(): array
    {
        $safetyFeatures = [
            'ABS', 'ESP', 'Airbags', 'Sidoairbags', 'Ridpåairbags',
            'Kollisionsvarning', 'Autobroms', 'Dödvinkelsystem',
            'Trötthetsdetektor', 'Adaptiv farthllare', 'Fältväxingsvarning'
        ];
        
        return $this->faker->randomElements($safetyFeatures, rand(3, 7));
    }
    
    private function generateComfortFeatures(): array
    {
        $comfortFeatures = [
            'Skinnsäten', 'El-säten', 'Värmda säten', 'Värmd ratt',
            'Panoramatak', 'El-taklucka', 'Xenon/LED-strålkastare',
            'Regnsensor', 'Ljussensor', 'Dubbla klimatzoner', 'Kylda handskas'
        ];
        
        return $this->faker->randomElements($comfortFeatures, rand(2, 6));
    }
    
    private function generateTechnicalFeatures(): array
    {
        $technicalFeatures = [
            'Start/stopp-system', 'Hybrid-drivlina', 'Allhjulsdrift',
            'Sportig fjädring', 'Adaptiv fjädring', 'El-styrservo',
            'Differentialbroms', 'Backljus LED', 'Dagsljus LED'
        ];
        
        return $this->faker->randomElements($technicalFeatures, rand(2, 5));
    }
    
    private function generateCarDescription(string $make, string $model, int $year): string
    {
        $descriptions = [
            "Fin {$make} {$model} från {$year} i mycket bra skick. Välskött bil med fullständig servicehistorik.",
            "Välvårdad {$make} {$model} ({$year}) säljes. Perfekt familjebil med låg miltal och bra utrustning.",
            "Snygg och pålitlig {$make} {$model} från {$year}. Bilen är i utmärkt kondition och körklar.",
            "Till salu: {$make} {$model} {$year} med full utrustning. Väl bibehållen bil från första ägare.",
            "Exklusiv {$make} {$model} ({$year}) med toppmodern utrustning. Servicad och besiktigad."
        ];
        
        return $this->faker->randomElement($descriptions);
    }
    
    /**
     * Indicate that the car is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'featured' => true,
            'published_at' => now(),
        ]);
    }
    
    /**
     * Indicate that the car is sold.
     */
    public function sold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sold',
        ]);
    }
    
    /**
     * Indicate that the car is electric.
     */
    public function electric(): static
    {
        return $this->state(fn (array $attributes) => [
            'fuel_type' => 'electric',
            'engine_size' => null,
            'technical_features' => array_merge(
                $attributes['technical_features'] ?? [],
                ['Elbil', 'Snabbladdning', 'Regenerativ bromsning']
            ),
        ]);
    }
    
    /**
     * Indicate that the car is a luxury vehicle.
     */
    public function luxury(): static
    {
        return $this->state(fn (array $attributes) => [
            'make' => $this->faker->randomElement(['BMW', 'Mercedes-Benz', 'Audi', 'Volvo']),
            'comfort_features' => [
                'Skinnsäten', 'El-säten', 'Värmda säten', 'Värmd ratt',
                'Panoramatak', 'Premium-ljudsystem', 'Massage-säten'
            ],
            'featured' => true,
        ]);
    }
}
