<?php

namespace Database\Seeders;

use App\Models\EmailTemplate;
use Illuminate\Database\Seeder;

class EmailTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Välkommen',
                'slug' => EmailTemplate::WELCOME,
                'subject' => 'Välkommen till {{site_name}}!',
                'body' => $this->getWelcomeTemplate(),
                'variables' => ['site_name', 'user_name', 'user_email', 'login_url'],
                'description' => 'Skickas till nya användare vid registrering',
                'is_system' => true,
            ],
            [
                'name' => 'Återställ lösenord',
                'slug' => EmailTemplate::PASSWORD_RESET,
                'subject' => 'Återställ ditt lösenord - {{site_name}}',
                'body' => $this->getPasswordResetTemplate(),
                'variables' => ['site_name', 'user_name', 'reset_url', 'expiry_time'],
                'description' => 'Skickas vid begäran om lösenordsåterställning',
                'is_system' => true,
            ],
            [
                'name' => 'E-postverifiering',
                'slug' => EmailTemplate::EMAIL_VERIFICATION,
                'subject' => 'Verifiera din e-postadress - {{site_name}}',
                'body' => $this->getEmailVerificationTemplate(),
                'variables' => ['site_name', 'user_name', 'verification_url'],
                'description' => 'Skickas för att verifiera e-postadress',
                'is_system' => true,
            ],
            [
                'name' => 'Ny lead skapad',
                'slug' => EmailTemplate::LEAD_CREATED,
                'subject' => 'Ny lead: {{lead_name}} - {{site_name}}',
                'body' => $this->getLeadCreatedTemplate(),
                'variables' => ['site_name', 'lead_name', 'lead_email', 'lead_phone', 'lead_source', 'lead_url'],
                'description' => 'Skickas till ansvarig när en ny lead skapas',
                'is_system' => true,
            ],
            [
                'name' => 'Lead tilldelad',
                'slug' => EmailTemplate::LEAD_ASSIGNED,
                'subject' => 'Du har tilldelats en ny lead - {{site_name}}',
                'body' => $this->getLeadAssignedTemplate(),
                'variables' => ['site_name', 'agent_name', 'lead_name', 'lead_email', 'lead_phone', 'lead_url'],
                'description' => 'Skickas till agent när en lead tilldelas',
                'is_system' => true,
            ],
            [
                'name' => 'Ny affär skapad',
                'slug' => EmailTemplate::DEAL_CREATED,
                'subject' => 'Ny affär: {{deal_title}} - {{site_name}}',
                'body' => $this->getDealCreatedTemplate(),
                'variables' => ['site_name', 'deal_title', 'deal_value', 'customer_name', 'deal_url'],
                'description' => 'Skickas när en ny affär skapas',
                'is_system' => true,
            ],
            [
                'name' => 'Affär vunnen',
                'slug' => EmailTemplate::DEAL_WON,
                'subject' => 'Grattis! Affären {{deal_title}} är vunnen! - {{site_name}}',
                'body' => $this->getDealWonTemplate(),
                'variables' => ['site_name', 'deal_title', 'deal_value', 'customer_name', 'agent_name'],
                'description' => 'Skickas när en affär markeras som vunnen',
                'is_system' => true,
            ],
            [
                'name' => 'Bokningsbekräftelse',
                'slug' => EmailTemplate::APPOINTMENT_CONFIRMATION,
                'subject' => 'Bokningsbekräftelse - {{site_name}}',
                'body' => $this->getAppointmentConfirmationTemplate(),
                'variables' => ['site_name', 'customer_name', 'appointment_date', 'appointment_time', 'appointment_type', 'location'],
                'description' => 'Skickas som bekräftelse på en bokning',
                'is_system' => true,
            ],
            [
                'name' => 'Bokningspåminnelse',
                'slug' => EmailTemplate::APPOINTMENT_REMINDER,
                'subject' => 'Påminnelse: Din bokning imorgon - {{site_name}}',
                'body' => $this->getAppointmentReminderTemplate(),
                'variables' => ['site_name', 'customer_name', 'appointment_date', 'appointment_time', 'appointment_type', 'location'],
                'description' => 'Skickas som påminnelse innan en bokning',
                'is_system' => true,
            ],
        ];

        foreach ($templates as $template) {
            EmailTemplate::updateOrCreate(
                ['slug' => $template['slug']],
                $template
            );
        }
    }

    private function getWelcomeTemplate(): string
    {
        return <<<HTML
<h1>Välkommen till {{site_name}}!</h1>
<p>Hej {{user_name}},</p>
<p>Tack för att du registrerade dig hos oss. Vi är glada att ha dig med!</p>
<p>Ditt konto har skapats med e-postadressen: <strong>{{user_email}}</strong></p>
<p><a href="{{login_url}}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Logga in</a></p>
<p>Med vänliga hälsningar,<br>{{site_name}}</p>
HTML;
    }

    private function getPasswordResetTemplate(): string
    {
        return <<<HTML
<h1>Återställ ditt lösenord</h1>
<p>Hej {{user_name}},</p>
<p>Vi har fått en begäran om att återställa ditt lösenord.</p>
<p><a href="{{reset_url}}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Återställ lösenord</a></p>
<p>Länken är giltig i {{expiry_time}}.</p>
<p>Om du inte begärt detta, kan du ignorera detta meddelande.</p>
<p>Med vänliga hälsningar,<br>{{site_name}}</p>
HTML;
    }

    private function getEmailVerificationTemplate(): string
    {
        return <<<HTML
<h1>Verifiera din e-postadress</h1>
<p>Hej {{user_name}},</p>
<p>Klicka på knappen nedan för att verifiera din e-postadress.</p>
<p><a href="{{verification_url}}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Verifiera e-post</a></p>
<p>Om du inte skapat ett konto, kan du ignorera detta meddelande.</p>
<p>Med vänliga hälsningar,<br>{{site_name}}</p>
HTML;
    }

    private function getLeadCreatedTemplate(): string
    {
        return <<<HTML
<h1>Ny lead skapad</h1>
<p>En ny lead har registrerats i systemet.</p>
<h2>Leadinformation</h2>
<ul>
<li><strong>Namn:</strong> {{lead_name}}</li>
<li><strong>E-post:</strong> {{lead_email}}</li>
<li><strong>Telefon:</strong> {{lead_phone}}</li>
<li><strong>Källa:</strong> {{lead_source}}</li>
</ul>
<p><a href="{{lead_url}}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Visa lead</a></p>
<p>Med vänliga hälsningar,<br>{{site_name}}</p>
HTML;
    }

    private function getLeadAssignedTemplate(): string
    {
        return <<<HTML
<h1>Ny lead tilldelad</h1>
<p>Hej {{agent_name}},</p>
<p>Du har tilldelats en ny lead.</p>
<h2>Leadinformation</h2>
<ul>
<li><strong>Namn:</strong> {{lead_name}}</li>
<li><strong>E-post:</strong> {{lead_email}}</li>
<li><strong>Telefon:</strong> {{lead_phone}}</li>
</ul>
<p><a href="{{lead_url}}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Visa lead</a></p>
<p>Med vänliga hälsningar,<br>{{site_name}}</p>
HTML;
    }

    private function getDealCreatedTemplate(): string
    {
        return <<<HTML
<h1>Ny affär skapad</h1>
<p>En ny affär har skapats i systemet.</p>
<h2>Affärsinformation</h2>
<ul>
<li><strong>Titel:</strong> {{deal_title}}</li>
<li><strong>Värde:</strong> {{deal_value}} SEK</li>
<li><strong>Kund:</strong> {{customer_name}}</li>
</ul>
<p><a href="{{deal_url}}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Visa affär</a></p>
<p>Med vänliga hälsningar,<br>{{site_name}}</p>
HTML;
    }

    private function getDealWonTemplate(): string
    {
        return <<<HTML
<h1>🎉 Affär vunnen!</h1>
<p>Grattis {{agent_name}}!</p>
<p>Affären <strong>{{deal_title}}</strong> har markerats som vunnen.</p>
<h2>Affärsinformation</h2>
<ul>
<li><strong>Värde:</strong> {{deal_value}} SEK</li>
<li><strong>Kund:</strong> {{customer_name}}</li>
</ul>
<p>Bra jobbat!</p>
<p>Med vänliga hälsningar,<br>{{site_name}}</p>
HTML;
    }

    private function getAppointmentConfirmationTemplate(): string
    {
        return <<<HTML
<h1>Bokningsbekräftelse</h1>
<p>Hej {{customer_name}},</p>
<p>Din bokning har bekräftats.</p>
<h2>Bokningsdetaljer</h2>
<ul>
<li><strong>Datum:</strong> {{appointment_date}}</li>
<li><strong>Tid:</strong> {{appointment_time}}</li>
<li><strong>Typ:</strong> {{appointment_type}}</li>
<li><strong>Plats:</strong> {{location}}</li>
</ul>
<p>Vi ser fram emot att träffa dig!</p>
<p>Med vänliga hälsningar,<br>{{site_name}}</p>
HTML;
    }

    private function getAppointmentReminderTemplate(): string
    {
        return <<<HTML
<h1>Påminnelse om din bokning</h1>
<p>Hej {{customer_name}},</p>
<p>Detta är en påminnelse om din kommande bokning.</p>
<h2>Bokningsdetaljer</h2>
<ul>
<li><strong>Datum:</strong> {{appointment_date}}</li>
<li><strong>Tid:</strong> {{appointment_time}}</li>
<li><strong>Typ:</strong> {{appointment_type}}</li>
<li><strong>Plats:</strong> {{location}}</li>
</ul>
<p>Vi ser fram emot att träffa dig!</p>
<p>Med vänliga hälsningar,<br>{{site_name}}</p>
HTML;
    }
}
