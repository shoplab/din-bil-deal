<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    // System role slugs
    public const SUPER_USER = 'super_user';
    public const ADMIN = 'admin';
    public const MANAGER = 'manager';
    public const AGENT = 'agent';
    public const CUSTOMER = 'customer';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_system',
        'is_super_user',
    ];

    protected $casts = [
        'is_system' => 'boolean',
        'is_super_user' => 'boolean',
    ];

    /**
     * Get the users that have this role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    /**
     * Get the permissions for this role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class)->withTimestamps();
    }

    /**
     * Check if role has a specific permission.
     */
    public function hasPermission(string $permissionSlug): bool
    {
        // Super user has all permissions
        if ($this->is_super_user) {
            return true;
        }

        return $this->permissions()->where('slug', $permissionSlug)->exists();
    }

    /**
     * Check if role has any of the given permissions.
     */
    public function hasAnyPermission(array $permissionSlugs): bool
    {
        if ($this->is_super_user) {
            return true;
        }

        return $this->permissions()->whereIn('slug', $permissionSlugs)->exists();
    }

    /**
     * Check if role has all of the given permissions.
     */
    public function hasAllPermissions(array $permissionSlugs): bool
    {
        if ($this->is_super_user) {
            return true;
        }

        return $this->permissions()->whereIn('slug', $permissionSlugs)->count() === count($permissionSlugs);
    }

    /**
     * Assign permissions to role.
     */
    public function givePermissions(array $permissionIds): void
    {
        $this->permissions()->syncWithoutDetaching($permissionIds);
    }

    /**
     * Remove permissions from role.
     */
    public function revokePermissions(array $permissionIds): void
    {
        $this->permissions()->detach($permissionIds);
    }

    /**
     * Sync permissions for role.
     */
    public function syncPermissions(array $permissionIds): void
    {
        $this->permissions()->sync($permissionIds);
    }

    // Scopes

    /**
     * Scope to get system roles.
     */
    public function scopeSystem($query)
    {
        return $query->where('is_system', true);
    }

    /**
     * Scope to get non-system roles.
     */
    public function scopeCustom($query)
    {
        return $query->where('is_system', false);
    }

    /**
     * Scope to get super user role.
     */
    public function scopeSuperUser($query)
    {
        return $query->where('is_super_user', true);
    }

    /**
     * Check if this role can be deleted.
     */
    public function canBeDeleted(): bool
    {
        return !$this->is_system;
    }

    /**
     * Get all available system roles.
     */
    public static function getSystemRoles(): array
    {
        return [
            self::SUPER_USER,
            self::ADMIN,
            self::MANAGER,
            self::AGENT,
            self::CUSTOMER,
        ];
    }
}
