<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Lead;
use App\Models\Car;
use App\Models\Deal;
use App\Models\LeadActivity;
use App\Models\NeedsAnalysis;
use Illuminate\Support\Facades\Hash;

class CarSalesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating users...');
        $this->createUsers();

        $this->command->info('Creating cars...');
        $this->createCars();

        $this->command->info('Creating leads...');
        $this->createLeads();

        $this->command->info('Creating deals and activities...');
        $this->createDealsAndActivities();

        $this->command->info('Car sales data seeded successfully!');
    }

    private function createUsers(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'alexander.fugah@shoplab.se'],
            [
                'name' => 'Alexander Fugah',
                'email' => 'alexander.fugah@shoplab.se',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create standard admin user for easy access
        User::firstOrCreate(
            ['email' => 'admin@dinbildeal.se'],
            [
                'name' => 'Admin User',
                'email' => 'admin@dinbildeal.se',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Create manager
        User::firstOrCreate(
            ['email' => 'manager@dinbildeal.se'],
            [
                'name' => 'Sales Manager',
                'password' => Hash::make('password'),
                'role' => 'manager',
                'employee_id' => 'MGR001',
                'email_verified_at' => now(),
            ]
        );

        // Create sales agents
        $agents = [
            ['name' => 'Erik Andersson', 'email' => 'erik@dinbildeal.se', 'employee_id' => 'AGT001'],
            ['name' => 'Anna Johansson', 'email' => 'anna@dinbildeal.se', 'employee_id' => 'AGT002'],
            ['name' => 'Lars Karlsson', 'email' => 'lars@dinbildeal.se', 'employee_id' => 'AGT003'],
            ['name' => 'Maria Nilsson', 'email' => 'maria@dinbildeal.se', 'employee_id' => 'AGT004'],
        ];

        $managerId = User::where('role', 'manager')->first()->id;

        foreach ($agents as $agentData) {
            User::firstOrCreate(
                ['email' => $agentData['email']],
                [
                    'name' => $agentData['name'],
                    'password' => Hash::make('password'),
                    'role' => 'agent',
                    'employee_id' => $agentData['employee_id'],
                    'manager_id' => $managerId,
                    'email_verified_at' => now(),
                ]
            );
        }

        // Create some customer users
        User::factory(20)->create([
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);
    }

    private function createCars(): void
    {
        // Create a variety of cars
        Car::factory(50)->create();

        // Create some featured cars
        Car::factory(10)->featured()->create();

        // Create some luxury cars
        Car::factory(8)->luxury()->create();

        // Create some electric cars
        Car::factory(6)->electric()->create();

        // Create some sold cars
        Car::factory(15)->sold()->create();
    }

    private function createLeads(): void
    {
        // Create various types of leads
        Lead::factory(30)->create(); // New leads
        Lead::factory(15)->qualified()->create(); // Qualified leads
        Lead::factory(10)->hot()->create(); // Hot leads
        Lead::factory(8)->converted()->create(); // Converted leads
        Lead::factory(12)->lost()->create(); // Lost leads
    }

    private function createDealsAndActivities(): void
    {
        $leads = Lead::whereIn('status', ['in_process', 'finance', 'done'])->get();
        $cars = Car::where('status', 'available')->take(30)->get();
        $agents = User::where('role', 'agent')->get();

        foreach ($leads as $lead) {
            if ($cars->isNotEmpty() && $agents->isNotEmpty()) {
                $car = $cars->random();
                $agent = $agents->random();

                // Create deal
                $deal = Deal::create([
                    'lead_id' => $lead->id,
                    'car_id' => $car->id,
                    'assigned_agent_id' => $agent->id,
                    'deal_type' => fake()->randomElement(['buy_car', 'sell_car', 'trade_in']),
                    'status' => fake()->randomElement(['new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'financing']),
                    'vehicle_price' => $car->price,
                    'commission_rate' => 0.01, // 1%
                    'expected_close_date' => fake()->dateTimeBetween('now', '+60 days'),
                ]);

                // Create some activities for this lead
                $this->createActivitiesForLead($lead, $agent, $deal);

                // Some leads might have needs analysis
                // TODO: Fix field mappings for needs analysis
                /*if (fake()->boolean(60)) {
                    NeedsAnalysis::create([
                        'lead_id' => $lead->id,
                        'customer_name' => $lead->name,
                        'customer_email' => $lead->email,
                        'customer_phone' => $lead->phone,
                        'budget_min' => $lead->budget_min,
                        'budget_max' => $lead->budget_max,
                        'preferred_makes' => fake()->randomElements(['Volvo', 'BMW', 'Audi', 'Mercedes-Benz'], rand(1, 2)),
                        'fuel_preferences' => fake()->randomElements(['petrol', 'diesel', 'electric', 'hybrid'], rand(1, 2)),
                        'transmission_preference' => fake()->randomElement(['automatic', 'manual']),
                        'min_year' => fake()->numberBetween(2015, 2020),
                        'max_mileage' => fake()->numberBetween(80000, 150000),
                        'must_have_features' => fake()->randomElements([
                            'Luftkonditionering', 'Navigationsystem', 'Backkamera', 'Värmda säten'
                        ], rand(1, 3)),
                        'vehicle_usage' => fake()->randomElements([
                            NeedsAnalysis::USAGE_CITY, NeedsAnalysis::USAGE_FAMILY, NeedsAnalysis::USAGE_HIGHWAY
                        ], rand(1, 2)),
                        'environmental_priority' => fake()->randomElement(NeedsAnalysis::getAllPriorities()),
                        'reliability_priority' => fake()->randomElement(NeedsAnalysis::getAllPriorities()),
                        'safety_priority' => fake()->randomElement(NeedsAnalysis::getAllPriorities()),
                        'purchase_timeline' => fake()->randomElement([
                            NeedsAnalysis::TIMELINE_1_MONTH,
                            NeedsAnalysis::TIMELINE_3_MONTHS,
                            NeedsAnalysis::TIMELINE_6_MONTHS
                        ]),
                        'status' => fake()->randomElement([NeedsAnalysis::STATUS_IN_PROGRESS, NeedsAnalysis::STATUS_COMPLETED]),
                        'completed_at' => fake()->boolean(70) ? fake()->dateTimeBetween('-30 days', 'now') : null,
                    ]);
                }*/
            }
        }
    }

    private function createActivitiesForLead(Lead $lead, User $agent, ?Deal $deal = null): void
    {
        $activityCount = fake()->numberBetween(1, 8);

        for ($i = 0; $i < $activityCount; $i++) {
            $activityType = fake()->randomElement([
                'call_made',
                'email_sent',
                'meeting_scheduled',
                'contacted',
                'follow_up_scheduled',
                'note_added',
            ]);

            $isCompleted = fake()->boolean(80); // 80% of activities are completed
            $activityDate = fake()->dateTimeBetween('-30 days', $isCompleted ? 'now' : '+14 days');

            LeadActivity::create([
                'lead_id' => $lead->id,
                'user_id' => $agent->id,
                'deal_id' => $deal?->id,
                'activity_type' => $activityType,
                'activity_title' => $this->generateActivitySubject($activityType),
                'description' => fake()->optional(0.8)->text(200),
                'communication_method' => $activityType === 'call_made' ? 'phone' : ($activityType === 'email_sent' ? 'email' : null),
                'completed_at' => $activityDate,
            ]);
        }
    }

    private function generateActivitySubject(string $activityType): string
    {
        $subjects = [
            LeadActivity::TYPE_CALL => [
                'Uppföljningssamtal',
                'Kontakt ang. bilförfrågan',
                'Telefonmöte om finansiering',
                'Bekräftelse av visning'
            ],
            LeadActivity::TYPE_EMAIL => [
                'Bilförslag skickat',
                'Prisinformation',
                'Finansieringsalternativ',
                'Svar på kundförfrågan'
            ],
            LeadActivity::TYPE_MEETING => [
                'Möte på showroom',
                'Hembesök för visning',
                'Kontraktsgenomgång',
                'Leveransmöte'
            ],
            LeadActivity::TYPE_VIEWING => [
                'Bilvisning',
                'Provkörning',
                'Teknisk genomgång',
                'Besiktning tillsammans'
            ],
            LeadActivity::TYPE_FOLLOW_UP => [
                'Uppföljning efter visning',
                'Status på finansiering',
                'Påminnelse om offert',
                'Kontroll efter leverans'
            ],
            LeadActivity::TYPE_NOTE => [
                'Anteckning från kundköntakt',
                'Intern notering',
                'Kundens önskemål',
                'Viktiga detaljer'
            ],
        ];

        return match($activityType) {
            'call_made' => fake()->randomElement(['Uppföljningssamtal', 'Kontakt ang. bil', 'Telefonmöte']),
            'email_sent' => fake()->randomElement(['Bilförslag skickat', 'Prisinformation', 'Svar på förfrågan']),
            'meeting_scheduled' => fake()->randomElement(['Möte på showroom', 'Visning bokad', 'Leveransmöte']),
            'contacted' => fake()->randomElement(['Kundkontakt', 'Initial kontakt', 'Uppföljning']),
            'follow_up_scheduled' => fake()->randomElement(['Uppföljning planerad', 'Påminnelse', 'Kontroll']),
            'note_added' => fake()->randomElement(['Anteckning', 'Intern notering', 'Viktiga detaljer']),
            default => 'Aktivitet'
        };
    }
}
