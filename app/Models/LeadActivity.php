<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class LeadActivity extends Model
{
    protected $fillable = [
        'lead_id', 'user_id', 'deal_id', 'activity_type', 'subject', 'description',
        'communication_type', 'communication_direction', 'contact_method', 'outcome',
        'follow_up_required', 'follow_up_date', 'follow_up_notes', 'duration_minutes',
        'activity_date', 'completed_at', 'status', 'priority', 'tags', 'metadata'
    ];

    protected $casts = [
        'follow_up_required' => 'boolean',
        'follow_up_date' => 'datetime',
        'activity_date' => 'datetime',
        'completed_at' => 'datetime',
        'duration_minutes' => 'integer',
        'tags' => 'array',
        'metadata' => 'array',
    ];

    // Activity type constants
    public const TYPE_CALL = 'call';
    public const TYPE_EMAIL = 'email';
    public const TYPE_SMS = 'sms';
    public const TYPE_MEETING = 'meeting';
    public const TYPE_VIEWING = 'viewing';
    public const TYPE_TEST_DRIVE = 'test_drive';
    public const TYPE_FOLLOW_UP = 'follow_up';
    public const TYPE_QUOTE = 'quote';
    public const TYPE_CONTRACT = 'contract';
    public const TYPE_PAYMENT = 'payment';
    public const TYPE_DELIVERY = 'delivery';
    public const TYPE_NOTE = 'note';
    public const TYPE_TASK = 'task';
    public const TYPE_OTHER = 'other';

    // Communication direction constants
    public const DIRECTION_INBOUND = 'inbound';
    public const DIRECTION_OUTBOUND = 'outbound';

    // Status constants
    public const STATUS_PLANNED = 'planned';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_RESCHEDULED = 'rescheduled';

    // Priority constants
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_MEDIUM = 'medium';
    public const PRIORITY_HIGH = 'high';
    public const PRIORITY_URGENT = 'urgent';

    // Outcome constants
    public const OUTCOME_POSITIVE = 'positive';
    public const OUTCOME_NEUTRAL = 'neutral';
    public const OUTCOME_NEGATIVE = 'negative';
    public const OUTCOME_NO_RESPONSE = 'no_response';
    public const OUTCOME_RESCHEDULE = 'reschedule';
    public const OUTCOME_INTERESTED = 'interested';
    public const OUTCOME_NOT_INTERESTED = 'not_interested';
    public const OUTCOME_READY_TO_BUY = 'ready_to_buy';
    public const OUTCOME_NEEDS_MORE_INFO = 'needs_more_info';

    // Contact method constants
    public const METHOD_PHONE = 'phone';
    public const METHOD_EMAIL = 'email';
    public const METHOD_SMS = 'sms';
    public const METHOD_WHATSAPP = 'whatsapp';
    public const METHOD_IN_PERSON = 'in_person';
    public const METHOD_VIDEO_CALL = 'video_call';
    public const METHOD_WEBSITE = 'website';
    public const METHOD_SOCIAL_MEDIA = 'social_media';
    public const METHOD_OTHER = 'other';

    // Relationships
    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function deal(): BelongsTo
    {
        return $this->belongsTo(Deal::class);
    }

    // Query Scopes
    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('activity_type', $type);
    }

    public function scopeByUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByLead(Builder $query, int $leadId): Builder
    {
        return $query->where('lead_id', $leadId);
    }

    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopePlanned(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PLANNED);
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('activity_date', today());
    }

    public function scopeThisWeek(Builder $query): Builder
    {
        return $query->whereBetween('activity_date', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }

    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('activity_date', '>', now())
                    ->where('status', self::STATUS_PLANNED);
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('activity_date', '<', now())
                    ->where('status', self::STATUS_PLANNED);
    }

    public function scopeFollowUpRequired(Builder $query): Builder
    {
        return $query->where('follow_up_required', true)
                    ->whereNull('completed_at');
    }

    public function scopeFollowUpDue(Builder $query): Builder
    {
        return $query->where('follow_up_required', true)
                    ->where('follow_up_date', '<=', now())
                    ->whereNull('completed_at');
    }

    public function scopeByPriority(Builder $query, string $priority): Builder
    {
        return $query->where('priority', $priority);
    }

    public function scopeHighPriority(Builder $query): Builder
    {
        return $query->whereIn('priority', [self::PRIORITY_HIGH, self::PRIORITY_URGENT]);
    }

    public function scopeByOutcome(Builder $query, string $outcome): Builder
    {
        return $query->where('outcome', $outcome);
    }

    public function scopePositiveOutcome(Builder $query): Builder
    {
        return $query->whereIn('outcome', [
            self::OUTCOME_POSITIVE,
            self::OUTCOME_INTERESTED,
            self::OUTCOME_READY_TO_BUY
        ]);
    }

    public function scopeCommunication(Builder $query): Builder
    {
        return $query->whereIn('activity_type', [
            self::TYPE_CALL,
            self::TYPE_EMAIL,
            self::TYPE_SMS,
            self::TYPE_MEETING
        ]);
    }

    public function scopeRecent(Builder $query, int $days = 7): Builder
    {
        return $query->where('activity_date', '>=', now()->subDays($days));
    }

    // Business Logic Methods
    public function markCompleted(string $outcome = null, string $notes = null): void
    {
        $this->status = self::STATUS_COMPLETED;
        $this->completed_at = now();
        
        if ($outcome) {
            $this->outcome = $outcome;
        }
        
        if ($notes) {
            $this->description = ($this->description ? $this->description . "\n\n" : '') . 
                               "[Completed " . now()->format('Y-m-d H:i') . "] " . $notes;
        }
        
        $this->save();
        
        // Update lead's last contact date
        if ($this->lead) {
            $this->lead->recordActivity($this->activity_type, $this->user_id);
        }
    }

    public function reschedule(Carbon $newDate, string $reason = null): void
    {
        $oldDate = $this->activity_date;
        $this->activity_date = $newDate;
        $this->status = self::STATUS_PLANNED;
        
        if ($reason) {
            $this->description = ($this->description ? $this->description . "\n\n" : '') . 
                               "[Rescheduled from {$oldDate->format('Y-m-d H:i')}] " . $reason;
        }
        
        $this->save();
    }

    public function cancel(string $reason = null): void
    {
        $this->status = self::STATUS_CANCELLED;
        
        if ($reason) {
            $this->description = ($this->description ? $this->description . "\n\n" : '') . 
                               "[Cancelled " . now()->format('Y-m-d H:i') . "] " . $reason;
        }
        
        $this->save();
    }

    public function scheduleFollowUp(Carbon $followUpDate, string $notes = null): void
    {
        $this->follow_up_required = true;
        $this->follow_up_date = $followUpDate;
        
        if ($notes) {
            $this->follow_up_notes = $notes;
        }
        
        $this->save();
    }

    public function createFollowUpActivity(): ?self
    {
        if (!$this->follow_up_required || !$this->follow_up_date) {
            return null;
        }

        $followUp = self::create([
            'lead_id' => $this->lead_id,
            'user_id' => $this->user_id,
            'deal_id' => $this->deal_id,
            'activity_type' => self::TYPE_FOLLOW_UP,
            'subject' => 'Follow-up: ' . $this->subject,
            'description' => $this->follow_up_notes ?? 'Follow-up from previous activity',
            'activity_date' => $this->follow_up_date,
            'status' => self::STATUS_PLANNED,
            'priority' => $this->priority,
        ]);

        // Mark original activity's follow-up as handled
        $this->follow_up_required = false;
        $this->save();

        return $followUp;
    }

    public function updatePriority(string $priority): void
    {
        if (in_array($priority, self::getAllPriorities())) {
            $this->priority = $priority;
            $this->save();
        }
    }

    public function addTag(string $tag): void
    {
        $tags = $this->tags ?? [];
        if (!in_array($tag, $tags)) {
            $tags[] = $tag;
            $this->tags = $tags;
            $this->save();
        }
    }

    public function removeTag(string $tag): void
    {
        $tags = $this->tags ?? [];
        $tags = array_filter($tags, fn($t) => $t !== $tag);
        $this->tags = array_values($tags);
        $this->save();
    }

    public function setDuration(int $minutes): void
    {
        $this->duration_minutes = $minutes;
        $this->save();
    }

    // Status Check Methods
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PLANNED;
    }

    public function isCancelled(): bool
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    public function isOverdue(): bool
    {
        return $this->isPending() && $this->activity_date && $this->activity_date->isPast();
    }

    public function isToday(): bool
    {
        return $this->activity_date && $this->activity_date->isToday();
    }

    public function isUpcoming(): bool
    {
        return $this->isPending() && $this->activity_date && $this->activity_date->isFuture();
    }

    public function needsFollowUp(): bool
    {
        return $this->follow_up_required && 
               $this->follow_up_date && 
               $this->follow_up_date->isPast();
    }

    public function hasPositiveOutcome(): bool
    {
        return in_array($this->outcome, [
            self::OUTCOME_POSITIVE,
            self::OUTCOME_INTERESTED,
            self::OUTCOME_READY_TO_BUY
        ]);
    }

    public function isHighPriority(): bool
    {
        return in_array($this->priority, [self::PRIORITY_HIGH, self::PRIORITY_URGENT]);
    }

    public function isCommunicationActivity(): bool
    {
        return in_array($this->activity_type, [
            self::TYPE_CALL,
            self::TYPE_EMAIL,
            self::TYPE_SMS,
            self::TYPE_MEETING
        ]);
    }

    // Utility Methods
    public function getTypeLabel(): string
    {
        return match($this->activity_type) {
            self::TYPE_CALL => 'Telefonsamtal',
            self::TYPE_EMAIL => 'E-post',
            self::TYPE_SMS => 'SMS',
            self::TYPE_MEETING => 'Möte',
            self::TYPE_VIEWING => 'Visning',
            self::TYPE_TEST_DRIVE => 'Provkörning',
            self::TYPE_FOLLOW_UP => 'Uppföljning',
            self::TYPE_QUOTE => 'Offert',
            self::TYPE_CONTRACT => 'Kontrakt',
            self::TYPE_PAYMENT => 'Betalning',
            self::TYPE_DELIVERY => 'Leverans',
            self::TYPE_NOTE => 'Anteckning',
            self::TYPE_TASK => 'Uppgift',
            self::TYPE_OTHER => 'Övrigt',
            default => 'Okänd typ',
        };
    }

    public function getStatusLabel(): string
    {
        return match($this->status) {
            self::STATUS_PLANNED => 'Planerad',
            self::STATUS_COMPLETED => 'Avslutad',
            self::STATUS_CANCELLED => 'Avbruten',
            self::STATUS_RESCHEDULED => 'Omplanerad',
            default => 'Okänd status',
        };
    }

    public function getPriorityLabel(): string
    {
        return match($this->priority) {
            self::PRIORITY_LOW => 'Låg',
            self::PRIORITY_MEDIUM => 'Medium',
            self::PRIORITY_HIGH => 'Hög',
            self::PRIORITY_URGENT => 'Brydskande',
            default => 'Ej angett',
        };
    }

    public function getOutcomeLabel(): string
    {
        return match($this->outcome) {
            self::OUTCOME_POSITIVE => 'Positivt',
            self::OUTCOME_NEUTRAL => 'Neutralt',
            self::OUTCOME_NEGATIVE => 'Negativt',
            self::OUTCOME_NO_RESPONSE => 'Inget svar',
            self::OUTCOME_RESCHEDULE => 'Ombokning',
            self::OUTCOME_INTERESTED => 'Intresserad',
            self::OUTCOME_NOT_INTERESTED => 'Ej intresserad',
            self::OUTCOME_READY_TO_BUY => 'Redo att köpa',
            self::OUTCOME_NEEDS_MORE_INFO => 'Behöver mer info',
            default => 'Ej angett',
        };
    }

    public function getPriorityColor(): string
    {
        return match($this->priority) {
            self::PRIORITY_LOW => 'green',
            self::PRIORITY_MEDIUM => 'yellow',
            self::PRIORITY_HIGH => 'orange',
            self::PRIORITY_URGENT => 'red',
            default => 'gray',
        };
    }

    public function getStatusColor(): string
    {
        return match($this->status) {
            self::STATUS_PLANNED => 'blue',
            self::STATUS_COMPLETED => 'green',
            self::STATUS_CANCELLED => 'red',
            self::STATUS_RESCHEDULED => 'yellow',
            default => 'gray',
        };
    }

    public function getFormattedDuration(): string
    {
        if (!$this->duration_minutes) {
            return 'Ej angett';
        }

        $hours = intval($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;

        if ($hours > 0) {
            return $hours . 'h ' . ($minutes > 0 ? $minutes . 'min' : '');
        }

        return $minutes . 'min';
    }

    public function getRelativeTime(): string
    {
        if (!$this->activity_date) {
            return 'Ej angett';
        }

        return $this->activity_date->diffForHumans();
    }

    public function hasTag(string $tag): bool
    {
        return in_array($tag, $this->tags ?? []);
    }

    public function getMetadata(string $key = null): mixed
    {
        if ($key) {
            return $this->metadata[$key] ?? null;
        }
        
        return $this->metadata ?? [];
    }

    public function setMetadata(string $key, mixed $value): void
    {
        $metadata = $this->metadata ?? [];
        $metadata[$key] = $value;
        $this->metadata = $metadata;
        $this->save();
    }

    // Static Methods
    public static function getAllTypes(): array
    {
        return [
            self::TYPE_CALL,
            self::TYPE_EMAIL,
            self::TYPE_SMS,
            self::TYPE_MEETING,
            self::TYPE_VIEWING,
            self::TYPE_TEST_DRIVE,
            self::TYPE_FOLLOW_UP,
            self::TYPE_QUOTE,
            self::TYPE_CONTRACT,
            self::TYPE_PAYMENT,
            self::TYPE_DELIVERY,
            self::TYPE_NOTE,
            self::TYPE_TASK,
            self::TYPE_OTHER,
        ];
    }

    public static function getAllStatuses(): array
    {
        return [
            self::STATUS_PLANNED,
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED,
            self::STATUS_RESCHEDULED,
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

    public static function getAllOutcomes(): array
    {
        return [
            self::OUTCOME_POSITIVE,
            self::OUTCOME_NEUTRAL,
            self::OUTCOME_NEGATIVE,
            self::OUTCOME_NO_RESPONSE,
            self::OUTCOME_RESCHEDULE,
            self::OUTCOME_INTERESTED,
            self::OUTCOME_NOT_INTERESTED,
            self::OUTCOME_READY_TO_BUY,
            self::OUTCOME_NEEDS_MORE_INFO,
        ];
    }

    public static function getAllContactMethods(): array
    {
        return [
            self::METHOD_PHONE,
            self::METHOD_EMAIL,
            self::METHOD_SMS,
            self::METHOD_WHATSAPP,
            self::METHOD_IN_PERSON,
            self::METHOD_VIDEO_CALL,
            self::METHOD_WEBSITE,
            self::METHOD_SOCIAL_MEDIA,
            self::METHOD_OTHER,
        ];
    }

    // Factory Methods
    public static function createCall(int $leadId, int $userId, array $data = []): self
    {
        return self::create(array_merge([
            'lead_id' => $leadId,
            'user_id' => $userId,
            'activity_type' => self::TYPE_CALL,
            'communication_type' => 'call',
            'contact_method' => self::METHOD_PHONE,
            'activity_date' => now(),
            'status' => self::STATUS_PLANNED,
            'priority' => self::PRIORITY_MEDIUM,
        ], $data));
    }

    public static function createEmail(int $leadId, int $userId, array $data = []): self
    {
        return self::create(array_merge([
            'lead_id' => $leadId,
            'user_id' => $userId,
            'activity_type' => self::TYPE_EMAIL,
            'communication_type' => 'email',
            'contact_method' => self::METHOD_EMAIL,
            'activity_date' => now(),
            'status' => self::STATUS_COMPLETED,
            'priority' => self::PRIORITY_MEDIUM,
        ], $data));
    }

    public static function createMeeting(int $leadId, int $userId, Carbon $meetingDate, array $data = []): self
    {
        return self::create(array_merge([
            'lead_id' => $leadId,
            'user_id' => $userId,
            'activity_type' => self::TYPE_MEETING,
            'activity_date' => $meetingDate,
            'status' => self::STATUS_PLANNED,
            'priority' => self::PRIORITY_HIGH,
        ], $data));
    }

    public static function createNote(int $leadId, int $userId, string $note, array $data = []): self
    {
        return self::create(array_merge([
            'lead_id' => $leadId,
            'user_id' => $userId,
            'activity_type' => self::TYPE_NOTE,
            'description' => $note,
            'activity_date' => now(),
            'status' => self::STATUS_COMPLETED,
            'priority' => self::PRIORITY_LOW,
        ], $data));
    }
}
