<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class FormController extends Controller
{
    public function show(string $slug): Response
    {
        $form = Form::where('slug', $slug)
            ->where('is_active', true)
            ->with('questions.options')
            ->firstOrFail();

        return Inertia::render('Forms/Show', [
            'form' => $form,
        ]);
    }

    public function submit(Request $request, string $slug): RedirectResponse
    {
        $form = Form::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $validated = $request->validate([
            'responses' => 'required|array',
        ]);

        FormSubmission::create([
            'form_id' => $form->id,
            'responses' => $validated['responses'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()
            ->with('success', $form->success_message ?? 'Tack för ditt svar!');
    }
}
