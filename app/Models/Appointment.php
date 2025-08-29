<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Appointment extends Model
{
    // Appointment type constants
    public const TYPE_VIEWING = 'viewing';
    public const TYPE_TEST_DRIVE = 'test_drive';
    public const TYPE_CONSULTATION = 'consultation';
    public const TYPE_DELIVERY = 'delivery';

    // Appointment status constants
    public const STATUS_REQUESTED = 'requested';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_NO_SHOW = 'no_show';

    protected $fillable = [
        'customer_id',
        'car_id',
        'assigned_agent_id',
        'type',
        'status',
        'appointment_date',
        'duration_minutes',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_message',
        'location',
        'address',
        'special_requirements',
        'admin_notes',
        'completion_notes',
        'confirmed_at',
        'completed_at',
        'cancelled_at',
        'cancellation_reason',
        'reminder_sent',
        'reminder_sent_at',
        'follow_up_required',
        'follow_up_date',
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
        'confirmed_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'reminder_sent_at' => 'datetime',
        'follow_up_date' => 'datetime',
        'reminder_sent' => 'boolean',
        'follow_up_required' => 'boolean',
        'duration_minutes' => 'integer',
    ];

    // Relationships
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    public function assignedAgent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_agent_id');
    }

    // Query Scopes
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('appointment_date', '>=', now())
                    ->whereNotIn('status', [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_REQUESTED);
    }

    public function scopeConfirmed(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CONFIRMED);
    }

    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopeCancelled(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CANCELLED);
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('appointment_date', today());
    }

    public function scopeThisWeek(Builder $query): Builder
    {
        return $query->whereBetween('appointment_date', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    public function scopeByAgent(Builder $query, int $agentId): Builder
    {
        return $query->where('assigned_agent_id', $agentId);
    }

    public function scopeByCustomer(Builder $query, int $customerId): Builder
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('appointment_date', '<', now())
                    ->where('status', self::STATUS_CONFIRMED);
    }

    public function scopeNeedingFollowUp(Builder $query): Builder
    {
        return $query->where('follow_up_required', true)
                    ->where('status', self::STATUS_COMPLETED)
                    ->where(function ($query) {
                        $query->whereNull('follow_up_date')
                              ->orWhere('follow_up_date', '<=', now());
                    });
    }

    // Business Logic Methods
    public function confirm(): bool
    {
        if ($this->status !== self::STATUS_REQUESTED) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_CONFIRMED,
            'confirmed_at' => now(),
        ]);

        return true;
    }

    public function complete(?string $notes = null): bool
    {
        if (!in_array($this->status, [self::STATUS_CONFIRMED, self::STATUS_REQUESTED])) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
            'completion_notes' => $notes,
        ]);

        return true;
    }

    public function cancel(string $reason = null): bool
    {
        if (in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED])) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_CANCELLED,
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);

        return true;
    }

    public function markNoShow(): bool
    {
        if ($this->status !== self::STATUS_CONFIRMED) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_NO_SHOW,
        ]);

        return true;
    }

    public function sendReminder(): bool
    {
        if ($this->reminder_sent) {
            return false;
        }

        // Here you would implement the actual reminder sending logic
        // For now, just mark as sent
        $this->update([
            'reminder_sent' => true,
            'reminder_sent_at' => now(),
        ]);

        return true;
    }

    public function reschedule(Carbon $newDate): bool
    {
        if (in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED])) {
            return false;
        }

        $this->update([
            'appointment_date' => $newDate,
            'status' => self::STATUS_REQUESTED, // Reset to requested for re-confirmation
            'confirmed_at' => null,
        ]);

        return true;
    }

    // Helper Methods
    public function isUpcoming(): bool
    {
        return $this->appointment_date->isFuture() && 
               !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function isOverdue(): bool
    {
        return $this->appointment_date->isPast() && 
               $this->status === self::STATUS_CONFIRMED;
    }

    public function canBeCancelled(): bool
    {
        return !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function canBeRescheduled(): bool
    {
        return !in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    public function getEndTime(): Carbon
    {
        return $this->appointment_date->addMinutes($this->duration_minutes);
    }

    public function getDurationHours(): float
    {
        return $this->duration_minutes / 60;
    }

    // Status and Type Labels
    public function getStatusLabel(): string
    {
        return match($this->status) {
            self::STATUS_REQUESTED => 'Begärd',
            self::STATUS_CONFIRMED => 'Bekräftad',
            self::STATUS_COMPLETED => 'Genomförd',
            self::STATUS_CANCELLED => 'Inställd',
            self::STATUS_NO_SHOW => 'Utebliven',
            default => 'Okänd',
        };
    }

    public function getStatusColor(): string
    {
        return match($this->status) {
            self::STATUS_REQUESTED => 'yellow',
            self::STATUS_CONFIRMED => 'blue',
            self::STATUS_COMPLETED => 'green',
            self::STATUS_CANCELLED => 'red',
            self::STATUS_NO_SHOW => 'orange',
            default => 'gray',
        };
    }

    public function getTypeLabel(): string
    {
        return match($this->type) {
            self::TYPE_VIEWING => 'Visning',
            self::TYPE_TEST_DRIVE => 'Provkörning',
            self::TYPE_CONSULTATION => 'Konsultation',
            self::TYPE_DELIVERY => 'Överlämning',
            default => 'Okänd',
        };
    }

    // Static Methods
    public static function getAllTypes(): array
    {
        return [
            self::TYPE_VIEWING,
            self::TYPE_TEST_DRIVE,
            self::TYPE_CONSULTATION,
            self::TYPE_DELIVERY,
        ];
    }

    public static function getAllStatuses(): array
    {
        return [
            self::STATUS_REQUESTED,
            self::STATUS_CONFIRMED,
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED,
            self::STATUS_NO_SHOW,
        ];
    }

    public static function getAvailableTimeSlots(Carbon $date, int $durationMinutes = 60): array
    {
        // Business hours: 9 AM to 6 PM
        $startTime = $date->copy()->setTime(9, 0);
        $endTime = $date->copy()->setTime(18, 0);
        $slots = [];

        // Generate 30-minute intervals
        $current = $startTime->copy();
        while ($current->addMinutes(30)->lessThanOrEqualTo($endTime)) {
            $slotEnd = $current->copy()->addMinutes($durationMinutes);
            if ($slotEnd->lessThanOrEqualTo($endTime)) {
                $slots[] = $current->format('H:i');
            }
        }

        // Remove already booked slots
        $bookedSlots = self::whereDate('appointment_date', $date)
                          ->whereNotIn('status', [self::STATUS_CANCELLED])
                          ->pluck('appointment_date')
                          ->map(fn($date) => $date->format('H:i'))
                          ->toArray();

        return array_diff($slots, $bookedSlots);
    }
}