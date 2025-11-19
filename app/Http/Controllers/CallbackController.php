<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class CallbackController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'source' => 'nullable|string',
        ]);

        try {
            // Send email to info@dinbildeal.se
            Mail::raw(
                "Ny återuppringningsbegäran\n\n" .
                "Namn: {$validated['name']}\n" .
                "Telefon: {$validated['phone']}\n" .
                "Källa: " . ($validated['source'] ?? 'Okänd') . "\n\n" .
                "IP: {$request->ip()}\n" .
                "Tid: " . now()->format('Y-m-d H:i:s'),
                function ($message) {
                    $message->to('info@dinbildeal.se')
                        ->subject('Ny återuppringningsbegäran');
                }
            );

            return redirect()->back()
                ->with('success', 'Tack! Vi hör av oss inom kort.');
        } catch (\Exception $e) {
            Log::error('Failed to send callback request email', [
                'error' => $e->getMessage(),
                'data' => $validated,
            ]);

            return redirect()->back()
                ->with('error', 'Något gick fel. Vänligen försök igen senare.');
        }
    }
}
