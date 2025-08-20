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

    // User role constants
    public const ROLE_ADMIN = 'admin';
    public const ROLE_CUSTOMER = 'customer';

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
        ];
    }

    // Relationships

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
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    /**
     * Check if user is a customer
     */
    public function isCustomer(): bool
    {
        return $this->role === self::ROLE_CUSTOMER;
    }

    /**
     * Get all available roles
     */
    public static function getAllRoles(): array
    {
        return [
            self::ROLE_ADMIN,
            self::ROLE_CUSTOMER,
        ];
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
