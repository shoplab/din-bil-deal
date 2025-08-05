<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Lead;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lead>
 */
class LeadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $sources = ['needs_analysis', 'car_deal_request', 'sell_car', 'website_contact'];
        $budgetRanges = [
            [50000, 150000],
            [100000, 250000], 
            [200000, 400000],
            [300000, 600000],
            [500000, 1000000],
            [800000, 1500000]
        ];
        
        $budgetRange = $this->faker->randomElement($budgetRanges);
        $swedishFirstNames = ['Erik', 'Anna', 'Lars', 'Maria', 'Johan', 'Emma', 'Anders', 'Maja', 'Nils', 'Sara', 'Olof', 'Astrid', 'Gustav', 'Ingrid', 'Magnus', 'Helena'];
        $swedishLastNames = ['Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson', 'Pettersson', 'Jonsson', 'Jansson', 'Hansson', 'Bengtsson', 'Jönsson'];
        
        return [
            'name' => $this->faker->randomElement($swedishFirstNames) . ' ' . $this->faker->randomElement($swedishLastNames),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->generateSwedishPhone(),
            'source' => $this->faker->randomElement($sources),
            'type' => $this->faker->randomElement(['buy_car', 'sell_car', 'needs_analysis']),
            'status' => $this->faker->randomElement(['open', 'in_process', 'waiting', 'finance', 'done', 'cancelled']),
            'assigned_agent_id' => $this->faker->optional(0.7)->randomElement(User::where('role', 'agent')->pluck('id')->toArray()),
            'budget_min' => $budgetRange[0],
            'budget_max' => $budgetRange[1],
            'lead_score' => $this->faker->numberBetween(0, 100),
            'preferences' => [
                'preferred_makes' => $this->faker->randomElements(['Volvo', 'BMW', 'Audi', 'Mercedes-Benz', 'Toyota', 'Volkswagen'], rand(1, 3)),
                'fuel_type' => $this->faker->randomElement(['petrol', 'diesel', 'electric', 'hybrid']),
                'transmission' => $this->faker->randomElement(['automatic', 'manual']),
                'max_age' => $this->faker->numberBetween(3, 15),
                'min_year' => now()->year - $this->faker->numberBetween(3, 15)
            ],
            'description' => $this->generateSwedishMessage(),
            'first_contact_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'last_activity_at' => $this->faker->optional(0.8)->dateTimeBetween('-7 days', 'now'),
            'created_at' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ];
    }
    
    private function generateSwedishPhone(): string
    {
        // Swedish mobile numbers start with 07
        $areaCode = '07';
        $number = $this->faker->numerify('########');
        return $areaCode . $number;
    }
    
    private function generateSwedishMessage(): string
    {
        $messages = [
            'Hej, jag är intresserad av att köpa en bil och undrar om ni kan hjälpa mig hitta något passande.',
            'Hej! Jag letar efter en familjebil och har hört att ni har bra utbud. Kan vi boka ett möte?',
            'God dag, jag vill sälja min nuvarande bil och köpa något nyare. Vad har ni för inbytesmöjligheter?',
            'Hej, jag såg er annons och undrar om ni har några elbilar i lager. Tack!',
            'Hej! Min partner och jag letar efter en större bil till familjen. Kan ni ringa mig?',
            'God dag, jag är intresserad av en begagnad Volvo. Vilka modeller har ni tillgängliga?',
            'Hej, jag behöver en billigare bil och undrar vad ni har under 150 000 kr.',
            'Hallo! Jag vill ha en dieselbil för långa resor. Vad kan ni erbjuda?'
        ];
        
        return $this->faker->randomElement($messages);
    }
    
    /**
     * Indicate that the lead is qualified.
     */
    public function qualified(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_process',
            'lead_score' => $this->faker->numberBetween(60, 100),
            'assigned_agent_id' => User::where('role', 'agent')->inRandomOrder()->first()?->id,
        ]);
    }
    
    /**
     * Indicate that the lead is hot.
     */
    public function hot(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'finance',
            'lead_score' => $this->faker->numberBetween(80, 100),
            'assigned_agent_id' => User::where('role', 'agent')->inRandomOrder()->first()?->id,
            'description' => 'Hot lead - high priority follow-up needed',
        ]);
    }
    
    /**
     * Indicate that the lead is converted.
     */
    public function converted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'done',
            'lead_score' => 100,
            'assigned_agent_id' => User::where('role', 'agent')->inRandomOrder()->first()?->id,
        ]);
    }
    
    /**
     * Indicate that the lead is lost.
     */
    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'lead_score' => $this->faker->numberBetween(0, 40),
            'description' => $this->faker->randomElement([
                'Pris för högt',
                'Hittade bil någon annanstans', 
                'Inte redo att köpa än',
                'Kunde inte få finansiering',
                'Bil motsvarade inte förväntningar'
            ]),
        ]);
    }
}
