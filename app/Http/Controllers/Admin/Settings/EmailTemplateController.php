<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmailTemplateController extends Controller
{
    public function index()
    {
        $templates = EmailTemplate::all()->map(fn ($template) => [
            'id' => $template->id,
            'name' => $template->name,
            'slug' => $template->slug,
            'subject' => $template->subject,
            'description' => $template->description,
            'is_active' => $template->is_active,
            'is_system' => $template->is_system,
            'variables' => $template->variables,
            'updated_at' => $template->updated_at,
        ]);

        return Inertia::render('Admin/Settings/Templates', [
            'templates' => $templates,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Settings/Templates/Create', [
            'commonVariables' => $this->getCommonVariables(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:email_templates',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'description' => 'nullable|string|max:500',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        EmailTemplate::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'] ?? Str::slug($validated['name']),
            'subject' => $validated['subject'],
            'body' => $validated['body'],
            'description' => $validated['description'] ?? null,
            'variables' => $validated['variables'] ?? [],
            'is_active' => $validated['is_active'] ?? true,
            'is_system' => false,
        ]);

        return redirect()->route('admin.settings.templates')
                        ->with('success', 'E-postmall skapad framgångsrikt!');
    }

    public function edit(EmailTemplate $template)
    {
        return Inertia::render('Admin/Settings/Templates/Edit', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'slug' => $template->slug,
                'subject' => $template->subject,
                'body' => $template->body,
                'description' => $template->description,
                'variables' => $template->variables,
                'is_active' => $template->is_active,
                'is_system' => $template->is_system,
            ],
            'commonVariables' => $this->getCommonVariables(),
        ]);
    }

    public function update(Request $request, EmailTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('email_templates')->ignore($template->id)],
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'description' => 'nullable|string|max:500',
            'variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        // System templates can only have subject/body/is_active modified
        if ($template->is_system) {
            $template->update([
                'subject' => $validated['subject'],
                'body' => $validated['body'],
                'is_active' => $validated['is_active'] ?? $template->is_active,
            ]);
        } else {
            $template->update([
                'name' => $validated['name'],
                'slug' => $validated['slug'] ?? Str::slug($validated['name']),
                'subject' => $validated['subject'],
                'body' => $validated['body'],
                'description' => $validated['description'] ?? null,
                'variables' => $validated['variables'] ?? [],
                'is_active' => $validated['is_active'] ?? true,
            ]);
        }

        return redirect()->route('admin.settings.templates')
                        ->with('success', 'E-postmall uppdaterad framgångsrikt!');
    }

    public function destroy(EmailTemplate $template)
    {
        if ($template->is_system) {
            return back()->withErrors(['error' => 'Systemmallar kan inte tas bort.']);
        }

        $template->delete();

        return redirect()->route('admin.settings.templates')
                        ->with('success', 'E-postmall borttagen framgångsrikt!');
    }

    public function preview(Request $request, EmailTemplate $template)
    {
        $sampleData = $this->getSampleData($template->variables ?? []);
        $rendered = $template->render($sampleData);

        return response()->json($rendered);
    }

    public function toggleActive(EmailTemplate $template)
    {
        $template->update([
            'is_active' => !$template->is_active,
        ]);

        $status = $template->is_active ? 'aktiverad' : 'inaktiverad';

        return back()->with('success', "E-postmall {$status} framgångsrikt!");
    }

    private function getCommonVariables(): array
    {
        return [
            'site_name' => 'Webbplatsens namn',
            'user_name' => 'Användarens namn',
            'user_email' => 'Användarens e-post',
            'login_url' => 'Inloggningslänk',
            'reset_url' => 'Återställningslänk',
            'verification_url' => 'Verifieringslänk',
            'lead_name' => 'Leadens namn',
            'lead_email' => 'Leadens e-post',
            'lead_phone' => 'Leadens telefon',
            'deal_title' => 'Affärstitel',
            'deal_value' => 'Affärsvärde',
            'customer_name' => 'Kundnamn',
            'agent_name' => 'Agentens namn',
            'appointment_date' => 'Bokningsdatum',
            'appointment_time' => 'Bokningstid',
        ];
    }

    private function getSampleData(array $variables): array
    {
        $sampleValues = [
            'site_name' => 'Din Bil Deal',
            'user_name' => 'Anna Andersson',
            'user_email' => 'anna@example.com',
            'login_url' => url('/login'),
            'reset_url' => url('/reset-password/token'),
            'verification_url' => url('/verify-email/token'),
            'lead_name' => 'Erik Eriksson',
            'lead_email' => 'erik@example.com',
            'lead_phone' => '070-123 45 67',
            'lead_source' => 'Webbformulär',
            'lead_url' => url('/admin/leads/1'),
            'deal_title' => 'Volvo XC60 2023',
            'deal_value' => '450 000',
            'deal_url' => url('/admin/deals/1'),
            'customer_name' => 'Maria Svensson',
            'agent_name' => 'Johan Karlsson',
            'appointment_date' => now()->addDays(2)->format('Y-m-d'),
            'appointment_time' => '14:00',
            'appointment_type' => 'Provkörning',
            'location' => 'Din Bil Deal, Stockholm',
            'expiry_time' => '60 minuter',
        ];

        $data = [];
        foreach ($variables as $variable) {
            $data[$variable] = $sampleValues[$variable] ?? "[{$variable}]";
        }

        return $data;
    }
}
