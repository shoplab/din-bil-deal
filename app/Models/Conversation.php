<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Conversation extends Model
{
    // Status constants
    public const STATUS_OPEN = 'open';
    public const STATUS_IN_PROGRESS = 'in_progress';
    public const STATUS_WAITING_CUSTOMER = 'waiting_customer';
    public const STATUS_CLOSED = 'closed';

    // Priority constants
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_URGENT = 'urgent';

    // Type constants
    public const TYPE_GENERAL_INQUIRY = 'general_inquiry';
    public const TYPE_CAR_INQUIRY = 'car_inquiry';
    public const TYPE_APPOINTMENT = 'appointment';
    public const TYPE_FINANCING = 'financing';
    public const TYPE_SERVICE = 'service';
    public const TYPE_COMPLAINT = 'complaint';

    protected $fillable = [
        'subject',
        'customer_id',
        'car_id',
        'assigned_agent_id',
        'status',
        'priority',
        'type',
        'last_message_at',
        'customer_last_read_at',
        'agent_last_read_at',
        'has_unread_customer_messages',
        'has_unread_agent_messages',
        'metadata',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
        'customer_last_read_at' => 'datetime',
        'agent_last_read_at' => 'datetime',
        'has_unread_customer_messages' => 'boolean',
        'has_unread_agent_messages' => 'boolean',
        'metadata' => 'array',
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

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    // Query Scopes
    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_OPEN);
    }

    public function scopeInProgress(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_IN_PROGRESS);
    }

    public function scopeWaitingCustomer(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_WAITING_CUSTOMER);
    }

    public function scopeClosed(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CLOSED);
    }

    public function scopeByCustomer(Builder $query, int $customerId): Builder
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeByAgent(Builder $query, int $agentId): Builder
    {
        return $query->where('assigned_agent_id', $agentId);
    }

    public function scopeUnreadByCustomer(Builder $query): Builder
    {
        return $query->where('has_unread_agent_messages', true);
    }

    public function scopeUnreadByAgent(Builder $query): Builder
    {
        return $query->where('has_unread_customer_messages', true);
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeByPriority(Builder $query, string $priority): Builder
    {
        return $query->where('priority', $priority);
    }

    public function scopeRecentActivity(Builder $query): Builder
    {
        return $query->whereNotNull('last_message_at')
                    ->orderBy('last_message_at', 'desc');
    }

    // Helper Methods
    public function getStatusLabel(): string
    {
        return match($this->status) {
            self::STATUS_OPEN => 'Öppen',
            self::STATUS_IN_PROGRESS => 'Pågående',
            self::STATUS_WAITING_CUSTOMER => 'Väntar på kund',
            self::STATUS_CLOSED => 'Stängd',
            default => 'Okänd',
        };
    }

    public function getStatusColor(): string
    {
        return match($this->status) {
            self::STATUS_OPEN => 'blue',
            self::STATUS_IN_PROGRESS => 'yellow',
            self::STATUS_WAITING_CUSTOMER => 'orange',
            self::STATUS_CLOSED => 'green',
            default => 'gray',
        };
    }

    public function getPriorityLabel(): string
    {
        return match($this->priority) {
            self::PRIORITY_LOW => 'Låg',
            self::PRIORITY_MEDIUM => 'Medel',
            self::PRIORITY_HIGH => 'Hög',
            self::PRIORITY_URGENT => 'Brådskande',
            default => 'Okänd',
        };
    }

    public function getPriorityColor(): string
    {
        return match($this->priority) {
            self::PRIORITY_LOW => 'gray',
            self::PRIORITY_MEDIUM => 'blue',
            self::PRIORITY_HIGH => 'orange',
            self::PRIORITY_URGENT => 'red',
            default => 'gray',
        };
    }

    public function getTypeLabel(): string
    {
        return match($this->type) {
            self::TYPE_GENERAL_INQUIRY => 'Allmän förfrågan',
            self::TYPE_CAR_INQUIRY => 'Bil förfrågan',
            self::TYPE_APPOINTMENT => 'Bokning',
            self::TYPE_FINANCING => 'Finansiering',
            self::TYPE_SERVICE => 'Service',
            self::TYPE_COMPLAINT => 'Klagomål',
            default => 'Okänd',
        };
    }

    // Business Logic Methods
    public function markAsRead(User $user): void
    {
        if ($user->isCustomer()) {
            $this->update([
                'customer_last_read_at' => now(),
                'has_unread_agent_messages' => false,
            ]);
        } else {
            $this->update([
                'agent_last_read_at' => now(),
                'has_unread_customer_messages' => false,
            ]);
        }
    }

    public function updateLastMessageTime(): void
    {
        $this->update(['last_message_at' => now()]);
    }

    public function markAsHavingUnreadMessages(User $sender): void
    {
        if ($sender->isCustomer()) {
            $this->update(['has_unread_customer_messages' => true]);
        } else {
            $this->update(['has_unread_agent_messages' => true]);
        }
    }

    public function assignToAgent(User $agent): bool
    {
        if (!$agent->isAdmin()) {
            return false;
        }

        $this->update([
            'assigned_agent_id' => $agent->id,
            'status' => self::STATUS_IN_PROGRESS,
        ]);

        return true;
    }

    public function changeStatus(string $status): bool
    {
        if (!in_array($status, [
            self::STATUS_OPEN,
            self::STATUS_IN_PROGRESS,
            self::STATUS_WAITING_CUSTOMER,
            self::STATUS_CLOSED
        ])) {
            return false;
        }

        $this->update(['status' => $status]);
        return true;
    }

    public function changePriority(string $priority): bool
    {
        if (!in_array($priority, [
            self::PRIORITY_LOW,
            self::PRIORITY_MEDIUM,
            self::PRIORITY_HIGH,
            self::PRIORITY_URGENT
        ])) {
            return false;
        }

        $this->update(['priority' => $priority]);
        return true;
    }

    public function getUnreadCount(User $user): int
    {
        if ($user->isCustomer()) {
            return $this->has_unread_agent_messages ? 
                $this->messages()
                    ->where('sender_id', '!=', $user->id)
                    ->where('created_at', '>', $this->customer_last_read_at ?? $this->created_at)
                    ->count() : 0;
        } else {
            return $this->has_unread_customer_messages ? 
                $this->messages()
                    ->where('sender_id', '!=', $user->id)
                    ->where('created_at', '>', $this->agent_last_read_at ?? $this->created_at)
                    ->count() : 0;
        }
    }

    // Static Methods
    public static function getAllStatuses(): array
    {
        return [
            self::STATUS_OPEN,
            self::STATUS_IN_PROGRESS,
            self::STATUS_WAITING_CUSTOMER,
            self::STATUS_CLOSED,
        ];
    }

    public static function getAllPriorities(): array
    {
        return [
            self::PRIORITY_LOW,
            self::PRIORITY_MEDIUM,
            self::PRIORITY_HIGH,
            self::PRIORITY_URGENT,
        ];
    }

    public static function getAllTypes(): array
    {
        return [
            self::TYPE_GENERAL_INQUIRY,
            self::TYPE_CAR_INQUIRY,
            self::TYPE_APPOINTMENT,
            self::TYPE_FINANCING,
            self::TYPE_SERVICE,
            self::TYPE_COMPLAINT,
        ];
    }
}