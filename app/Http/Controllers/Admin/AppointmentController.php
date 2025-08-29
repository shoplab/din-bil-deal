<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Car;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['customer', 'car', 'assignedAgent']);

        // Apply filters
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('customer_name', 'like', '%' . $request->search . '%')
                  ->orWhere('customer_email', 'like', '%' . $request->search . '%')
                  ->orWhere('customer_phone', 'like', '%' . $request->search . '%');
            })->orWhereHas('car', function ($q) use ($request) {
                $q->where('make', 'like', '%' . $request->search . '%')
                  ->orWhere('model', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('agent') && $request->agent !== 'all') {
            $query->where('assigned_agent_id', $request->agent);
        }

        if ($request->filled('date_range') && $request->date_range !== 'all') {
            $range = $request->date_range;
            switch ($range) {
                case 'today':
                    $query->today();
                    break;
                case 'this_week':
                    $query->thisWeek();
                    break;
                case 'upcoming':
                    $query->upcoming();
                    break;
                case 'overdue':
                    $query->overdue();
                    break;
            }
        }

        // Sorting
        $sortBy = $request->get('sort', 'appointment_date');
        $sortOrder = $request->get('order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $appointments = $query->paginate(15)->through(function ($appointment) {
            return [
                'id' => $appointment->id,
                'type' => $appointment->type,
                'type_label' => $appointment->getTypeLabel(),
                'status' => $appointment->status,
                'status_label' => $appointment->getStatusLabel(),
                'status_color' => $appointment->getStatusColor(),
                'appointment_date' => $appointment->appointment_date,
                'duration_minutes' => $appointment->duration_minutes,
                'customer_name' => $appointment->customer_name,
                'customer_email' => $appointment->customer_email,
                'customer_phone' => $appointment->customer_phone,
                'location' => $appointment->location,
                'is_upcoming' => $appointment->isUpcoming(),
                'is_overdue' => $appointment->isOverdue(),
                'can_be_cancelled' => $appointment->canBeCancelled(),
                'can_be_rescheduled' => $appointment->canBeRescheduled(),
                'created_at' => $appointment->created_at,
                'customer' => $appointment->customer ? [
                    'id' => $appointment->customer->id,
                    'name' => $appointment->customer->name,
                    'email' => $appointment->customer->email,
                ] : null,
                'car' => $appointment->car ? [
                    'id' => $appointment->car->id,
                    'make' => $appointment->car->make,
                    'model' => $appointment->car->model,
                    'year' => $appointment->car->year,
                ] : null,
                'assigned_agent' => $appointment->assignedAgent ? [
                    'id' => $appointment->assignedAgent->id,
                    'name' => $appointment->assignedAgent->name,
                ] : null,
            ];
        });

        // Get filter options
        $agents = User::admins()->select('id', 'name')->get();
        $types = Appointment::getAllTypes();
        $statuses = Appointment::getAllStatuses();

        return Inertia::render('Admin/Appointments/Index', [
            'appointments' => $appointments,
            'filters' => $request->only(['search', 'status', 'type', 'agent', 'date_range', 'sort', 'order']),
            'agents' => $agents,
            'types' => $types,
            'statuses' => $statuses,
        ]);
    }

    public function create()
    {
        $customers = User::customers()->select('id', 'name', 'email', 'phone')->get();
        $cars = Car::published()
                   ->available()
                   ->select('id', 'make', 'model', 'year', 'price')
                   ->orderBy('make')
                   ->orderBy('model')
                   ->get();
        $agents = User::admins()->select('id', 'name')->get();

        return Inertia::render('Admin/Appointments/Create', [
            'customers' => $customers,
            'cars' => $cars,
            'agents' => $agents,
            'types' => Appointment::getAllTypes(),
            'statuses' => Appointment::getAllStatuses(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:users,id',
            'car_id' => 'required|exists:cars,id',
            'assigned_agent_id' => 'required|exists:users,id',
            'type' => 'required|in:' . implode(',', Appointment::getAllTypes()),
            'status' => 'required|in:' . implode(',', Appointment::getAllStatuses()),
            'appointment_date' => 'required|date|after:now',
            'duration_minutes' => 'required|integer|min:30|max:480',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'location' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'customer_message' => 'nullable|string',
            'special_requirements' => 'nullable|string',
            'admin_notes' => 'nullable|string',
        ]);

        $appointment = Appointment::create($validated);

        return redirect()->route('admin.appointments.show', $appointment)
                        ->with('success', 'Bokning skapad framgångsrikt!');
    }

    public function show(Appointment $appointment)
    {
        $appointment->load(['customer', 'car', 'assignedAgent']);

        return Inertia::render('Admin/Appointments/Show', [
            'appointment' => [
                'id' => $appointment->id,
                'type' => $appointment->type,
                'type_label' => $appointment->getTypeLabel(),
                'status' => $appointment->status,
                'status_label' => $appointment->getStatusLabel(),
                'status_color' => $appointment->getStatusColor(),
                'appointment_date' => $appointment->appointment_date,
                'end_time' => $appointment->getEndTime(),
                'duration_minutes' => $appointment->duration_minutes,
                'duration_hours' => $appointment->getDurationHours(),
                'customer_name' => $appointment->customer_name,
                'customer_email' => $appointment->customer_email,
                'customer_phone' => $appointment->customer_phone,
                'customer_message' => $appointment->customer_message,
                'location' => $appointment->location,
                'address' => $appointment->address,
                'special_requirements' => $appointment->special_requirements,
                'admin_notes' => $appointment->admin_notes,
                'completion_notes' => $appointment->completion_notes,
                'confirmed_at' => $appointment->confirmed_at,
                'completed_at' => $appointment->completed_at,
                'cancelled_at' => $appointment->cancelled_at,
                'cancellation_reason' => $appointment->cancellation_reason,
                'reminder_sent' => $appointment->reminder_sent,
                'reminder_sent_at' => $appointment->reminder_sent_at,
                'follow_up_required' => $appointment->follow_up_required,
                'follow_up_date' => $appointment->follow_up_date,
                'is_upcoming' => $appointment->isUpcoming(),
                'is_overdue' => $appointment->isOverdue(),
                'can_be_cancelled' => $appointment->canBeCancelled(),
                'can_be_rescheduled' => $appointment->canBeRescheduled(),
                'created_at' => $appointment->created_at,
                'updated_at' => $appointment->updated_at,
                'customer' => $appointment->customer ? [
                    'id' => $appointment->customer->id,
                    'name' => $appointment->customer->name,
                    'email' => $appointment->customer->email,
                    'phone' => $appointment->customer->phone,
                    'role' => $appointment->customer->role,
                ] : null,
                'car' => $appointment->car ? [
                    'id' => $appointment->car->id,
                    'make' => $appointment->car->make,
                    'model' => $appointment->car->model,
                    'variant' => $appointment->car->variant,
                    'year' => $appointment->car->year,
                    'price' => $appointment->car->price,
                    'status' => $appointment->car->status,
                ] : null,
                'assigned_agent' => $appointment->assignedAgent ? [
                    'id' => $appointment->assignedAgent->id,
                    'name' => $appointment->assignedAgent->name,
                    'email' => $appointment->assignedAgent->email,
                ] : null,
            ]
        ]);
    }

    public function edit(Appointment $appointment)
    {
        $customers = User::customers()->select('id', 'name', 'email', 'phone')->get();
        $cars = Car::published()
                   ->available()
                   ->select('id', 'make', 'model', 'year', 'price')
                   ->orderBy('make')
                   ->orderBy('model')
                   ->get();
        $agents = User::admins()->select('id', 'name')->get();

        return Inertia::render('Admin/Appointments/Edit', [
            'appointment' => [
                'id' => $appointment->id,
                'customer_id' => $appointment->customer_id,
                'car_id' => $appointment->car_id,
                'assigned_agent_id' => $appointment->assigned_agent_id,
                'type' => $appointment->type,
                'status' => $appointment->status,
                'appointment_date' => $appointment->appointment_date->format('Y-m-d H:i'),
                'duration_minutes' => $appointment->duration_minutes,
                'customer_name' => $appointment->customer_name,
                'customer_email' => $appointment->customer_email,
                'customer_phone' => $appointment->customer_phone,
                'location' => $appointment->location,
                'address' => $appointment->address,
                'customer_message' => $appointment->customer_message,
                'special_requirements' => $appointment->special_requirements,
                'admin_notes' => $appointment->admin_notes,
                'follow_up_required' => $appointment->follow_up_required,
                'follow_up_date' => $appointment->follow_up_date?->format('Y-m-d'),
            ],
            'customers' => $customers,
            'cars' => $cars,
            'agents' => $agents,
            'types' => Appointment::getAllTypes(),
            'statuses' => Appointment::getAllStatuses(),
        ]);
    }

    public function update(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:users,id',
            'car_id' => 'required|exists:cars,id',
            'assigned_agent_id' => 'required|exists:users,id',
            'type' => 'required|in:' . implode(',', Appointment::getAllTypes()),
            'status' => 'required|in:' . implode(',', Appointment::getAllStatuses()),
            'appointment_date' => 'required|date',
            'duration_minutes' => 'required|integer|min:30|max:480',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'location' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'customer_message' => 'nullable|string',
            'special_requirements' => 'nullable|string',
            'admin_notes' => 'nullable|string',
            'follow_up_required' => 'boolean',
            'follow_up_date' => 'nullable|date|after:today',
        ]);

        $appointment->update($validated);

        return redirect()->route('admin.appointments.show', $appointment)
                        ->with('success', 'Bokning uppdaterad framgångsrikt!');
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return redirect()->route('admin.appointments.index')
                        ->with('success', 'Bokning borttagen framgångsrikt!');
    }

    public function confirm(Appointment $appointment)
    {
        if ($appointment->confirm()) {
            return back()->with('success', 'Bokning bekräftad!');
        }

        return back()->withErrors(['error' => 'Bokningen kan inte bekräftas i nuvarande status.']);
    }

    public function complete(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'completion_notes' => 'nullable|string',
            'follow_up_required' => 'boolean',
            'follow_up_date' => 'nullable|date|after:today',
        ]);

        if ($appointment->complete($validated['completion_notes'])) {
            if ($validated['follow_up_required']) {
                $appointment->update([
                    'follow_up_required' => true,
                    'follow_up_date' => $validated['follow_up_date'],
                ]);
            }
            
            return back()->with('success', 'Bokning markerad som genomförd!');
        }

        return back()->withErrors(['error' => 'Bokningen kan inte markeras som genomförd i nuvarande status.']);
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:500',
        ]);

        if ($appointment->cancel($validated['cancellation_reason'])) {
            return back()->with('success', 'Bokning inställd!');
        }

        return back()->withErrors(['error' => 'Bokningen kan inte ställas in i nuvarande status.']);
    }

    public function markNoShow(Appointment $appointment)
    {
        if ($appointment->markNoShow()) {
            return back()->with('success', 'Bokning markerad som utebliven!');
        }

        return back()->withErrors(['error' => 'Bokningen kan inte markeras som utebliven i nuvarande status.']);
    }

    public function reschedule(Request $request, Appointment $appointment)
    {
        $validated = $request->validate([
            'new_appointment_date' => 'required|date|after:now',
        ]);

        $newDate = Carbon::parse($validated['new_appointment_date']);
        
        if ($appointment->reschedule($newDate)) {
            return back()->with('success', 'Bokning omplanerad!');
        }

        return back()->withErrors(['error' => 'Bokningen kan inte omplaneras i nuvarande status.']);
    }
}