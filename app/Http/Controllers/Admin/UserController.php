<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        if ($request->filled('verified') && $request->verified !== 'all') {
            if ($request->verified === 'yes') {
                $query->verified();
            } else {
                $query->whereNull('email_verified_at');
            }
        }

        if ($request->filled('marketing_consent') && $request->marketing_consent !== 'all') {
            $query->where('marketing_consent', $request->marketing_consent === 'yes');
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate(15)->through(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'email_verified_at' => $user->email_verified_at,
                'marketing_consent' => $user->marketing_consent,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'stats' => $user->isCustomer() ? $user->getCustomerStats() : $user->getAgentStats(),
            ];
        });

        $roles = User::getAllRoles();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'verified', 'marketing_consent', 'sort', 'order']),
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => User::getAllRoles(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'role' => ['required', Rule::in(User::getAllRoles())],
            'date_of_birth' => 'nullable|date|before:today',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'preferred_contact_method' => 'nullable|in:email,phone,sms',
            'marketing_consent' => 'boolean',
            'customer_notes' => 'nullable|string',
            'email_verified' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        if ($validated['email_verified']) {
            $validated['email_verified_at'] = now();
        }
        unset($validated['email_verified']);

        $user = User::create($validated);

        return redirect()->route('admin.users.show', $user)
                        ->with('success', 'Användare skapad framgångsrikt!');
    }

    public function show(User $user)
    {
        $stats = $user->isCustomer() ? $user->getCustomerStats() : $user->getAgentStats();
        
        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'date_of_birth' => $user->date_of_birth,
                'address' => $user->address,
                'city' => $user->city,
                'postal_code' => $user->postal_code,
                'full_address' => $user->full_address,
                'age' => $user->age,
                'preferred_contact_method' => $user->preferred_contact_method,
                'preferred_contact_method_label' => $user->getPreferredContactMethodLabel(),
                'marketing_consent' => $user->marketing_consent,
                'customer_notes' => $user->customer_notes,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'stats' => $stats,
            ]
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'date_of_birth' => $user->date_of_birth?->format('Y-m-d'),
                'address' => $user->address,
                'city' => $user->city,
                'postal_code' => $user->postal_code,
                'preferred_contact_method' => $user->preferred_contact_method,
                'marketing_consent' => $user->marketing_consent,
                'customer_notes' => $user->customer_notes,
                'email_verified_at' => $user->email_verified_at,
            ],
            'roles' => User::getAllRoles(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'role' => ['required', Rule::in(User::getAllRoles())],
            'date_of_birth' => 'nullable|date|before:today',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'preferred_contact_method' => 'nullable|in:email,phone,sms',
            'marketing_consent' => 'boolean',
            'customer_notes' => 'nullable|string',
            'email_verified' => 'boolean',
        ]);

        if ($validated['email_verified'] && !$user->email_verified_at) {
            $validated['email_verified_at'] = now();
        } elseif (!$validated['email_verified']) {
            $validated['email_verified_at'] = null;
        }
        unset($validated['email_verified']);

        $user->update($validated);

        return redirect()->route('admin.users.show', $user)
                        ->with('success', 'Användare uppdaterad framgångsrikt!');
    }

    public function destroy(User $user)
    {
        // Prevent deletion of the current user
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Du kan inte ta bort din egen användare.']);
        }

        $user->delete();

        return redirect()->route('admin.users.index')
                        ->with('success', 'Användare borttagen framgångsrikt!');
    }

    public function resetPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Lösenord återställt framgångsrikt!');
    }

    public function toggleVerification(User $user)
    {
        $user->update([
            'email_verified_at' => $user->email_verified_at ? null : now()
        ]);

        $status = $user->email_verified_at ? 'verifierad' : 'overifierad';
        
        return back()->with('success', "Användare markerad som {$status}!");
    }
}