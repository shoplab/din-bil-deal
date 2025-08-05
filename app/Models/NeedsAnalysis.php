<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class NeedsAnalysis extends Model
{
    protected $table = 'needs_analysis';

    protected $fillable = [
        'lead_id', 'customer_name', 'customer_email', 'customer_phone',
        'budget_min', 'budget_max', 'budget_flexibility', 'financing_needed',
        'preferred_makes', 'preferred_models', 'fuel_preferences', 'transmission_preference',
        'min_year', 'max_mileage', 'must_have_features', 'nice_to_have_features',
        'vehicle_usage', 'driving_frequency', 'primary_use', 'passengers_count',
        'environmental_priority', 'reliability_priority', 'performance_priority',
        'comfort_priority', 'technology_priority', 'safety_priority',
        'trade_in_vehicle', 'trade_in_details', 'purchase_timeline',
        'additional_notes', 'completed_at', 'compatibility_scores', 'recommended_cars',
        'score', 'status'
    ];

    protected $casts = [
        'budget_min' => 'decimal:2',
        'budget_max' => 'decimal:2',
        'budget_flexibility' => 'boolean',
        'financing_needed' => 'boolean',
        'preferred_makes' => 'array',
        'preferred_models' => 'array',
        'fuel_preferences' => 'array',
        'must_have_features' => 'array',
        'nice_to_have_features' => 'array',
        'vehicle_usage' => 'array',
        'trade_in_vehicle' => 'boolean',
        'trade_in_details' => 'array',
        'completed_at' => 'datetime',
        'compatibility_scores' => 'array',
        'recommended_cars' => 'array',
        'score' => 'integer',
    ];

    // Status constants
    public const STATUS_STARTED = 'started';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_REVIEWED = 'reviewed';

    // Priority levels
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_CRITICAL = 'critical';

    // Vehicle usage patterns
    public const USAGE_CITY = 'city_driving';
    public const USAGE_HIGHWAY = 'highway_driving';
    public const USAGE_MIXED = 'mixed_driving';
    public const USAGE_OFF_ROAD = 'off_road';
    public const USAGE_TOWING = 'towing';
    public const USAGE_BUSINESS = 'business_use';
    public const USAGE_FAMILY = 'family_use';
    public const USAGE_WEEKEND = 'weekend_trips';

    // Purchase timeline
    public const TIMELINE_IMMEDIATE = 'immediate';
    public const TIMELINE_1_MONTH = '1_month';
    public const TIMELINE_3_MONTHS = '3_months';
    public const TIMELINE_6_MONTHS = '6_months';
    public const TIMELINE_1_YEAR = '1_year';
    public const TIMELINE_FLEXIBLE = 'flexible';

    // Relationships
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    // Query Scopes
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeInProgress(Builder $query): Builder
    {
        return $query->whereIn('status', [self::STATUS_STARTED, self::STATUS_IN_PROGRESS]);
    }

    public function scopeByBudgetRange(Builder $query, float $min, float $max): Builder
    {
        return $query->where(function ($q) use ($min, $max) {
            $q->whereBetween('budget_min', [$min, $max])
              ->orWhereBetween('budget_max', [$min, $max])
              ->orWhere(function ($q2) use ($min, $max) {
                  $q2->where('budget_min', '<=', $min)
                     ->where('budget_max', '>=', $max);
              });
        });
    }

    public function scopeByTimeline(Builder $query, string $timeline): Builder
    {
        return $query->where('purchase_timeline', $timeline);
    }

    public function scopeRecentlyCompleted(Builder $query, int $days = 30): Builder
    {
        return $query->where('completed_at', '>=', now()->subDays($days));
    }

    public function scopeHighScore(Builder $query, int $minScore = 80): Builder
    {
        return $query->where('score', '>=', $minScore);
    }

    // Business Logic Methods
    public function markCompleted(): void
    {
        $this->status = self::STATUS_COMPLETED;
        $this->completed_at = now();
        $this->score = $this->calculateCompletionScore();
        $this->save();

        // Trigger car recommendations
        $this->generateRecommendations();
    }

    public function calculateCompletionScore(): int
    {
        $score = 0;
        $maxScore = 0;

        // Basic information (20 points)
        $maxScore += 20;
        if ($this->customer_name && $this->customer_email) {
            $score += 20;
        } elseif ($this->customer_name || $this->customer_email) {
            $score += 10;
        }

        // Budget information (25 points)
        $maxScore += 25;
        if ($this->budget_min && $this->budget_max) {
            $score += 25;
        } elseif ($this->budget_min || $this->budget_max) {
            $score += 15;
        }

        // Vehicle preferences (20 points)
        $maxScore += 20;
        $preferenceFields = ['preferred_makes', 'fuel_preferences', 'transmission_preference'];
        $completedPreferences = 0;
        foreach ($preferenceFields as $field) {
            if ($this->$field) {
                $completedPreferences++;
            }
        }
        $score += ($completedPreferences / count($preferenceFields)) * 20;

        // Features and requirements (15 points)
        $maxScore += 15;
        if ($this->must_have_features || $this->nice_to_have_features) {
            $score += 15;
        }

        // Usage and priorities (15 points)
        $maxScore += 15;
        $priorityFields = [
            'environmental_priority', 'reliability_priority', 'performance_priority',
            'comfort_priority', 'technology_priority', 'safety_priority'
        ];
        $completedPriorities = 0;
        foreach ($priorityFields as $field) {
            if ($this->$field) {
                $completedPriorities++;
            }
        }
        $score += ($completedPriorities / count($priorityFields)) * 15;

        // Timeline (5 points)
        $maxScore += 5;
        if ($this->purchase_timeline) {
            $score += 5;
        }

        return (int) (($score / $maxScore) * 100);
    }

    public function generateRecommendations(): void
    {
        if ($this->status !== self::STATUS_COMPLETED) {
            return;
        }

        $preferences = $this->getPreferencesArray();
        $cars = Car::published()->available()->get();
        $scores = [];
        $recommendations = [];

        foreach ($cars as $car) {
            $compatibilityScore = $car->scoreCompatibility($preferences);
            $scores[$car->id] = $compatibilityScore;
            
            if ($compatibilityScore >= 60) { // Minimum compatibility threshold
                $recommendations[] = [
                    'car_id' => $car->id,
                    'score' => $compatibilityScore,
                    'reasons' => $this->getRecommendationReasons($car, $preferences),
                    'concerns' => $this->getRecommendationConcerns($car, $preferences),
                ];
            }
        }

        // Sort by score descending
        usort($recommendations, function($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        // Take top 10 recommendations
        $this->recommended_cars = array_slice($recommendations, 0, 10);
        $this->compatibility_scores = $scores;
        $this->save();
    }

    private function getPreferencesArray(): array
    {
        return [
            'budget_min' => $this->budget_min,
            'budget_max' => $this->budget_max,
            'preferred_makes' => $this->preferred_makes ?? [],
            'preferred_models' => $this->preferred_models ?? [],
            'fuel_preferences' => $this->fuel_preferences ?? [],
            'transmission' => $this->transmission_preference,
            'min_year' => $this->min_year,
            'max_mileage' => $this->max_mileage,
            'must_have_features' => $this->must_have_features ?? [],
            'nice_to_have_features' => $this->nice_to_have_features ?? [],
            'vehicle_type' => $this->inferVehicleType(),
            'environmental_priority' => $this->environmental_priority,
            'usage_patterns' => $this->vehicle_usage ?? [],
        ];
    }

    private function getRecommendationReasons(Car $car, array $preferences): array
    {
        $reasons = [];

        // Budget match
        if ($car->price >= $preferences['budget_min'] && $car->price <= $preferences['budget_max']) {
            $reasons[] = 'Inom din budget';
        }

        // Make preference
        if (in_array($car->make, $preferences['preferred_makes'] ?? [])) {
            $reasons[] = 'Föredraget märke: ' . $car->make;
        }

        // Fuel type
        if (in_array($car->fuel_type, $preferences['fuel_preferences'] ?? [])) {
            $reasons[] = 'Föredraget bränsle: ' . $car->fuel_type;
        }

        // Features match
        $carFeatures = $car->getAllFeatures();
        $matchedFeatures = array_intersect($preferences['must_have_features'] ?? [], $carFeatures);
        if (!empty($matchedFeatures)) {
            $reasons[] = 'Har önskade funktioner: ' . implode(', ', array_slice($matchedFeatures, 0, 3));
        }

        // Low mileage
        if ($car->mileage && $car->mileage <= 50000) {
            $reasons[] = 'Låg miltal: ' . $car->getFormattedMileage();
        }

        // Recent year
        if ($car->year >= now()->year - 3) {
            $reasons[] = 'Ny modell (' . $car->year . ')';
        }

        // Good value
        if ($car->calculateSavings() && $car->calculateSavings() > 20000) {
            $reasons[] = 'Bra värde - besparar ' . number_format($car->calculateSavings(), 0, ',', ' ') . ' SEK';
        }

        return array_slice($reasons, 0, 5); // Max 5 reasons
    }

    private function getRecommendationConcerns(Car $car, array $preferences): array
    {
        $concerns = [];

        // Budget concerns
        if ($car->price > $preferences['budget_max'] * 1.1) {
            $concerns[] = 'Över budget med ' . number_format($car->price - $preferences['budget_max'], 0, ',', ' ') . ' SEK';
        }

        // High mileage
        if ($car->mileage && $car->mileage > 150000) {
            $concerns[] = 'Högt miltal: ' . $car->getFormattedMileage();
        }

        // Old car
        if ($car->year < now()->year - 10) {
            $concerns[] = 'Äldre bil (' . $car->year . ')';
        }

        // Missing features
        $carFeatures = $car->getAllFeatures();
        $missingFeatures = array_diff($preferences['must_have_features'] ?? [], $carFeatures);
        if (!empty($missingFeatures)) {
            $concerns[] = 'Saknar: ' . implode(', ', array_slice($missingFeatures, 0, 3));
        }

        // Fuel type mismatch
        if (!empty($preferences['fuel_preferences']) && !in_array($car->fuel_type, $preferences['fuel_preferences'])) {
            $concerns[] = 'Annat bränsle än önskat: ' . $car->fuel_type;
        }

        return array_slice($concerns, 0, 3); // Max 3 concerns
    }

    private function inferVehicleType(): ?string
    {
        $usage = $this->vehicle_usage ?? [];
        
        if (in_array(self::USAGE_FAMILY, $usage) && $this->passengers_count > 5) {
            return 'wagon';
        }
        
        if (in_array(self::USAGE_OFF_ROAD, $usage) || in_array(self::USAGE_TOWING, $usage)) {
            return 'suv';
        }
        
        if (in_array(self::USAGE_CITY, $usage) && $this->environmental_priority === self::PRIORITY_HIGH) {
            return 'hatchback';
        }
        
        if (in_array(self::USAGE_BUSINESS, $usage)) {
            return 'sedan';
        }
        
        return null; // Let the car model determine the type
    }

    // Analysis Methods
    public function getTopRecommendations(int $limit = 5): Collection
    {
        if (empty($this->recommended_cars)) {
            return collect([]);
        }

        $topRecommendations = array_slice($this->recommended_cars, 0, $limit);
        $carIds = array_column($topRecommendations, 'car_id');
        
        $cars = Car::whereIn('id', $carIds)->get()->keyBy('id');
        
        return collect($topRecommendations)->map(function ($rec) use ($cars) {
            $rec['car'] = $cars[$rec['car_id']] ?? null;
            return $rec;
        })->filter(function ($rec) {
            return $rec['car'] !== null;
        });
    }

    public function getBudgetAnalysis(): array
    {
        return [
            'min_budget' => $this->budget_min,
            'max_budget' => $this->budget_max,
            'average_budget' => ($this->budget_min + $this->budget_max) / 2,
            'budget_range' => $this->budget_max - $this->budget_min,
            'is_flexible' => $this->budget_flexibility,
            'needs_financing' => $this->financing_needed,
        ];
    }

    public function getPriorityAnalysis(): array
    {
        $priorities = [
            'environmental' => $this->environmental_priority,
            'reliability' => $this->reliability_priority,
            'performance' => $this->performance_priority,
            'comfort' => $this->comfort_priority,
            'technology' => $this->technology_priority,
            'safety' => $this->safety_priority,
        ];

        // Filter out null values and sort by priority level
        $priorities = array_filter($priorities);
        
        $priorityWeights = [
            self::PRIORITY_CRITICAL => 4,
            self::PRIORITY_HIGH => 3,
            self::PRIORITY_MEDIUM => 2,
            self::PRIORITY_LOW => 1,
        ];

        uasort($priorities, function($a, $b) use ($priorityWeights) {
            return ($priorityWeights[$b] ?? 0) <=> ($priorityWeights[$a] ?? 0);
        });

        return $priorities;
    }

    // Utility Methods
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function getCompletionPercentage(): int
    {
        return $this->score ?? 0;
    }

    public function getTimelineLabel(): string
    {
        return match($this->purchase_timeline) {
            self::TIMELINE_IMMEDIATE => 'Omgående',
            self::TIMELINE_1_MONTH => 'Inom 1 månad',
            self::TIMELINE_3_MONTHS => 'Inom 3 månader',
            self::TIMELINE_6_MONTHS => 'Inom 6 månader',
            self::TIMELINE_1_YEAR => 'Inom 1 år',
            self::TIMELINE_FLEXIBLE => 'Flexibel',
            default => 'Ej angett',
        };
    }

    public function getFormattedBudget(): string
    {
        if (!$this->budget_min && !$this->budget_max) {
            return 'Ej angett';
        }
        
        if ($this->budget_min && $this->budget_max) {
            return number_format($this->budget_min, 0, ',', ' ') . ' - ' . 
                   number_format($this->budget_max, 0, ',', ' ') . ' SEK';
        }
        
        if ($this->budget_min) {
            return 'Från ' . number_format($this->budget_min, 0, ',', ' ') . ' SEK';
        }
        
        return 'Upp till ' . number_format($this->budget_max, 0, ',', ' ') . ' SEK';
    }

    // Static Methods
    public static function getAllStatuses(): array
    {
        return [
            self::STATUS_STARTED,
            self::STATUS_IN_PROGRESS,
            self::STATUS_COMPLETED,
            self::STATUS_REVIEWED,
        ];
    }

    public static function getAllPriorities(): array
    {
        return [
            self::PRIORITY_LOW,
            self::PRIORITY_MEDIUM,
            self::PRIORITY_HIGH,
            self::PRIORITY_CRITICAL,
        ];
    }

    public static function getAllTimelines(): array
    {
        return [
            self::TIMELINE_IMMEDIATE,
            self::TIMELINE_1_MONTH,
            self::TIMELINE_3_MONTHS,
            self::TIMELINE_6_MONTHS,
            self::TIMELINE_1_YEAR,
            self::TIMELINE_FLEXIBLE,
        ];
    }

    public static function getAllUsagePatterns(): array
    {
        return [
            self::USAGE_CITY,
            self::USAGE_HIGHWAY,
            self::USAGE_MIXED,
            self::USAGE_OFF_ROAD,
            self::USAGE_TOWING,
            self::USAGE_BUSINESS,
            self::USAGE_FAMILY,
            self::USAGE_WEEKEND,
        ];
    }
}
