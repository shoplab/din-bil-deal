<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $query = Lead::with(['interestedCar']);

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('source') && $request->source !== 'all') {
            $query->where('source', $request->source);
        }

        if ($request->filled('priority') && $request->priority !== 'all') {
            $query->where('priority', (int) $request->priority);
        }

        if ($request->filled('date_range') && $request->date_range !== 'all') {
            $range = $request->date_range;
            switch ($range) {
                case 'today':
                    $query->whereDate('created_at', today());
                    break;
                case 'this_week':
                    $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                    break;
                case 'this_month':
                    $query->whereMonth('created_at', now()->month);
                    break;
                case 'last_30_days':
                    $query->where('created_at', '>=', now()->subDays(30));
                    break;
            }
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $leads = $query->paginate(15)->through(function ($lead) {
            return [
                'id' => $lead->id,
                'name' => $lead->name,
                'email' => $lead->email,
                'phone' => $lead->phone,
                'status' => $lead->status,
                'priority' => $lead->priority,
                'source' => $lead->source,
                'budget_min' => $lead->budget_min,
                'budget_max' => $lead->budget_max,
                'created_at' => $lead->created_at,
                'updated_at' => $lead->updated_at,
                'last_activity_at' => $lead->last_activity_at,
                'interested_car' => $lead->interestedCar ? [
                    'id' => $lead->interestedCar->id,
                    'make' => $lead->interestedCar->make,
                    'model' => $lead->interestedCar->model,
                    'year' => $lead->interestedCar->year,
                    'price' => $lead->interestedCar->price,
                ] : null,
            ];
        });

        // Get filter options
        $statuses = ['open', 'in_process', 'waiting', 'finance', 'done', 'cancelled'];
        $sources = ['needs_analysis', 'car_deal_request', 'sell_car', 'website_contact'];
        $priorities = [1, 2, 3];

        return Inertia::render('Admin/Leads/Index', [
            'leads' => $leads,
            'filters' => $request->only(['search', 'status', 'source', 'priority', 'date_range', 'sort', 'order']),
            'statuses' => $statuses,
            'sources' => $sources,
            'priorities' => $priorities,
        ]);
    }

    public function create()
    {
        $cars = Car::published()
                   ->available()
                   ->select('id', 'make', 'model', 'year', 'price')
                   ->orderBy('make')
                   ->orderBy('model')
                   ->get();

        return Inertia::render('Admin/Leads/Create', [
            'cars' => $cars,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|in:open,in_process,waiting,finance,done,cancelled',
            'type' => 'required|in:buy_car,sell_car,needs_analysis',
            'priority' => 'required|integer|in:1,2,3',
            'source' => 'required|in:needs_analysis,car_deal_request,sell_car,website_contact',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|min:0|gte:budget_min',
            'interested_car_id' => 'nullable|exists:cars,id',
            'description' => 'nullable|string',
            'preferred_contact_method' => 'nullable|in:email,phone,both',
            'marketing_consent' => 'boolean',
        ]);

        $lead = Lead::create($validated);

        return redirect()->route('admin.leads.show', $lead)
                        ->with('success', 'Lead skapad framgångsrikt!');
    }

    public function show(Lead $lead)
    {
        $lead->load(['interestedCar']);

        return Inertia::render('Admin/Leads/Show', [
            'lead' => [
                'id' => $lead->id,
                'name' => $lead->name,
                'email' => $lead->email,
                'phone' => $lead->phone,
                'status' => $lead->status,
                'priority' => $lead->priority,
                'source' => $lead->source,
                'budget_min' => $lead->budget_min,
                'budget_max' => $lead->budget_max,
                'notes' => $lead->notes,
                'preferred_contact_method' => $lead->preferred_contact_method,
                'contact_time_preference' => $lead->contact_time_preference,
                'last_activity_at' => $lead->last_activity_at,
                'created_at' => $lead->created_at,
                'updated_at' => $lead->updated_at,
                'interested_car' => $lead->interestedCar ? [
                    'id' => $lead->interestedCar->id,
                    'make' => $lead->interestedCar->make,
                    'model' => $lead->interestedCar->model,
                    'year' => $lead->interestedCar->year,
                    'price' => $lead->interestedCar->price,
                    'mileage' => $lead->interestedCar->mileage,
                    'fuel_type' => $lead->interestedCar->fuel_type,
                    'images' => $lead->interestedCar->images ? $lead->interestedCar->images->take(1)->toArray() : [],
                ] : null,
            ]
        ]);
    }

    public function edit(Lead $lead)
    {
        $cars = Car::published()
                   ->available()
                   ->select('id', 'make', 'model', 'year', 'price')
                   ->orderBy('make')
                   ->orderBy('model')
                   ->get();

        return Inertia::render('Admin/Leads/Edit', [
            'lead' => [
                'id' => $lead->id,
                'name' => $lead->name,
                'email' => $lead->email,
                'phone' => $lead->phone,
                'status' => $lead->status,
                'priority' => $lead->priority,
                'source' => $lead->source,
                'budget_min' => $lead->budget_min,
                'budget_max' => $lead->budget_max,
                'interested_car_id' => $lead->interested_car_id,
                'notes' => $lead->notes,
                'preferred_contact_method' => $lead->preferred_contact_method,
                'contact_time_preference' => $lead->contact_time_preference,
            ],
            'cars' => $cars,
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|in:open,in_process,waiting,finance,done,cancelled',
            'type' => 'required|in:buy_car,sell_car,needs_analysis',
            'priority' => 'required|integer|in:1,2,3',
            'source' => 'required|in:needs_analysis,car_deal_request,sell_car,website_contact',
            'budget_min' => 'nullable|numeric|min:0',
            'budget_max' => 'nullable|numeric|min:0|gte:budget_min',
            'interested_car_id' => 'nullable|exists:cars,id',
            'description' => 'nullable|string',
            'preferred_contact_method' => 'nullable|in:email,phone,both',
            'marketing_consent' => 'boolean',
        ]);

        $lead->update($validated);

        return redirect()->route('admin.leads.show', $lead)
                        ->with('success', 'Lead uppdaterad framgångsrikt!');
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();

        return redirect()->route('admin.leads.index')
                        ->with('success', 'Lead borttagen framgångsrikt!');
    }

    public function markContacted(Lead $lead)
    {
        $lead->update([
            'last_activity_at' => now(),
            'status' => $lead->status === 'open' ? 'in_process' : $lead->status
        ]);

        return back()->with('success', 'Lead markerad som kontaktad!');
    }

    public function updateStatus(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'status' => 'required|in:open,in_process,waiting,finance,done,cancelled'
        ]);

        $lead->update($validated);

        return back()->with('success', 'Lead-status uppdaterad!');
    }

    public function updatePriority(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'priority' => 'required|integer|in:1,2,3'
        ]);

        $lead->update($validated);

        return back()->with('success', 'Lead-prioritet uppdaterad!');
    }
}
