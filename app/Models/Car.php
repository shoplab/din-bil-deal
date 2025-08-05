<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Car extends Model
{
    use HasFactory;
    protected $fillable = [
        'make', 'model', 'variant', 'year', 'registration_number', 'vin',
        'price', 'original_price', 'market_value', 'price_negotiable',
        'mileage', 'fuel_type', 'transmission', 'engine_size', 'power_hp', 'drivetrain',
        'color', 'doors', 'seats', 'condition', 'status', 'condition_notes', 'defects',
        'features', 'safety_features', 'comfort_features', 'technical_features',
        'inspection_date', 'inspection_passed', 'previous_owners', 'accident_history',
        'service_history', 'seller_type', 'seller_name', 'seller_contact', 'seller_notes',
        'created_by_id', 'featured', 'view_count', 'inquiry_count', 'published_at',
        'expires_at', 'external_data', 'external_data_updated_at', 'slug',
        'description', 'marketing_text', 'tags'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'market_value' => 'decimal:2',
        'price_negotiable' => 'boolean',
        'defects' => 'array',
        'features' => 'array',
        'safety_features' => 'array',
        'comfort_features' => 'array',
        'technical_features' => 'array',
        'inspection_date' => 'date',
        'inspection_passed' => 'boolean',
        'accident_history' => 'boolean',
        'featured' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
        'external_data' => 'array',
        'external_data_updated_at' => 'datetime',
        'tags' => 'array',
    ];

    // Relationships
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(CarImage::class)->orderBy('sort_order');
    }

    public function primaryImage(): HasMany
    {
        return $this->hasMany(CarImage::class)->where('is_primary', true);
    }

    public function deals(): HasMany
    {
        return $this->hasMany(Deal::class);
    }

    // Query Scopes for Filtering
    public function scopeAvailable(Builder $query): Builder
    {
        return $query->where('status', 'available');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->whereNotNull('published_at')
                    ->where('published_at', '<=', now())
                    ->where(function ($q) {
                        $q->whereNull('expires_at')
                          ->orWhere('expires_at', '>', now());
                    });
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('featured', true);
    }

    public function scopeByMake(Builder $query, string $make): Builder
    {
        return $query->where('make', 'LIKE', "%{$make}%");
    }

    public function scopeByModel(Builder $query, string $model): Builder
    {
        return $query->where('model', 'LIKE', "%{$model}%");
    }

    public function scopeInPriceRange(Builder $query, float $min, float $max): Builder
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    public function scopeByYear(Builder $query, int $minYear, ?int $maxYear = null): Builder
    {
        if ($maxYear) {
            return $query->whereBetween('year', [$minYear, $maxYear]);
        }
        return $query->where('year', '>=', $minYear);
    }

    public function scopeByMileage(Builder $query, int $maxMileage): Builder
    {
        return $query->where('mileage', '<=', $maxMileage);
    }

    public function scopeByFuelType(Builder $query, string $fuelType): Builder
    {
        return $query->where('fuel_type', $fuelType);
    }

    public function scopeByTransmission(Builder $query, string $transmission): Builder
    {
        return $query->where('transmission', $transmission);
    }

    public function scopeByColor(Builder $query, string $color): Builder
    {
        return $query->where('color', 'LIKE', "%{$color}%");
    }

    public function scopeWithFeature(Builder $query, string $feature): Builder
    {
        return $query->where(function ($q) use ($feature) {
            $q->whereJsonContains('features', $feature)
              ->orWhereJsonContains('safety_features', $feature)
              ->orWhereJsonContains('comfort_features', $feature)
              ->orWhereJsonContains('technical_features', $feature);
        });
    }

    public function scopeRecentlyAdded(Builder $query, int $days = 30): Builder
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function scopePopular(Builder $query): Builder
    {
        return $query->orderBy('view_count', 'desc')
                    ->orderBy('inquiry_count', 'desc');
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('make', 'LIKE', "%{$search}%")
              ->orWhere('model', 'LIKE', "%{$search}%")
              ->orWhere('variant', 'LIKE', "%{$search}%")
              ->orWhere('description', 'LIKE', "%{$search}%")
              ->orWhere('registration_number', 'LIKE', "%{$search}%");
        });
    }

    // Business Logic Methods
    public function generateSlug(): string
    {
        $baseSlug = Str::slug("{$this->make} {$this->model} {$this->year}");
        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)->where('id', '!=', $this->id)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    public function publish(): void
    {
        $this->published_at = now();
        if (!$this->slug) {
            $this->slug = $this->generateSlug();
        }
        $this->save();
    }

    public function unpublish(): void
    {
        $this->published_at = null;
        $this->save();
    }

    public function incrementViews(): void
    {
        $this->increment('view_count');
    }

    public function incrementInquiries(): void
    {
        $this->increment('inquiry_count');
    }

    public function calculateSavings(): ?float
    {
        if (!$this->market_value) {
            return null;
        }

        return max(0, $this->market_value - $this->price);
    }

    public function getPricePercentageOfMarket(): ?float
    {
        if (!$this->market_value || $this->market_value == 0) {
            return null;
        }

        return ($this->price / $this->market_value) * 100;
    }

    public function getAllFeatures(): array
    {
        return array_merge(
            $this->features ?? [],
            $this->safety_features ?? [],
            $this->comfort_features ?? [],
            $this->technical_features ?? []
        );
    }

    public function isNegotiable(): bool
    {
        return $this->price_negotiable;
    }

    public function hasInspection(): bool
    {
        return $this->inspection_date && $this->inspection_passed;
    }

    public function getAgeInYears(): int
    {
        return now()->year - $this->year;
    }

    public function isElectric(): bool
    {
        return in_array($this->fuel_type, ['electric', 'hybrid']);
    }

    public function isFeatured(): bool
    {
        return $this->featured;
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function getConditionColor(): string
    {
        return match($this->condition) {
            'new' => 'green',
            'excellent' => 'blue',
            'good' => 'yellow',
            'fair' => 'orange',
            'poor' => 'red',
            default => 'gray'
        };
    }

    public function getStatusColor(): string
    {
        return match($this->status) {
            'available' => 'green',
            'reserved' => 'yellow',
            'sold' => 'gray',
            'inactive' => 'red',
            default => 'gray'
        };
    }

    public function getFormattedPrice(): string
    {
        return number_format($this->price, 0, ',', ' ') . ' SEK';
    }

    public function getFormattedMileage(): string
    {
        if (!$this->mileage) {
            return 'Okänd';
        }
        return number_format($this->mileage, 0, ',', ' ') . ' km';
    }

    // Compatibility scoring for needs analysis
    public function scoreCompatibility(array $preferences): int
    {
        $score = 0;
        $maxScore = 0;

        // Budget compatibility (20 points)
        $maxScore += 20;
        if (isset($preferences['budget_min']) && isset($preferences['budget_max'])) {
            if ($this->price >= $preferences['budget_min'] && $this->price <= $preferences['budget_max']) {
                $score += 20;
            } elseif ($this->price <= $preferences['budget_max'] * 1.1) {
                $score += 15; // Close to budget
            }
        }

        // Make/model preference (15 points)
        $maxScore += 15;
        if (isset($preferences['preferred_makes']) && in_array($this->make, $preferences['preferred_makes'])) {
            $score += 15;
        }
        if (isset($preferences['preferred_models']) && in_array($this->model, $preferences['preferred_models'])) {
            $score += 10;
        }

        // Fuel type preference (10 points)
        $maxScore += 10;
        if (isset($preferences['fuel_preferences']) && in_array($this->fuel_type, $preferences['fuel_preferences'])) {
            $score += 10;
        }

        // Year preference (10 points)
        $maxScore += 10;
        if (isset($preferences['min_year']) && $this->year >= $preferences['min_year']) {
            $score += 10;
        }

        // Mileage preference (10 points)
        $maxScore += 10;
        if (isset($preferences['max_mileage']) && $this->mileage <= $preferences['max_mileage']) {
            $score += 10;
        }

        // Feature matching (15 points)
        $maxScore += 15;
        if (isset($preferences['must_have_features'])) {
            $allFeatures = $this->getAllFeatures();
            $matchedFeatures = array_intersect($preferences['must_have_features'], $allFeatures);
            $score += (count($matchedFeatures) / count($preferences['must_have_features'])) * 15;
        }

        // Size/type preference (10 points)
        $maxScore += 10;
        if (isset($preferences['vehicle_type']) && $this->getVehicleType() === $preferences['vehicle_type']) {
            $score += 10;
        }

        // Transmission preference (5 points)
        $maxScore += 5;
        if (isset($preferences['transmission']) && $this->transmission === $preferences['transmission']) {
            $score += 5;
        }

        // Environmental priority (5 points)
        $maxScore += 5;
        if (isset($preferences['environmental_priority'])) {
            if ($preferences['environmental_priority'] === 'high' && $this->isElectric()) {
                $score += 5;
            } elseif ($preferences['environmental_priority'] === 'medium' && in_array($this->fuel_type, ['hybrid', 'diesel'])) {
                $score += 3;
            }
        }

        return (int) (($score / $maxScore) * 100);
    }

    private function getVehicleType(): string
    {
        // Simple logic to determine vehicle type from model/variant
        $model = strtolower($this->model . ' ' . ($this->variant ?? ''));
        
        if (str_contains($model, 'suv') || str_contains($model, 'x3') || str_contains($model, 'x5')) {
            return 'suv';
        } elseif (str_contains($model, 'wagon') || str_contains($model, 'kombi')) {
            return 'wagon';
        } elseif (str_contains($model, 'coupe')) {
            return 'coupe';
        } elseif (str_contains($model, 'hatchback') || str_contains($model, 'golf')) {
            return 'hatchback';
        }
        
        return 'sedan'; // Default
    }
}
