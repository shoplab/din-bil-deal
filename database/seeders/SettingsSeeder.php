<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General settings
            [
                'key' => 'site_name',
                'value' => 'Din Bil Deal',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Webbplatsens namn',
                'is_public' => true,
            ],
            [
                'key' => 'timezone',
                'value' => 'Europe/Stockholm',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Systemets tidszon',
                'is_public' => true,
            ],
            [
                'key' => 'date_format',
                'value' => 'Y-m-d',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Datumformat',
                'is_public' => true,
            ],
            [
                'key' => 'time_format',
                'value' => 'H:i',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Tidsformat',
                'is_public' => true,
            ],
            [
                'key' => 'currency',
                'value' => 'SEK',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Valuta',
                'is_public' => true,
            ],
            [
                'key' => 'locale',
                'value' => 'sv_SE',
                'type' => 'string',
                'group' => 'general',
                'description' => 'Språkinställning',
                'is_public' => true,
            ],

            // Email settings
            [
                'key' => 'email_from_name',
                'value' => 'Din Bil Deal',
                'type' => 'string',
                'group' => 'email',
                'description' => 'Avsändarnamn för e-post',
                'is_public' => false,
            ],
            [
                'key' => 'email_from_address',
                'value' => 'noreply@dinbildeal.se',
                'type' => 'string',
                'group' => 'email',
                'description' => 'Avsändaradress för e-post',
                'is_public' => false,
            ],

            // Notification settings
            [
                'key' => 'notify_new_lead',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'Skicka notifiering vid ny lead',
                'is_public' => false,
            ],
            [
                'key' => 'notify_new_deal',
                'value' => 'true',
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'Skicka notifiering vid ny affär',
                'is_public' => false,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
