<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Car;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DealController extends Controller
{
    public function index(Request $request)
    {
        $query = Deal::with(['lead', 'car', 'assignedAgent']);

        // Apply filters
        if ($request->filled('search')) {
            $query->whereHas('lead', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            })->orWhereHas('car', function ($q) use ($request) {
                $q->where('make', 'like', '%' . $request->search . '%')
                  ->orWhere('model', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('agent')) {
            $query->where('assigned_agent_id', $request->agent);
        }

        if ($request->filled('probability_min')) {
            $query->where('probability', '>=', $request->probability_min);
        }

        if ($request->filled('date_range')) {
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
                case 'overdue':
                    $query->overdue();
                    break;
            }
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $deals = $query->paginate(15)->through(function ($deal) {
            return [
                'id' => $deal->id,
                'status' => $deal->status,
                'status_label' => $deal->getStatusLabel(),
                'status_color' => $deal->getStatusColor(),
                'probability' => $deal->probability,
                'vehicle_price' => $deal->vehicle_price,
                'final_price' => $deal->final_price,
                'expected_close_date' => $deal->expected_close_date,
                'created_at' => $deal->created_at,
                'updated_at' => $deal->updated_at,
                'is_overdue' => $deal->isOverdue(),
                'days_open' => $deal->getDaysOpen(),
                'lead' => $deal->lead ? [
                    'id' => $deal->lead->id,
                    'name' => $deal->lead->name,
                    'email' => $deal->lead->email,
                    'phone' => $deal->lead->phone,
                ] : null,
                'car' => $deal->car ? [
                    'id' => $deal->car->id,
                    'make' => $deal->car->make,
                    'model' => $deal->car->model,
                    'variant' => $deal->car->variant,
                    'year' => $deal->car->year,
                    'price' => $deal->car->price,
                ] : null,
                'assigned_agent' => $deal->assignedAgent ? [
                    'id' => $deal->assignedAgent->id,
                    'name' => $deal->assignedAgent->name,
                ] : null,
            ];
        });

        // Get filter options
        $agents = User::where('role', 'admin')->select('id', 'name')->get();
        $statuses = Deal::getAllStatuses();

        return Inertia::render('Admin/Deals/Index', [
            'deals' => $deals,
            'filters' => $request->only(['search', 'status', 'agent', 'probability_min', 'date_range', 'sort', 'order']),
            'agents' => $agents,
            'statuses' => $statuses,
        ]);
    }

    public function create()
    {
        $leads = Lead::where('status', '!=', 'converted')
                    ->select('id', 'name', 'email', 'phone')
                    ->get();
                    
        $cars = Car::published()
                   ->available()
                   ->select('id', 'make', 'model', 'variant', 'year', 'price')
                   ->orderBy('make')
                   ->orderBy('model')
                   ->get();
                   
        $agents = User::where('role', 'admin')
                     ->select('id', 'name')
                     ->get();

        return Inertia::render('Admin/Deals/Create', [
            'leads' => $leads,
            'cars' => $cars,
            'agents' => $agents,
            'statuses' => Deal::getAllStatuses(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'car_id' => 'required|exists:cars,id',
            'status' => 'required|in:' . implode(',', Deal::getAllStatuses()),
            'assigned_agent_id' => 'required|exists:users,id',
            'vehicle_price' => 'required|numeric|min:0',
            'final_price' => 'nullable|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'commission_rate' => 'nullable|numeric|between:0,1',
            'probability' => 'nullable|integer|between:0,100',
            'expected_close_date' => 'nullable|date|after:today',
            'deal_notes' => 'nullable|string',
            'next_action' => 'nullable|string',
            'next_action_date' => 'nullable|date|after:today',
        ]);

        DB::transaction(function () use ($validated) {
            $deal = Deal::create($validated);
            
            // Update lead status to converted if not already
            $lead = Lead::find($validated['lead_id']);
            if ($lead->status !== 'converted') {
                $lead->update(['status' => 'qualified']);
            }
        });

        return redirect()->route('admin.deals.index')
                        ->with('success', 'Affär skapad framgångsrikt!');
    }

    public function show(Deal $deal)
    {
        $deal->load(['lead', 'car', 'assignedAgent']);

        $dealData = [
            'id' => $deal->id,
            'status' => $deal->status,
            'status_label' => $deal->getStatusLabel(),
            'status_color' => $deal->getStatusColor(),
            'probability' => $deal->probability,
            'commission_rate' => $deal->commission_rate,
            'vehicle_price' => $deal->vehicle_price,
            'final_price' => $deal->final_price,
            'deposit_amount' => $deal->deposit_amount,
            'expected_close_date' => $deal->expected_close_date,
            'actual_close_date' => $deal->actual_close_date,
            'deal_notes' => $deal->deal_notes,
            'closing_notes' => $deal->closing_notes,
            'next_action' => $deal->next_action,
            'next_action_date' => $deal->next_action_date,
            'documents_status' => $deal->documents_status,
            'financing_status' => $deal->financing_status,
            'insurance_status' => $deal->insurance_status,
            'inspection_status' => $deal->inspection_status,
            'lost_reason' => $deal->lost_reason,
            'competitor_info' => $deal->competitor_info,
            'created_at' => $deal->created_at,
            'updated_at' => $deal->updated_at,
            'closed_at' => $deal->closed_at,
            'is_overdue' => $deal->isOverdue(),
            'days_open' => $deal->getDaysOpen(),
            'commission' => $deal->calculateCommission(),
            'expected_commission' => $deal->getExpectedCommission(),
            'discount_amount' => $deal->getDiscountAmount(),
            'discount_percentage' => $deal->getDiscountPercentage(),
            'available_transitions' => $deal->getAvailableTransitions(),
            'lead' => $deal->lead ? [
                'id' => $deal->lead->id,
                'name' => $deal->lead->name,
                'email' => $deal->lead->email,
                'phone' => $deal->lead->phone,
                'status' => $deal->lead->status,
                'source' => $deal->lead->source,
                'priority' => $deal->lead->priority,
                'budget_min' => $deal->lead->budget_min,
                'budget_max' => $deal->lead->budget_max,
            ] : null,
            'car' => $deal->car ? [
                'id' => $deal->car->id,
                'make' => $deal->car->make,
                'model' => $deal->car->model,
                'variant' => $deal->car->variant,
                'year' => $deal->car->year,
                'price' => $deal->car->price,
                'mileage' => $deal->car->mileage,
                'fuel_type' => $deal->car->fuel_type,
                'transmission' => $deal->car->transmission,
                'status' => $deal->car->status,
            ] : null,
            'assigned_agent' => $deal->assignedAgent ? [
                'id' => $deal->assignedAgent->id,
                'name' => $deal->assignedAgent->name,
                'email' => $deal->assignedAgent->email,
            ] : null,
        ];

        return Inertia::render('Admin/Deals/Show', [
            'deal' => $dealData,
        ]);
    }

    public function edit(Deal $deal)
    {
        $leads = Lead::select('id', 'name', 'email', 'phone')->get();
        $cars = Car::published()
                   ->available()
                   ->select('id', 'make', 'model', 'variant', 'year', 'price')
                   ->orderBy('make')
                   ->orderBy('model')
                   ->get();
        $agents = User::where('role', 'admin')->select('id', 'name')->get();

        return Inertia::render('Admin/Deals/Edit', [
            'deal' => [
                'id' => $deal->id,
                'lead_id' => $deal->lead_id,
                'car_id' => $deal->car_id,
                'status' => $deal->status,
                'assigned_agent_id' => $deal->assigned_agent_id,
                'commission_rate' => $deal->commission_rate,
                'vehicle_price' => $deal->vehicle_price,
                'final_price' => $deal->final_price,
                'deposit_amount' => $deal->deposit_amount,
                'probability' => $deal->probability,
                'expected_close_date' => $deal->expected_close_date?->format('Y-m-d'),
                'deal_notes' => $deal->deal_notes,
                'next_action' => $deal->next_action,
                'next_action_date' => $deal->next_action_date?->format('Y-m-d'),
            ],
            'leads' => $leads,
            'cars' => $cars,
            'agents' => $agents,
            'statuses' => Deal::getAllStatuses(),
            'availableTransitions' => $deal->getAvailableTransitions(),
        ]);
    }

    public function update(Request $request, Deal $deal)
    {
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'car_id' => 'required|exists:cars,id',
            'status' => 'required|in:' . implode(',', Deal::getAllStatuses()),
            'assigned_agent_id' => 'required|exists:users,id',
            'vehicle_price' => 'required|numeric|min:0',
            'final_price' => 'nullable|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'commission_rate' => 'nullable|numeric|between:0,1',
            'probability' => 'nullable|integer|between:0,100',
            'expected_close_date' => 'nullable|date',
            'deal_notes' => 'nullable|string',
            'next_action' => 'nullable|string',
            'next_action_date' => 'nullable|date',
        ]);

        // Check if status transition is valid
        if ($validated['status'] !== $deal->status) {
            if (!$deal->canTransitionTo($validated['status'])) {
                return back()->withErrors(['status' => 'Ogiltig statusövergång.']);
            }
        }

        $deal->update($validated);

        return redirect()->route('admin.deals.show', $deal)
                        ->with('success', 'Affär uppdaterad framgångsrikt!');
    }

    public function destroy(Deal $deal)
    {
        $deal->delete();

        return redirect()->route('admin.deals.index')
                        ->with('success', 'Affär borttagen framgångsrikt!');
    }

    public function kanban(Request $request)
    {
        // Get deals grouped by status for kanban view
        $statuses = Deal::getOpenStatuses();
        $statusData = [];

        foreach ($statuses as $status) {
            $deals = Deal::with(['lead', 'car', 'assignedAgent'])
                        ->where('status', $status)
                        ->when($request->filled('agent'), function ($q) use ($request) {
                            $q->where('assigned_agent_id', $request->agent);
                        })
                        ->orderBy('probability', 'desc')
                        ->orderBy('expected_close_date', 'asc')
                        ->get()
                        ->map(function ($deal) {
                            return [
                                'id' => $deal->id,
                                'status' => $deal->status,
                                'probability' => $deal->probability,
                                'vehicle_price' => $deal->vehicle_price,
                                'final_price' => $deal->final_price,
                                'expected_close_date' => $deal->expected_close_date,
                                'is_overdue' => $deal->isOverdue(),
                                'days_open' => $deal->getDaysOpen(),
                                'available_transitions' => $deal->getAvailableTransitions(),
                                'lead' => $deal->lead ? [
                                    'id' => $deal->lead->id,
                                    'name' => $deal->lead->name,
                                    'email' => $deal->lead->email,
                                ] : null,
                                'car' => $deal->car ? [
                                    'id' => $deal->car->id,
                                    'make' => $deal->car->make,
                                    'model' => $deal->car->model,
                                    'year' => $deal->car->year,
                                ] : null,
                                'assigned_agent' => $deal->assignedAgent ? [
                                    'id' => $deal->assignedAgent->id,
                                    'name' => $deal->assignedAgent->name,
                                ] : null,
                            ];
                        });

            $statusData[] = [
                'status' => $status,
                'label' => (new Deal(['status' => $status]))->getStatusLabel(),
                'color' => (new Deal(['status' => $status]))->getStatusColor(),
                'deals' => $deals,
                'count' => $deals->count(),
                'total_value' => $deals->sum('vehicle_price'),
            ];
        }

        $agents = User::where('role', 'admin')->select('id', 'name')->get();

        return Inertia::render('Admin/Deals/Kanban', [
            'statusData' => $statusData,
            'agents' => $agents,
            'filters' => $request->only(['agent']),
        ]);
    }

    public function table(Request $request)
    {
        // This can be the same as index() or a different view
        return $this->index($request);
    }

    public function updateStage(Request $request, Deal $deal)
    {
        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', Deal::getAllStatuses()),
            'notes' => 'nullable|string',
        ]);

        if (!$deal->canTransitionTo($validated['status'])) {
            return response()->json(['error' => 'Ogiltig statusövergång'], 422);
        }

        $deal->updateStatus($validated['status'], $validated['notes'] ?? null);

        return back()->with('success', 'Affärsstatus uppdaterad!');
    }

    public function assign(Request $request, Deal $deal)
    {
        $validated = $request->validate([
            'assigned_agent_id' => 'required|exists:users,id'
        ]);

        $deal->update($validated);

        return back()->with('success', 'Affär tilldelad!');
    }

    public function close(Request $request, Deal $deal)
    {
        $validated = $request->validate([
            'status' => 'required|in:closed_won,closed_lost',
            'closing_notes' => 'nullable|string',
            'final_price' => 'nullable|numeric|min:0',
            'lost_reason' => 'nullable|string',
            'competitor_info' => 'nullable|string',
        ]);

        DB::transaction(function () use ($deal, $validated) {
            $deal->update([
                'status' => $validated['status'],
                'closing_notes' => $validated['closing_notes'],
                'final_price' => $validated['final_price'] ?? $deal->vehicle_price,
                'lost_reason' => $validated['lost_reason'],
                'competitor_info' => $validated['competitor_info'],
                'actual_close_date' => now(),
                'closed_at' => now(),
                'probability' => $validated['status'] === 'closed_won' ? 100 : 0,
            ]);

            // Update lead status
            if ($deal->lead) {
                $leadStatus = $validated['status'] === 'closed_won' ? 'converted' : 'lost';
                $deal->lead->update(['status' => $leadStatus]);
            }

            // Update car status if won
            if ($validated['status'] === 'closed_won' && $deal->car) {
                $deal->car->update(['status' => 'sold']);
            }
        });

        return back()->with('success', 'Affär stängd framgångsrikt!');
    }

    public function reopen(Deal $deal)
    {
        if (!$deal->isClosedStatus()) {
            return back()->withErrors(['error' => 'Affären är inte stängd.']);
        }

        $deal->update([
            'status' => Deal::STATUS_NEGOTIATION,
            'actual_close_date' => null,
            'closed_at' => null,
            'probability' => 60,
        ]);

        // Revert lead status
        if ($deal->lead && in_array($deal->lead->status, ['converted', 'lost'])) {
            $deal->lead->update(['status' => 'qualified']);
        }

        // Revert car status
        if ($deal->car && $deal->car->status === 'sold') {
            $deal->car->update(['status' => 'available']);
        }

        return back()->with('success', 'Affär återöppnad!');
    }
}
