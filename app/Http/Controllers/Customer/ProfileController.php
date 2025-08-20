<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the profile edit form
     */
    public function edit(): Response
    {
        $user = Auth::user();
        
        return Inertia::render('Customer/Profile/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'date_of_birth' => $user->date_of_birth?->format('Y-m-d'),
                'address' => $user->address,
                'city' => $user->city,
                'postal_code' => $user->postal_code,
                'preferred_contact_method' => $user->preferred_contact_method,
                'marketing_consent' => $user->marketing_consent,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'full_address' => $user->full_address,
                'age' => $user->age,
            ],
        ]);
    }

    /**
     * Update the profile information
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'preferred_contact_method' => 'required|in:email,phone,sms',
            'marketing_consent' => 'boolean',
        ], [
            'name.required' => 'Namn är obligatoriskt.',
            'name.max' => 'Namnet får inte vara längre än 255 tecken.',
            'email.required' => 'E-postadress är obligatorisk.',
            'email.email' => 'E-postadressen måste vara giltig.',
            'email.unique' => 'Denna e-postadress används redan.',
            'phone.max' => 'Telefonnummer får inte vara längre än 20 tecken.',
            'date_of_birth.date' => 'Födelsedatum måste vara ett giltigt datum.',
            'date_of_birth.before' => 'Födelsedatum måste vara före idag.',
            'address.max' => 'Adressen får inte vara längre än 255 tecken.',
            'city.max' => 'Staden får inte vara längre än 100 tecken.',
            'postal_code.max' => 'Postnummer får inte vara längre än 10 tecken.',
            'preferred_contact_method.required' => 'Kontaktmetod är obligatorisk.',
            'preferred_contact_method.in' => 'Ogiltig kontaktmetod.',
        ]);

        // Check if email changed and reset verification if needed
        $emailChanged = $user->email !== $validated['email'];
        if ($emailChanged) {
            $validated['email_verified_at'] = null;
        }

        $user->update($validated);

        return back()->with('success', 'Din profil har uppdaterats!');
    }

    /**
     * Update the user's password
     */
    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::defaults()],
        ], [
            'current_password.required' => 'Nuvarande lösenord är obligatoriskt.',
            'current_password.current_password' => 'Det nuvarande lösenordet är fel.',
            'password.required' => 'Nytt lösenord är obligatoriskt.',
            'password.confirmed' => 'Lösenordsbekräftelsen stämmer inte.',
            'password.min' => 'Lösenordet måste vara minst 8 tecken.',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Ditt lösenord har uppdaterats!');
    }

    /**
     * Send email verification notification
     */
    public function sendVerification(Request $request)
    {
        $user = Auth::user();

        if ($user->hasVerifiedEmail()) {
            return back()->with('info', 'Din e-postadress är redan verifierad.');
        }

        $user->sendEmailVerificationNotification();

        return back()->with('success', 'Verifieringslänk skickad! Kontrollera din e-post.');
    }

    /**
     * Delete the user's account
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => 'required|current_password',
        ], [
            'password.required' => 'Lösenord är obligatoriskt för att radera kontot.',
            'password.current_password' => 'Lösenordet är fel.',
        ]);

        $user = Auth::user();

        // Log out the user
        Auth::logout();

        // Delete the user account
        $user->delete();

        // Invalidate the session
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Ditt konto har raderats.');
    }

    /**
     * Show account deletion confirmation
     */
    public function showDelete(): Response
    {
        return Inertia::render('Customer/Profile/Delete');
    }

    /**
     * Download user's personal data (GDPR compliance)
     */
    public function downloadData()
    {
        $user = Auth::user();
        
        // Collect all user data
        $userData = [
            'personal_information' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'date_of_birth' => $user->date_of_birth,
                'address' => $user->address,
                'city' => $user->city,
                'postal_code' => $user->postal_code,
                'preferred_contact_method' => $user->preferred_contact_method,
                'marketing_consent' => $user->marketing_consent,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'email_verified_at' => $user->email_verified_at,
            ],
            'saved_cars' => $user->savedCars()->with('car')->get()->map(function ($savedCar) {
                return [
                    'car' => [
                        'make' => $savedCar->make,
                        'model' => $savedCar->model,
                        'year' => $savedCar->year,
                        'price' => $savedCar->price,
                    ],
                    'saved_at' => $savedCar->pivot->created_at,
                ];
            }),
            'appointments' => $user->appointments()->with('car')->get()->map(function ($appointment) {
                return [
                    'type' => $appointment->type,
                    'appointment_date' => $appointment->appointment_date,
                    'status' => $appointment->status,
                    'car' => $appointment->car ? [
                        'make' => $appointment->car->make,
                        'model' => $appointment->car->model,
                        'year' => $appointment->car->year,
                    ] : null,
                    'created_at' => $appointment->created_at,
                ];
            }),
            'conversations' => $user->conversations()->with(['car', 'messages'])->get()->map(function ($conversation) {
                return [
                    'subject' => $conversation->subject,
                    'type' => $conversation->type,
                    'status' => $conversation->status,
                    'priority' => $conversation->priority,
                    'car' => $conversation->car ? [
                        'make' => $conversation->car->make,
                        'model' => $conversation->car->model,
                        'year' => $conversation->car->year,
                    ] : null,
                    'messages' => $conversation->messages->map(function ($message) {
                        return [
                            'message' => $message->message,
                            'is_from_customer' => $message->isFromCustomer(),
                            'created_at' => $message->created_at,
                        ];
                    }),
                    'created_at' => $conversation->created_at,
                ];
            }),
            'leads' => $user->leads()->with('car')->get()->map(function ($lead) {
                return [
                    'source' => $lead->source,
                    'status' => $lead->status,
                    'interest_level' => $lead->interest_level,
                    'car' => $lead->car ? [
                        'make' => $lead->car->make,
                        'model' => $lead->car->model,
                        'year' => $lead->car->year,
                    ] : null,
                    'created_at' => $lead->created_at,
                ];
            }),
        ];

        $fileName = 'personal_data_' . $user->id . '_' . now()->format('Y-m-d') . '.json';
        $jsonData = json_encode($userData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        return response($jsonData, 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }
}