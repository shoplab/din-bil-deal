<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'message',
        'attachments',
        'read_at',
        'is_internal_note',
    ];

    protected $casts = [
        'attachments' => 'array',
        'read_at' => 'datetime',
        'is_internal_note' => 'boolean',
    ];

    // Relationships
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Query Scopes
    public function scopeRead(Builder $query): Builder
    {
        return $query->whereNotNull('read_at');
    }

    public function scopeUnread(Builder $query): Builder
    {
        return $query->whereNull('read_at');
    }

    public function scopeFromCustomer(Builder $query): Builder
    {
        return $query->whereHas('sender', function ($query) {
            $query->where('role', User::ROLE_CUSTOMER);
        });
    }

    public function scopeFromAgent(Builder $query): Builder
    {
        return $query->whereHas('sender', function ($query) {
            $query->where('role', User::ROLE_ADMIN);
        });
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('is_internal_note', false);
    }

    public function scopeInternal(Builder $query): Builder
    {
        return $query->where('is_internal_note', true);
    }

    // Helper Methods
    public function isFromCustomer(): bool
    {
        return $this->sender && $this->sender->isCustomer();
    }

    public function isFromAgent(): bool
    {
        return $this->sender && $this->sender->isAdmin();
    }

    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    public function isInternal(): bool
    {
        return $this->is_internal_note;
    }

    public function hasAttachments(): bool
    {
        return !empty($this->attachments);
    }

    public function markAsRead(): void
    {
        $this->update(['read_at' => now()]);
    }

    public function getFormattedMessage(): string
    {
        // Process message for display (handle line breaks, etc.)
        return nl2br(e($this->message));
    }

    // Boot method to handle model events
    protected static function boot()
    {
        parent::boot();

        static::created(function ($message) {
            // Update conversation with new message info
            $conversation = $message->conversation;
            $conversation->updateLastMessageTime();
            $conversation->markAsHavingUnreadMessages($message->sender);
        });
    }
}