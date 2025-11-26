<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserSettingsController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles');

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Role filter
        if ($request->filled('role') && $request->role !== 'all') {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('slug', $request->role);
            });
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        // Exclude customers by default - only show admin users
        $query->where(function ($q) {
            $q->where('role', '!=', User::ROLE_CUSTOMER)
              ->orWhereHas('roles', function ($subQ) {
                  $subQ->where('slug', '!=', Role::CUSTOMER);
              });
        });

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
                'roles' => $user->roles->map(fn ($role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                    'is_super_user' => $role->is_super_user,
                ]),
                'is_active' => $user->is_active ?? true,
                'is_super_user' => $user->isSuperUser(),
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'last_login_at' => $user->last_login_at,
            ];
        });

        $roles = Role::where('slug', '!=', Role::CUSTOMER)->get()->map(fn ($role) => [
            'id' => $role->id,
            'name' => $role->name,
            'slug' => $role->slug,
        ]);

        return Inertia::render('Admin/Settings/Users', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role', 'status', 'sort', 'order']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'roles' => 'required|array|min:1',
            'roles.*' => 'exists:roles,id',
            'is_active' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'role' => 'admin', // Legacy field
            'email_verified_at' => now(),
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->route('admin.settings.users')
                        ->with('success', 'Användare skapad framgångsrikt!');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'roles' => 'required|array|min:1',
            'roles.*' => 'exists:roles,id',
            'is_active' => 'boolean',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $user->syncRoles($validated['roles']);

        return redirect()->route('admin.settings.users')
                        ->with('success', 'Användare uppdaterad framgångsrikt!');
    }

    public function destroy(User $user)
    {
        // Prevent deletion of super users
        if ($user->isSuperUser()) {
            return back()->withErrors(['error' => 'Super-användare kan inte tas bort.']);
        }

        // Prevent self-deletion
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Du kan inte ta bort din egen användare.']);
        }

        $user->delete();

        return redirect()->route('admin.settings.users')
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

    public function sendPasswordReset(User $user)
    {
        $status = Password::sendResetLink(['email' => $user->email]);

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('success', 'Återställningslänk skickad till ' . $user->email);
        }

        return back()->withErrors(['error' => 'Kunde inte skicka återställningslänk.']);
    }

    public function toggleActive(User $user)
    {
        // Prevent deactivating super users
        if ($user->isSuperUser()) {
            return back()->withErrors(['error' => 'Super-användare kan inte inaktiveras.']);
        }

        // Prevent self-deactivation
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Du kan inte inaktivera din egen användare.']);
        }

        $user->update([
            'is_active' => !$user->is_active,
        ]);

        $status = $user->is_active ? 'aktiverad' : 'inaktiverad';

        return back()->with('success', "Användare {$status} framgångsrikt!");
    }
}
