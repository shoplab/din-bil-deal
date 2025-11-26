<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('users', 'permissions')->get()->map(fn ($role) => [
            'id' => $role->id,
            'name' => $role->name,
            'slug' => $role->slug,
            'description' => $role->description,
            'is_system' => $role->is_system,
            'is_super_user' => $role->is_super_user,
            'users_count' => $role->users_count,
            'permissions_count' => $role->permissions_count,
            'created_at' => $role->created_at,
        ]);

        return Inertia::render('Admin/Settings/Roles', [
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        $permissions = Permission::all()->groupBy('group')->map(function ($group) {
            return $group->map(fn ($permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'slug' => $permission->slug,
                'description' => $permission->description,
            ]);
        });

        return Inertia::render('Admin/Settings/Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:roles',
            'description' => 'nullable|string|max:500',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?? Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_system' => false,
            'is_super_user' => false,
        ]);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->route('admin.settings.roles')
                        ->with('success', 'Roll skapad framgångsrikt!');
    }

    public function edit(Role $role)
    {
        $permissions = Permission::all()->groupBy('group')->map(function ($group) {
            return $group->map(fn ($permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'slug' => $permission->slug,
                'description' => $permission->description,
            ]);
        });

        $rolePermissions = $role->permissions->pluck('id')->toArray();

        return Inertia::render('Admin/Settings/Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'description' => $role->description,
                'is_system' => $role->is_system,
                'is_super_user' => $role->is_super_user,
                'permissions' => $rolePermissions,
            ],
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'description' => 'nullable|string|max:500',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        // System roles can only have their permissions modified, not name/slug
        if ($role->is_system) {
            $role->update([
                'description' => $validated['description'] ?? $role->description,
            ]);
        } else {
            $role->update([
                'name' => $validated['name'],
                'slug' => $validated['slug'] ?? Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
            ]);
        }

        // Super user role cannot have permissions modified (they have all permissions)
        if (!$role->is_super_user) {
            $role->syncPermissions($validated['permissions'] ?? []);
        }

        return redirect()->route('admin.settings.roles')
                        ->with('success', 'Roll uppdaterad framgångsrikt!');
    }

    public function destroy(Role $role)
    {
        if ($role->is_system) {
            return back()->withErrors(['error' => 'Systemroller kan inte tas bort.']);
        }

        if ($role->users()->count() > 0) {
            return back()->withErrors(['error' => 'Rollen har användare kopplade och kan inte tas bort.']);
        }

        $role->delete();

        return redirect()->route('admin.settings.roles')
                        ->with('success', 'Roll borttagen framgångsrikt!');
    }
}
