<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CustomerAuthController extends Controller
{
    /**
     * Display the customer registration view.
     */
    public function showRegistrationForm(): Response
    {
        return Inertia::render('auth/CustomerRegister');
    }

    /**
     * Handle an incoming customer registration request.
     */
    public function register(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'date_of_birth' => 'nullable|date|before:today',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'preferred_contact_method' => 'nullable|in:email,phone,sms',
            'marketing_consent' => 'boolean',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => User::ROLE_CUSTOMER,
            'date_of_birth' => $request->date_of_birth,
            'address' => $request->address,
            'city' => $request->city,
            'postal_code' => $request->postal_code,
            'preferred_contact_method' => $request->preferred_contact_method ?? 'email',
            'marketing_consent' => $request->boolean('marketing_consent'),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('customer.dashboard'))
            ->with('success', 'Välkommen! Ditt konto har skapats framgångsrikt.');
    }

    /**
     * Display the customer login view.
     */
    public function showLoginForm(): Response
    {
        return Inertia::render('auth/CustomerLogin');
    }

    /**
     * Handle an incoming customer authentication request.
     */
    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');
        $credentials['role'] = User::ROLE_CUSTOMER; // Ensure only customers can login here

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended(route('customer.dashboard'))
                ->with('success', 'Välkommen tillbaka!');
        }

        return back()->withErrors([
            'email' => 'Fel e-postadress eller lösenord.',
        ])->onlyInput('email');
    }

    /**
     * Destroy an authenticated customer session.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')
            ->with('success', 'Du har loggats ut framgångsrikt.');
    }

    /**
     * Display the email verification notice.
     */
    public function showVerificationNotice(): Response
    {
        return Auth::user()->hasVerifiedEmail()
            ? redirect()->route('customer.dashboard')
            : Inertia::render('auth/CustomerVerifyEmail');
    }

    /**
     * Send a new email verification notification.
     */
    public function resendVerificationEmail(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('customer.dashboard');
        }

        $request->user()->sendEmailVerificationNotification();

        return back()->with('success', 'Verifieringsmail skickad!');
    }
}