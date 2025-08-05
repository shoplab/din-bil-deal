<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Lead extends Model
{
    protected $fillable = [
        'name', 'email', 'phone', 'source', 'type', 'status', 'priority',
        'assigned_agent_id', 'created_by_id', 'description', 'preferences',
        'budget_min', 'budget_max', 'preferred_contact_method', 'marketing_consent',
        'first_contact_at', 'last_activity_at', 'estimated_value', 'lead_score'
    ];

    protected $casts = [
        'preferences' => 'array',
        'budget_min' => 'decimal:2',
        'budget_max' => 'decimal:2',
        'estimated_value' => 'decimal:2',
        'marketing_consent' => 'boolean',
        'first_contact_at' => 'datetime',
        'last_activity_at' => 'datetime',
    ];

    // Relationships
    public function assignedAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_agent_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function activities(): HasMany
    {
        return $this->hasMany(LeadActivity::class)->orderBy('created_at', 'desc');
    }

    public function deals(): HasMany
    {
        return $this->hasMany(Deal::class);
    }

    public function needsAnalysis(): HasOne
    {
        return $this->hasOne(NeedsAnalysis::class);
    }

    // Status Management Methods
    public function updateStatus(string $newStatus, ?string $note = null): void
    {
        $oldStatus = $this->status;
        $this->status = $newStatus;
        $this->last_activity_at = now();
        $this->save();

        // Log status change activity
        $this->activities()->create([
            'activity_type' => 'status_changed',
            'activity_title' => "Status changed from {$oldStatus} to {$newStatus}",
            'description' => $note,
            'old_value' => $oldStatus,
            'new_value' => $newStatus,
            'user_id' => auth()->id(),
            'completed_at' => now()
        ]);
    }

    public function assignToAgent(User $agent, ?string $note = null): void
    {
        $oldAgent = $this->assignedAgent;
        $this->assigned_agent_id = $agent->id;
        $this->last_activity_at = now();
        $this->save();

        // Update agent statistics
        $agent->increment('leads_assigned');

        // Log assignment activity
        $this->activities()->create([
            'activity_type' => 'assigned',
            'activity_title' => "Lead assigned to {$agent->name}",
            'description' => $note,
            'old_value' => $oldAgent?->name,
            'new_value' => $agent->name,
            'user_id' => auth()->id(),
            'completed_at' => now()
        ]);
    }

    public function recordActivity(string $type, string $title, ?string $description = null, array $data = []): void
    {
        $this->activities()->create([
            'activity_type' => $type,
            'activity_title' => $title,
            'description' => $description,
            'activity_data' => $data,
            'user_id' => auth()->id(),
            'completed_at' => now()
        ]);

        $this->update(['last_activity_at' => now()]);
    }

    // Query Scopes
    public function scopeWithStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    public function scopeAssignedTo(Builder $query, int $agentId): Builder
    {
        return $query->where('assigned_agent_id', $agentId);
    }

    public function scopeUnassigned(Builder $query): Builder
    {
        return $query->whereNull('assigned_agent_id');
    }

    public function scopeHighPriority(Builder $query): Builder
    {
        return $query->where('priority', '<=', 2);
    }

    public function scopeRecentActivity(Builder $query, int $days = 7): Builder
    {
        return $query->where('last_activity_at', '>=', now()->subDays($days));
    }

    public function scopeStale(Builder $query, int $days = 14): Builder
    {
        return $query->where(function ($q) use ($days) {
            $q->where('last_activity_at', '<', now()->subDays($days))
              ->orWhereNull('last_activity_at');
        });
    }

    public function scopeBySource(Builder $query, string $source): Builder
    {
        return $query->where('source', $source);
    }

    public function scopeInBudgetRange(Builder $query, float $min, float $max): Builder
    {
        return $query->where(function ($q) use ($min, $max) {
            $q->whereBetween('budget_min', [$min, $max])
              ->orWhereBetween('budget_max', [$min, $max])
              ->orWhere(function ($subQ) use ($min, $max) {
                  $subQ->where('budget_min', '<=', $min)
                       ->where('budget_max', '>=', $max);
              });
        });
    }

    public function scopeQualified(Builder $query): Builder
    {
        return $query->whereIn('status', ['in_process', 'waiting', 'finance'])
                    ->where('lead_score', '>=', 50);
    }

    // Business Logic Methods
    public function calculateLeadScore(): int
    {
        $score = 0;

        // Base score from source
        $sourceScores = [
            'needs_analysis' => 40,
            'car_deal_request' => 60,
            'sell_car' => 30,
            'website_contact' => 20
        ];
        $score += $sourceScores[$this->source] ?? 0;

        // Budget clarity bonus
        if ($this->budget_min && $this->budget_max) {
            $score += 20;
        }

        // Contact information completeness
        if ($this->phone) $score += 10;
        if ($this->marketing_consent) $score += 5;

        // Activity level
        if ($this->activities()->count() > 0) $score += 15;
        if ($this->last_activity_at && $this->last_activity_at->isAfter(now()->subDays(7))) {
            $score += 10;
        }

        // Needs analysis completion
        if ($this->needsAnalysis && $this->needsAnalysis->completion_percentage > 80) {
            $score += 20;
        }

        return min(100, $score);
    }

    public function updateLeadScore(): void
    {
        $this->lead_score = $this->calculateLeadScore();
        $this->save();
    }

    public function isStale(): bool
    {
        if (!$this->last_activity_at) {
            return $this->created_at->isBefore(now()->subDays(7));
        }

        return $this->last_activity_at->isBefore(now()->subDays(14));
    }

    public function requiresFollowUp(): bool
    {
        $lastActivity = $this->activities()->latest()->first();
        
        if (!$lastActivity) {
            return $this->created_at->isBefore(now()->subHours(24));
        }

        return $lastActivity->follow_up_at && 
               $lastActivity->follow_up_at->isPast() && 
               $lastActivity->status !== 'completed';
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'open' => 'blue',
            'in_process' => 'yellow',
            'waiting' => 'orange',
            'finance' => 'purple',
            'done' => 'green',
            'cancelled' => 'red',
            default => 'gray'
        };
    }

    public function getPriorityLabelAttribute(): string
    {
        return match($this->priority) {
            1 => 'High',
            2 => 'Medium',
            3 => 'Low',
            default => 'Normal'
        };
    }
}
