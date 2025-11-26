<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Permissions
        $permissions = [
            // Dashboard
            ['name' => 'Visa dashboard', 'slug' => 'dashboard.view', 'group' => 'dashboard', 'description' => 'Visa admin dashboard'],

            // Cars
            ['name' => 'Visa bilar', 'slug' => 'cars.view', 'group' => 'cars', 'description' => 'Visa bilar i systemet'],
            ['name' => 'Skapa bilar', 'slug' => 'cars.create', 'group' => 'cars', 'description' => 'Skapa nya bilar'],
            ['name' => 'Redigera bilar', 'slug' => 'cars.edit', 'group' => 'cars', 'description' => 'Redigera befintliga bilar'],
            ['name' => 'Ta bort bilar', 'slug' => 'cars.delete', 'group' => 'cars', 'description' => 'Ta bort bilar från systemet'],
            ['name' => 'Publicera bilar', 'slug' => 'cars.publish', 'group' => 'cars', 'description' => 'Publicera och avpublicera bilar'],

            // Leads
            ['name' => 'Visa leads', 'slug' => 'leads.view', 'group' => 'leads', 'description' => 'Visa leads i systemet'],
            ['name' => 'Skapa leads', 'slug' => 'leads.create', 'group' => 'leads', 'description' => 'Skapa nya leads'],
            ['name' => 'Redigera leads', 'slug' => 'leads.edit', 'group' => 'leads', 'description' => 'Redigera befintliga leads'],
            ['name' => 'Ta bort leads', 'slug' => 'leads.delete', 'group' => 'leads', 'description' => 'Ta bort leads från systemet'],
            ['name' => 'Tilldela leads', 'slug' => 'leads.assign', 'group' => 'leads', 'description' => 'Tilldela leads till agenter'],

            // Deals
            ['name' => 'Visa affärer', 'slug' => 'deals.view', 'group' => 'deals', 'description' => 'Visa affärer i systemet'],
            ['name' => 'Skapa affärer', 'slug' => 'deals.create', 'group' => 'deals', 'description' => 'Skapa nya affärer'],
            ['name' => 'Redigera affärer', 'slug' => 'deals.edit', 'group' => 'deals', 'description' => 'Redigera befintliga affärer'],
            ['name' => 'Ta bort affärer', 'slug' => 'deals.delete', 'group' => 'deals', 'description' => 'Ta bort affärer från systemet'],
            ['name' => 'Stänga affärer', 'slug' => 'deals.close', 'group' => 'deals', 'description' => 'Stänga affärer (won/lost)'],

            // Users (Customers)
            ['name' => 'Visa användare', 'slug' => 'users.view', 'group' => 'users', 'description' => 'Visa användare och kunder'],
            ['name' => 'Skapa användare', 'slug' => 'users.create', 'group' => 'users', 'description' => 'Skapa nya användare'],
            ['name' => 'Redigera användare', 'slug' => 'users.edit', 'group' => 'users', 'description' => 'Redigera befintliga användare'],
            ['name' => 'Ta bort användare', 'slug' => 'users.delete', 'group' => 'users', 'description' => 'Ta bort användare från systemet'],

            // Analytics
            ['name' => 'Visa statistik', 'slug' => 'analytics.view', 'group' => 'analytics', 'description' => 'Visa statistik och rapporter'],
            ['name' => 'Exportera statistik', 'slug' => 'analytics.export', 'group' => 'analytics', 'description' => 'Exportera statistik och rapporter'],

            // Forms
            ['name' => 'Visa formulär', 'slug' => 'forms.view', 'group' => 'forms', 'description' => 'Visa formulär'],
            ['name' => 'Skapa formulär', 'slug' => 'forms.create', 'group' => 'forms', 'description' => 'Skapa nya formulär'],
            ['name' => 'Redigera formulär', 'slug' => 'forms.edit', 'group' => 'forms', 'description' => 'Redigera befintliga formulär'],
            ['name' => 'Ta bort formulär', 'slug' => 'forms.delete', 'group' => 'forms', 'description' => 'Ta bort formulär'],

            // Settings
            ['name' => 'Visa inställningar', 'slug' => 'settings.view', 'group' => 'settings', 'description' => 'Visa systeminställningar'],
            ['name' => 'Redigera inställningar', 'slug' => 'settings.edit', 'group' => 'settings', 'description' => 'Ändra systeminställningar'],

            // Roles & Permissions
            ['name' => 'Hantera roller', 'slug' => 'roles.manage', 'group' => 'settings', 'description' => 'Hantera roller och behörigheter'],
            ['name' => 'Hantera e-postmallar', 'slug' => 'templates.manage', 'group' => 'settings', 'description' => 'Hantera e-postmallar'],
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        // Create Roles
        $roles = [
            [
                'name' => 'Super Användare',
                'slug' => Role::SUPER_USER,
                'description' => 'Full tillgång till alla funktioner i systemet',
                'is_system' => true,
                'is_super_user' => true,
            ],
            [
                'name' => 'Administratör',
                'slug' => Role::ADMIN,
                'description' => 'Administratör med bred tillgång',
                'is_system' => true,
                'is_super_user' => false,
            ],
            [
                'name' => 'Manager',
                'slug' => Role::MANAGER,
                'description' => 'Chef med tillgång till rapporter och teamhantering',
                'is_system' => true,
                'is_super_user' => false,
            ],
            [
                'name' => 'Säljare',
                'slug' => Role::AGENT,
                'description' => 'Säljare med tillgång till leads och affärer',
                'is_system' => true,
                'is_super_user' => false,
            ],
            [
                'name' => 'Kund',
                'slug' => Role::CUSTOMER,
                'description' => 'Kund med begränsad tillgång',
                'is_system' => true,
                'is_super_user' => false,
            ],
        ];

        foreach ($roles as $roleData) {
            Role::updateOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );
        }

        // Assign permissions to roles
        $this->assignPermissionsToRoles();
    }

    /**
     * Assign default permissions to roles.
     */
    private function assignPermissionsToRoles(): void
    {
        // Admin role gets all permissions except super user only ones
        $adminRole = Role::where('slug', Role::ADMIN)->first();
        $allPermissions = Permission::all()->pluck('id')->toArray();
        $adminRole?->syncPermissions($allPermissions);

        // Manager permissions
        $managerRole = Role::where('slug', Role::MANAGER)->first();
        $managerPermissions = Permission::whereIn('slug', [
            'dashboard.view',
            'cars.view', 'cars.create', 'cars.edit', 'cars.publish',
            'leads.view', 'leads.create', 'leads.edit', 'leads.assign',
            'deals.view', 'deals.create', 'deals.edit', 'deals.close',
            'users.view',
            'analytics.view', 'analytics.export',
            'forms.view',
        ])->pluck('id')->toArray();
        $managerRole?->syncPermissions($managerPermissions);

        // Agent permissions
        $agentRole = Role::where('slug', Role::AGENT)->first();
        $agentPermissions = Permission::whereIn('slug', [
            'dashboard.view',
            'cars.view',
            'leads.view', 'leads.create', 'leads.edit',
            'deals.view', 'deals.create', 'deals.edit',
            'users.view',
            'forms.view',
        ])->pluck('id')->toArray();
        $agentRole?->syncPermissions($agentPermissions);

        // Customer role - no admin permissions
    }
}
