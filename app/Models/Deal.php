<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Deal extends Model
{
    protected $fillable = [
        'lead_id', 'car_id', 'status', 'assigned_agent_id', 'commission_rate',
        'vehicle_price', 'final_price', 'deposit_amount', 'probability',
        'expected_close_date', 'actual_close_date', 'deal_notes', 'closing_notes',
        'documents_status', 'financing_status', 'insurance_status', 'inspection_status',
        'lost_reason', 'competitor_info', 'next_action', 'next_action_date',
        'created_at', 'updated_at', 'closed_at'
    ];

    protected $casts = [
        'commission_rate' => 'decimal:4',
        'vehicle_price' => 'decimal:2',
        'final_price' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'probability' => 'integer',
        'expected_close_date' => 'date',
        'actual_close_date' => 'date',
        'next_action_date' => 'datetime',
        'closed_at' => 'datetime',
    ];

    // Deal status constants
    public const STATUS_INQUIRY = 'inquiry';
    public const STATUS_QUALIFIED = 'qualified';
    public const STATUS_VIEWING_SCHEDULED = 'viewing_scheduled';
    public const STATUS_VIEWED = 'viewed';
    public const STATUS_TEST_DRIVE = 'test_drive';
    public const STATUS_NEGOTIATION = 'negotiation';
    public const STATUS_PROPOSAL = 'proposal';
    public const STATUS_CONTRACT = 'contract';
    public const STATUS_FINANCING = 'financing';
    public const STATUS_DOCUMENTATION = 'documentation';
    public const STATUS_CLOSED_WON = 'closed_won';
    public const STATUS_CLOSED_LOST = 'closed_lost';

    // Valid status transitions
    protected static $statusTransitions = [
        self::STATUS_INQUIRY => [self::STATUS_QUALIFIED, self::STATUS_CLOSED_LOST],
        self::STATUS_QUALIFIED => [self::STATUS_VIEWING_SCHEDULED, self::STATUS_CLOSED_LOST],
        self::STATUS_VIEWING_SCHEDULED => [self::STATUS_VIEWED, self::STATUS_QUALIFIED, self::STATUS_CLOSED_LOST],
        self::STATUS_VIEWED => [self::STATUS_TEST_DRIVE, self::STATUS_NEGOTIATION, self::STATUS_CLOSED_LOST],
        self::STATUS_TEST_DRIVE => [self::STATUS_NEGOTIATION, self::STATUS_CLOSED_LOST],
        self::STATUS_NEGOTIATION => [self::STATUS_PROPOSAL, self::STATUS_TEST_DRIVE, self::STATUS_CLOSED_LOST],
        self::STATUS_PROPOSAL => [self::STATUS_CONTRACT, self::STATUS_NEGOTIATION, self::STATUS_CLOSED_LOST],
        self::STATUS_CONTRACT => [self::STATUS_FINANCING, self::STATUS_DOCUMENTATION, self::STATUS_CLOSED_WON, self::STATUS_CLOSED_LOST],
        self::STATUS_FINANCING => [self::STATUS_DOCUMENTATION, self::STATUS_CONTRACT, self::STATUS_CLOSED_LOST],
        self::STATUS_DOCUMENTATION => [self::STATUS_CLOSED_WON, self::STATUS_CLOSED_LOST],
        self::STATUS_CLOSED_WON => [],
        self::STATUS_CLOSED_LOST => [],
    ];

    // Relationships
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function assignedAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_agent_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(LeadActivity::class, 'lead_id', 'lead_id')
                    ->where('deal_id', $this->id);
    }

    // Query Scopes
    public function scopeOpen(Builder $query): Builder
    {
        return $query->whereNotIn('status', [self::STATUS_CLOSED_WON, self::STATUS_CLOSED_LOST]);
    }

    public function scopeClosed(Builder $query): Builder
    {
        return $query->whereIn('status', [self::STATUS_CLOSED_WON, self::STATUS_CLOSED_LOST]);
    }

    public function scopeWon(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CLOSED_WON);
    }

    public function scopeLost(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CLOSED_LOST);
    }

    public function scopeByAgent(Builder $query, int $agentId): Builder
    {
        return $query->where('assigned_agent_id', $agentId);
    }

    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeHighProbability(Builder $query, int $minProbability = 70): Builder
    {
        return $query->where('probability', '>=', $minProbability);
    }

    public function scopeExpectedCloseThisMonth(Builder $query): Builder
    {
        return $query->whereBetween('expected_close_date', [
            now()->startOfMonth(),
            now()->endOfMonth()
        ]);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('expected_close_date', '<', now())
                    ->whereNotIn('status', [self::STATUS_CLOSED_WON, self::STATUS_CLOSED_LOST]);
    }

    public function scopeRecentlyUpdated(Builder $query, int $days = 7): Builder
    {
        return $query->where('updated_at', '>=', now()->subDays($days));
    }

    public function scopeStale(Builder $query, int $days = 30): Builder
    {
        return $query->where('updated_at', '<', now()->subDays($days))
                    ->whereNotIn('status', [self::STATUS_CLOSED_WON, self::STATUS_CLOSED_LOST]);
    }

    // Business Logic Methods
    public function updateStatus(string $newStatus, string $notes = null): bool
    {
        if (!$this->canTransitionTo($newStatus)) {
            return false;
        }

        $oldStatus = $this->status;
        $this->status = $newStatus;

        // Update probability based on status
        $this->probability = $this->calculateProbabilityForStatus($newStatus);

        // Handle status-specific updates
        if ($this->isClosedStatus($newStatus)) {
            $this->actual_close_date = now();
            $this->closed_at = now();
            
            if ($newStatus === self::STATUS_CLOSED_WON) {
                $this->final_price = $this->final_price ?? $this->vehicle_price;
            }
        }

        if ($notes) {
            $this->deal_notes = ($this->deal_notes ? $this->deal_notes . "\n\n" : '') . 
                               "[" . now()->format('Y-m-d H:i') . "] Status: {$oldStatus} → {$newStatus}\n{$notes}";
        }

        return $this->save();
    }

    public function canTransitionTo(string $status): bool
    {
        $currentStatus = $this->status;
        return isset(self::$statusTransitions[$currentStatus]) && 
               in_array($status, self::$statusTransitions[$currentStatus]);
    }

    public function getAvailableTransitions(): array
    {
        return self::$statusTransitions[$this->status] ?? [];
    }

    public function isClosedStatus(string $status = null): bool
    {
        $checkStatus = $status ?? $this->status;
        return in_array($checkStatus, [self::STATUS_CLOSED_WON, self::STATUS_CLOSED_LOST]);
    }

    public function isWon(): bool
    {
        return $this->status === self::STATUS_CLOSED_WON;
    }

    public function isLost(): bool
    {
        return $this->status === self::STATUS_CLOSED_LOST;
    }

    public function isOpen(): bool
    {
        return !$this->isClosedStatus();
    }

    private function calculateProbabilityForStatus(string $status): int
    {
        return match($status) {
            self::STATUS_INQUIRY => 10,
            self::STATUS_QUALIFIED => 20,
            self::STATUS_VIEWING_SCHEDULED => 30,
            self::STATUS_VIEWED => 40,
            self::STATUS_TEST_DRIVE => 50,
            self::STATUS_NEGOTIATION => 60,
            self::STATUS_PROPOSAL => 70,
            self::STATUS_CONTRACT => 80,
            self::STATUS_FINANCING => 85,
            self::STATUS_DOCUMENTATION => 90,
            self::STATUS_CLOSED_WON => 100,
            self::STATUS_CLOSED_LOST => 0,
            default => $this->probability ?? 10,
        };
    }

    // Commission Calculations
    public function calculateCommission(): float
    {
        if (!$this->isWon()) {
            return 0;
        }

        $salePrice = $this->final_price ?? $this->vehicle_price;
        $commissionRate = $this->commission_rate ?? 0.01; // Default 1%

        return $salePrice * $commissionRate;
    }

    public function getExpectedCommission(): float
    {
        $salePrice = $this->final_price ?? $this->vehicle_price;
        $commissionRate = $this->commission_rate ?? 0.01;
        $probability = $this->probability / 100;

        return $salePrice * $commissionRate * $probability;
    }

    public function setCommissionRate(float $rate): void
    {
        $this->commission_rate = max(0, min(1, $rate)); // Ensure between 0-100%
        $this->save();
    }

    // Financial Analysis
    public function getProfit(): float
    {
        if (!$this->isWon()) {
            return 0;
        }

        $salePrice = $this->final_price ?? $this->vehicle_price;
        $commission = $this->calculateCommission();
        
        // Basic profit calculation (would need cost data for accurate calculation)
        return $commission;
    }

    public function getDiscountAmount(): ?float
    {
        if (!$this->final_price || !$this->vehicle_price) {
            return null;
        }

        return max(0, $this->vehicle_price - $this->final_price);
    }

    public function getDiscountPercentage(): ?float
    {
        $discount = $this->getDiscountAmount();
        if (!$discount || !$this->vehicle_price) {
            return null;
        }

        return ($discount / $this->vehicle_price) * 100;
    }

    // Timeline Analysis
    public function getDealDuration(): ?int
    {
        if (!$this->closed_at) {
            return null;
        }

        return $this->created_at->diffInDays($this->closed_at);
    }

    public function getDaysOpen(): int
    {
        $endDate = $this->closed_at ?? now();
        return $this->created_at->diffInDays($endDate);
    }

    public function isOverdue(): bool
    {
        return $this->expected_close_date && 
               $this->expected_close_date->isPast() && 
               $this->isOpen();
    }

    public function getDaysOverdue(): int
    {
        if (!$this->isOverdue()) {
            return 0;
        }

        return $this->expected_close_date->diffInDays(now());
    }

    // Utility Methods
    public function getStatusLabel(): string
    {
        return match($this->status) {
            self::STATUS_INQUIRY => 'Förfrågan',
            self::STATUS_QUALIFIED => 'Kvalificerad',
            self::STATUS_VIEWING_SCHEDULED => 'Visning bokad',
            self::STATUS_VIEWED => 'Besiktigad',
            self::STATUS_TEST_DRIVE => 'Provkörning',
            self::STATUS_NEGOTIATION => 'Förhandling',
            self::STATUS_PROPOSAL => 'Offert',
            self::STATUS_CONTRACT => 'Kontrakt',
            self::STATUS_FINANCING => 'Finansiering',
            self::STATUS_DOCUMENTATION => 'Dokumentation',
            self::STATUS_CLOSED_WON => 'Avslutad - Vunnen',
            self::STATUS_CLOSED_LOST => 'Avslutad - Förlorad',
            default => 'Okänd status',
        };
    }

    public function getStatusColor(): string
    {
        return match($this->status) {
            self::STATUS_INQUIRY => 'blue',
            self::STATUS_QUALIFIED => 'cyan',
            self::STATUS_VIEWING_SCHEDULED => 'yellow',
            self::STATUS_VIEWED => 'orange',
            self::STATUS_TEST_DRIVE => 'purple',
            self::STATUS_NEGOTIATION => 'pink',
            self::STATUS_PROPOSAL => 'indigo',
            self::STATUS_CONTRACT => 'violet',
            self::STATUS_FINANCING => 'amber',
            self::STATUS_DOCUMENTATION => 'lime',
            self::STATUS_CLOSED_WON => 'green',
            self::STATUS_CLOSED_LOST => 'red',
            default => 'gray',
        };
    }

    public function getFormattedPrice(): string
    {
        $price = $this->final_price ?? $this->vehicle_price;
        return number_format($price, 0, ',', ' ') . ' SEK';
    }

    public function getFormattedCommission(): string
    {
        return number_format($this->calculateCommission(), 2, ',', ' ') . ' SEK';
    }

    // Static Methods
    public static function getAllStatuses(): array
    {
        return [
            self::STATUS_INQUIRY,
            self::STATUS_QUALIFIED,
            self::STATUS_VIEWING_SCHEDULED,
            self::STATUS_VIEWED,
            self::STATUS_TEST_DRIVE,
            self::STATUS_NEGOTIATION,
            self::STATUS_PROPOSAL,
            self::STATUS_CONTRACT,
            self::STATUS_FINANCING,
            self::STATUS_DOCUMENTATION,
            self::STATUS_CLOSED_WON,
            self::STATUS_CLOSED_LOST,
        ];
    }

    public static function getOpenStatuses(): array
    {
        return array_filter(self::getAllStatuses(), function($status) {
            return !in_array($status, [self::STATUS_CLOSED_WON, self::STATUS_CLOSED_LOST]);
        });
    }

    public static function getClosedStatuses(): array
    {
        return [self::STATUS_CLOSED_WON, self::STATUS_CLOSED_LOST];
    }
}
