<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GeneralSettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::where('group', 'general')->get()->mapWithKeys(fn ($setting) => [
            $setting->key => [
                'value' => Setting::get($setting->key),
                'type' => $setting->type,
                'description' => $setting->description,
            ],
        ]);

        $timezones = $this->getTimezones();

        return Inertia::render('Admin/Settings/General', [
            'settings' => $settings,
            'timezones' => $timezones,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'timezone' => 'required|string|timezone',
            'date_format' => 'required|string|max:50',
            'time_format' => 'required|string|max:50',
            'currency' => 'required|string|max:10',
            'locale' => 'required|string|max:10',
        ]);

        foreach ($validated as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'Inställningar sparade framgångsrikt!');
    }

    private function getTimezones(): array
    {
        $timezones = [];
        $regions = [
            'Europe' => \DateTimeZone::EUROPE,
            'America' => \DateTimeZone::AMERICA,
            'Asia' => \DateTimeZone::ASIA,
            'Africa' => \DateTimeZone::AFRICA,
            'Pacific' => \DateTimeZone::PACIFIC,
            'Australia' => \DateTimeZone::AUSTRALIA,
        ];

        foreach ($regions as $region => $mask) {
            $tzList = \DateTimeZone::listIdentifiers($mask);
            foreach ($tzList as $tz) {
                $timezones[$region][] = $tz;
            }
        }

        return $timezones;
    }
}
