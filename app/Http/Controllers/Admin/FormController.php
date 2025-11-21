<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Form;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class FormController extends Controller
{
    public function index(): Response
    {
        $forms = Form::with('questions.options')->get();

        return Inertia::render('Admin/Forms/Index', [
            'forms' => $forms,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Forms/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:forms,slug|max:255',
            'description' => 'nullable|string',
            'success_message' => 'nullable|string',
            'submit_button_text' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.title' => 'required|string',
            'questions.*.subtitle' => 'nullable|string',
            'questions.*.image_url' => 'nullable|string',
            'questions.*.type' => 'required|in:multiselect,single_select,slider,image_select,text,email,phone,textarea',
            'questions.*.config' => 'nullable|array',
            'questions.*.order' => 'required|integer',
            'questions.*.is_required' => 'boolean',
            'questions.*.options' => 'array',
            'questions.*.options.*.label' => 'required|string',
            'questions.*.options.*.description' => 'nullable|string',
            'questions.*.options.*.icon' => 'nullable|string',
            'questions.*.options.*.image_url' => 'nullable|string',
            'questions.*.options.*.order' => 'required|integer',
        ]);

        $form = Form::create([
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'success_message' => $validated['success_message'] ?? null,
            'submit_button_text' => $validated['submit_button_text'] ?? 'Skicka',
            'is_active' => $validated['is_active'] ?? true,
        ]);

        foreach ($validated['questions'] as $questionData) {
            $question = $form->questions()->create([
                'title' => $questionData['title'],
                'subtitle' => $questionData['subtitle'] ?? null,
                'image_url' => $questionData['image_url'] ?? null,
                'type' => $questionData['type'],
                'config' => $questionData['config'] ?? null,
                'order' => $questionData['order'],
                'is_required' => $questionData['is_required'] ?? true,
            ]);

            if (isset($questionData['options'])) {
                foreach ($questionData['options'] as $optionData) {
                    $question->options()->create([
                        'label' => $optionData['label'],
                        'description' => $optionData['description'] ?? null,
                        'icon' => $optionData['icon'] ?? null,
                        'image_url' => $optionData['image_url'] ?? null,
                        'order' => $optionData['order'],
                    ]);
                }
            }
        }

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form created successfully.');
    }

    public function edit(Form $form): Response
    {
        $form->load('questions.options');

        return Inertia::render('Admin/Forms/Edit', [
            'form' => $form,
        ]);
    }

    public function update(Request $request, Form $form): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:forms,slug,' . $form->id,
            'description' => 'nullable|string',
            'success_message' => 'nullable|string',
            'submit_button_text' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'questions' => 'required|array|min:1',
            'questions.*.title' => 'required|string',
            'questions.*.subtitle' => 'nullable|string',
            'questions.*.image_url' => 'nullable|string',
            'questions.*.type' => 'required|in:multiselect,single_select,slider,image_select,text,email,phone,textarea',
            'questions.*.config' => 'nullable|array',
            'questions.*.order' => 'required|integer',
            'questions.*.is_required' => 'boolean',
            'questions.*.options' => 'array',
            'questions.*.options.*.label' => 'required|string',
            'questions.*.options.*.description' => 'nullable|string',
            'questions.*.options.*.icon' => 'nullable|string',
            'questions.*.options.*.image_url' => 'nullable|string',
            'questions.*.options.*.order' => 'required|integer',
        ]);

        $form->update([
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'success_message' => $validated['success_message'] ?? null,
            'submit_button_text' => $validated['submit_button_text'] ?? 'Skicka',
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Delete existing questions and options
        $form->questions()->delete();

        // Recreate questions and options
        foreach ($validated['questions'] as $questionData) {
            $question = $form->questions()->create([
                'title' => $questionData['title'],
                'subtitle' => $questionData['subtitle'] ?? null,
                'image_url' => $questionData['image_url'] ?? null,
                'type' => $questionData['type'],
                'config' => $questionData['config'] ?? null,
                'order' => $questionData['order'],
                'is_required' => $questionData['is_required'] ?? true,
            ]);

            if (isset($questionData['options'])) {
                foreach ($questionData['options'] as $optionData) {
                    $question->options()->create([
                        'label' => $optionData['label'],
                        'description' => $optionData['description'] ?? null,
                        'icon' => $optionData['icon'] ?? null,
                        'image_url' => $optionData['image_url'] ?? null,
                        'order' => $optionData['order'],
                    ]);
                }
            }
        }

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form updated successfully.');
    }

    public function destroy(Form $form): RedirectResponse
    {
        $form->delete();

        return redirect()->route('admin.forms.index')
            ->with('success', 'Form deleted successfully.');
    }
}
