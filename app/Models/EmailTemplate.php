<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailTemplate extends Model
{
    use HasFactory;

    // System template slugs
    public const WELCOME = 'welcome';
    public const PASSWORD_RESET = 'password_reset';
    public const EMAIL_VERIFICATION = 'email_verification';
    public const LEAD_CREATED = 'lead_created';
    public const LEAD_ASSIGNED = 'lead_assigned';
    public const DEAL_CREATED = 'deal_created';
    public const DEAL_WON = 'deal_won';
    public const APPOINTMENT_CONFIRMATION = 'appointment_confirmation';
    public const APPOINTMENT_REMINDER = 'appointment_reminder';

    protected $fillable = [
        'name',
        'slug',
        'subject',
        'body',
        'variables',
        'description',
        'is_active',
        'is_system',
    ];

    protected $casts = [
        'variables' => 'array',
        'is_active' => 'boolean',
        'is_system' => 'boolean',
    ];

    /**
     * Get a template by slug.
     */
    public static function getBySlug(string $slug): ?self
    {
        return self::where('slug', $slug)->where('is_active', true)->first();
    }

    /**
     * Render template with variables.
     */
    public function render(array $data): array
    {
        $subject = $this->subject;
        $body = $this->body;

        foreach ($data as $key => $value) {
            $placeholder = '{{' . $key . '}}';
            $subject = str_replace($placeholder, $value, $subject);
            $body = str_replace($placeholder, $value, $body);
        }

        return [
            'subject' => $subject,
            'body' => $body,
        ];
    }

    /**
     * Get available variables for this template.
     */
    public function getAvailableVariables(): array
    {
        return $this->variables ?? [];
    }

    /**
     * Check if template can be deleted.
     */
    public function canBeDeleted(): bool
    {
        return !$this->is_system;
    }

    // Scopes

    /**
     * Scope to get active templates.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get system templates.
     */
    public function scopeSystem($query)
    {
        return $query->where('is_system', true);
    }

    /**
     * Scope to get custom templates.
     */
    public function scopeCustom($query)
    {
        return $query->where('is_system', false);
    }

    /**
     * Get all system template slugs.
     */
    public static function getSystemTemplateSlugs(): array
    {
        return [
            self::WELCOME,
            self::PASSWORD_RESET,
            self::EMAIL_VERIFICATION,
            self::LEAD_CREATED,
            self::LEAD_ASSIGNED,
            self::DEAL_CREATED,
            self::DEAL_WON,
            self::APPOINTMENT_CONFIRMATION,
            self::APPOINTMENT_REMINDER,
        ];
    }
}
