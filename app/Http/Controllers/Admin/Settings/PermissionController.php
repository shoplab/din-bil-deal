<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    public function index()
    {
        $permissions = Permission::all()->groupBy('group')->map(function ($group, $groupName) {
            return [
                'name' => $this->getGroupLabel($groupName),
                'slug' => $groupName,
                'permissions' => $group->map(fn ($permission) => [
                    'id' => $permission->id,
                    'name' => $permission->name,
                    'slug' => $permission->slug,
                    'description' => $permission->description,
                ]),
            ];
        })->values();

        $roles = Role::with('permissions')->get()->map(fn ($role) => [
            'id' => $role->id,
            'name' => $role->name,
            'slug' => $role->slug,
            'is_super_user' => $role->is_super_user,
            'permissions' => $role->permissions->pluck('id')->toArray(),
        ]);

        return Inertia::render('Admin/Settings/Permissions', [
            'permissionGroups' => $permissions,
            'roles' => $roles,
        ]);
    }

    public function updateRolePermissions(Request $request, Role $role)
    {
        // Super user role cannot have permissions modified
        if ($role->is_super_user) {
            return back()->withErrors(['error' => 'Super-användarens behörigheter kan inte ändras.']);
        }

        $validated = $request->validate([
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        return back()->with('success', 'Behörigheter uppdaterade för ' . $role->name);
    }

    private function getGroupLabel(string $group): string
    {
        return match ($group) {
            'dashboard' => 'Dashboard',
            'cars' => 'Bilar',
            'leads' => 'Leads',
            'deals' => 'Affärer',
            'users' => 'Användare',
            'analytics' => 'Statistik',
            'forms' => 'Formulär',
            'settings' => 'Inställningar',
            default => ucfirst($group),
        };
    }
}
