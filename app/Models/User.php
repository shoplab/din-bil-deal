<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    // Legacy role constants (kept for backwards compatibility with role column)
    public const ROLE_ADMIN = 'admin';
    public const ROLE_CUSTOMER = 'customer';
    public const ROLE_SUPER_USER = 'super_user';
    public const ROLE_MANAGER = 'manager';
    public const ROLE_AGENT = 'agent';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'is_active',
        'date_of_birth',
        'address',
        'city',
        'postal_code',
        'preferred_contact_method',
        'marketing_consent',
        'customer_notes',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
            'marketing_consent' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    // Relationships

    /**
     * Get the roles for the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    /**
     * Get the leads for the user (when user is a customer)
     */
    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'customer_id');
    }

    /**
     * Get the cars created by this user (when user is admin/agent)
     */
    public function createdCars(): HasMany
    {
        return $this->hasMany(Car::class, 'created_by');
    }

    /**
     * Get the deals assigned to this user (when user is agent)
     */
    public function assignedDeals(): HasMany
    {
        return $this->hasMany(Deal::class, 'assigned_agent_id');
    }

    /**
     * Get the cars saved by this customer
     */
    public function savedCars(): BelongsToMany
    {
        return $this->belongsToMany(Car::class, 'customer_saved_cars')
                    ->withTimestamps();
    }

    /**
     * Get appointments for this customer
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'customer_id');
    }

    /**
     * Get conversations where this user is the customer
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'customer_id');
    }

    /**
     * Get conversations assigned to this agent
     */
    public function assignedConversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'assigned_agent_id');
    }

    /**
     * Get messages sent by this user
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    // Role-based methods

    /**
     * Check if user is an admin (has admin role or legacy role column)
     */
    public function isAdmin(): bool
    {
        // Check new role system first
        if ($this->roles()->whereIn('slug', [Role::ADMIN, Role::SUPER_USER, Role::MANAGER])->exists()) {
            return true;
        }
        // Fall back to legacy role column
        return in_array($this->role, [self::ROLE_ADMIN, self::ROLE_SUPER_USER, self::ROLE_MANAGER]);
    }

    /**
     * Check if user is a customer
     */
    public function isCustomer(): bool
    {
        // Check new role system first
        if ($this->roles()->exists()) {
            return $this->roles()->where('slug', Role::CUSTOMER)->exists();
        }
        // Fall back to legacy role column
        return $this->role === self::ROLE_CUSTOMER;
    }

    /**
     * Check if user is a super user.
     */
    public function isSuperUser(): bool
    {
        return $this->roles()->where('is_super_user', true)->exists();
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $roleSlug): bool
    {
        return $this->roles()->where('slug', $roleSlug)->exists();
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasAnyRole(array $roleSlugs): bool
    {
        return $this->roles()->whereIn('slug', $roleSlugs)->exists();
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permissionSlug): bool
    {
        // Super users have all permissions
        if ($this->isSuperUser()) {
            return true;
        }

        foreach ($this->roles as $role) {
            if ($role->hasPermission($permissionSlug)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if user has any of the given permissions.
     */
    public function hasAnyPermission(array $permissionSlugs): bool
    {
        if ($this->isSuperUser()) {
            return true;
        }

        foreach ($this->roles as $role) {
            if ($role->hasAnyPermission($permissionSlugs)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Assign a role to the user.
     */
    public function assignRole(Role|string $role): void
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }
        $this->roles()->syncWithoutDetaching([$role->id]);
    }

    /**
     * Remove a role from the user.
     */
    public function removeRole(Role|string $role): void
    {
        if (is_string($role)) {
            $role = Role::where('slug', $role)->firstOrFail();
        }
        $this->roles()->detach($role->id);
    }

    /**
     * Sync roles for the user.
     */
    public function syncRoles(array $roleIds): void
    {
        $this->roles()->sync($roleIds);
    }

    /**
     * Check if user can be deleted.
     * Super users cannot be deleted.
     */
    public function canBeDeleted(): bool
    {
        return !$this->isSuperUser();
    }

    /**
     * Get all available roles (legacy - from constants)
     */
    public static function getAllRoles(): array
    {
        return [
            self::ROLE_SUPER_USER,
            self::ROLE_ADMIN,
            self::ROLE_MANAGER,
            self::ROLE_AGENT,
            self::ROLE_CUSTOMER,
        ];
    }

    /**
     * Get all available role models
     */
    public static function getAvailableRoles(): \Illuminate\Database\Eloquent\Collection
    {
        return Role::all();
    }

    // Customer-specific methods

    /**
     * Get customer's full address
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->postal_code . ' ' . $this->city
        ]);
        
        return implode(', ', $parts);
    }

    /**
     * Get customer's age
     */
    public function getAgeAttribute(): ?int
    {
        if (!$this->date_of_birth) {
            return null;
        }

        return $this->date_of_birth->diffInYears(now());
    }

    /**
     * Check if customer has saved a specific car
     */
    public function hasSavedCar(int $carId): bool
    {
        return $this->savedCars()->where('car_id', $carId)->exists();
    }

    /**
     * Save a car to customer's favorites
     */
    public function saveCar(int $carId): bool
    {
        if ($this->hasSavedCar($carId)) {
            return false;
        }

        $this->savedCars()->attach($carId);
        return true;
    }

    /**
     * Remove a car from customer's favorites
     */
    public function unsaveCar(int $carId): bool
    {
        if (!$this->hasSavedCar($carId)) {
            return false;
        }

        $this->savedCars()->detach($carId);
        return true;
    }

    /**
     * Get customer statistics
     */
    public function getCustomerStats(): array
    {
        if (!$this->isCustomer()) {
            return [];
        }

        return [
            'saved_cars_count' => $this->savedCars()->count(),
            'leads_count' => $this->leads()->count(),
            'appointments_count' => $this->appointments()->count(),
            'active_leads_count' => $this->leads()->whereNotIn('status', ['done', 'cancelled'])->count(),
            'converted_leads_count' => $this->leads()->where('status', 'done')->count(),
        ];
    }

    /**
     * Get preferred contact method label
     */
    public function getPreferredContactMethodLabel(): string
    {
        return match($this->preferred_contact_method) {
            'email' => 'E-post',
            'phone' => 'Telefon',
            'sms' => 'SMS',
            default => 'E-post',
        };
    }

    // Admin/Agent specific methods

    /**
     * Get agent statistics (for admin users)
     */
    public function getAgentStats(): array
    {
        if (!$this->isAdmin()) {
            return [];
        }

        return [
            'cars_created' => $this->createdCars()->count(),
            'published_cars' => $this->createdCars()->published()->count(),
            'deals_assigned' => $this->assignedDeals()->count(),
            'deals_won' => $this->assignedDeals()->won()->count(),
            'deals_active' => $this->assignedDeals()->open()->count(),
            'total_commission' => $this->assignedDeals()->won()->sum('commission_rate'),
        ];
    }

    // Scopes

    /**
     * Scope to get only customers
     */
    public function scopeCustomers($query)
    {
        return $query->where('role', self::ROLE_CUSTOMER);
    }

    /**
     * Scope to get only admins
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }

    /**
     * Scope to get verified customers
     */
    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Scope to get customers with marketing consent
     */
    public function scopeMarketingConsent($query)
    {
        return $query->where('marketing_consent', true);
    }
}
