<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Car;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    /**
     * Display customer's appointments
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $filter = $request->get('filter', 'upcoming');
        
        $query = $user->appointments()->with(['car', 'assignedAgent']);
        
        // Apply filters
        switch ($filter) {
            case 'upcoming':
                $query->upcoming()->orderBy('appointment_date', 'asc');
                break;
            case 'past':
                $query->where('appointment_date', '<', now())
                      ->orderBy('appointment_date', 'desc');
                break;
            case 'pending':
                $query->pending()->orderBy('appointment_date', 'asc');
                break;
            case 'confirmed':
                $query->confirmed()->orderBy('appointment_date', 'asc');
                break;
            default:
                $query->orderBy('appointment_date', 'desc');
        }
        
        $appointments = $query->paginate(10)->through(function ($appointment) {
            return [
                'id' => $appointment->id,
                'type' => $appointment->type,
                'type_label' => $appointment->getTypeLabel(),
                'status' => $appointment->status,
                'status_label' => $appointment->getStatusLabel(),
                'status_color' => $appointment->getStatusColor(),
                'appointment_date' => $appointment->appointment_date,
                'duration_minutes' => $appointment->duration_minutes,
                'location' => $appointment->location,
                'address' => $appointment->address,
                'customer_message' => $appointment->customer_message,
                'special_requirements' => $appointment->special_requirements,
                'admin_notes' => $appointment->admin_notes,
                'can_be_cancelled' => $appointment->canBeCancelled(),
                'can_be_rescheduled' => $appointment->canBeRescheduled(),
                'is_upcoming' => $appointment->isUpcoming(),
                'is_overdue' => $appointment->isOverdue(),
                'car' => $appointment->car ? [
                    'id' => $appointment->car->id,
                    'make' => $appointment->car->make,
                    'model' => $appointment->car->model,
                    'variant' => $appointment->car->variant,
                    'year' => $appointment->car->year,
                    'price' => $appointment->car->price,
                ] : null,
                'assigned_agent' => $appointment->assignedAgent ? [
                    'id' => $appointment->assignedAgent->id,
                    'name' => $appointment->assignedAgent->name,
                    'email' => $appointment->assignedAgent->email,
                    'phone' => $appointment->assignedAgent->phone,
                ] : null,
            ];
        });
        
        // Get appointment stats
        $stats = [
            'total' => $user->appointments()->count(),
            'upcoming' => $user->appointments()->upcoming()->count(),
            'pending' => $user->appointments()->pending()->count(),
            'completed' => $user->appointments()->completed()->count(),
        ];
        
        return Inertia::render('Customer/Appointments/Index', [
            'appointments' => $appointments,
            'stats' => $stats,
            'filter' => $filter,
        ]);
    }
    
    /**
     * Show appointment booking form for a specific car
     */
    public function create(Request $request, Car $car): Response
    {
        $user = Auth::user();
        
        // Get available dates (next 30 days, excluding weekends and past dates)
        $availableDates = [];
        $startDate = now()->addDay(); // Start from tomorrow
        
        for ($i = 0; $i < 60; $i++) { // Check 60 days to get 30 business days
            $date = $startDate->copy()->addDays($i);
            
            // Skip weekends
            if ($date->isWeekend()) {
                continue;
            }
            
            $availableDates[] = $date->format('Y-m-d');
            
            if (count($availableDates) >= 30) {
                break;
            }
        }
        
        // Get appointment types with labels
        $appointmentTypes = [
            ['value' => Appointment::TYPE_VIEWING, 'label' => 'Visning'],
            ['value' => Appointment::TYPE_TEST_DRIVE, 'label' => 'Provkörning'], 
            ['value' => Appointment::TYPE_CONSULTATION, 'label' => 'Konsultation'],
        ];
        
        // Get pre-selected type from query parameter
        $preselectedType = $request->get('type', Appointment::TYPE_TEST_DRIVE);
        if (!in_array($preselectedType, [
            Appointment::TYPE_VIEWING, 
            Appointment::TYPE_TEST_DRIVE, 
            Appointment::TYPE_CONSULTATION
        ])) {
            $preselectedType = Appointment::TYPE_TEST_DRIVE;
        }
        
        return Inertia::render('Customer/Appointments/Create', [
            'car' => [
                'id' => $car->id,
                'make' => $car->make,
                'model' => $car->model,
                'variant' => $car->variant,
                'year' => $car->year,
                'price' => $car->price,
                'mileage' => $car->mileage,
                'fuel_type' => $car->fuel_type,
                'transmission' => $car->transmission,
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'availableDates' => $availableDates,
            'appointmentTypes' => $appointmentTypes,
            'preselectedType' => $preselectedType,
        ]);
    }
    
    /**
     * Get available time slots for a specific date
     */
    public function getTimeSlots(Request $request): array
    {
        $request->validate([
            'date' => 'required|date|after:today',
            'duration' => 'required|integer|min:30|max:180',
        ]);
        
        $date = Carbon::parse($request->date);
        $duration = (int) $request->duration;
        
        $timeSlots = Appointment::getAvailableTimeSlots($date, $duration);
        
        return [
            'timeSlots' => array_map(function($slot) {
                return [
                    'value' => $slot,
                    'label' => $slot,
                ];
            }, $timeSlots)
        ];
    }
    
    /**
     * Store a new appointment
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'type' => 'required|in:' . implode(',', Appointment::getAllTypes()),
            'appointment_date' => 'required|date|after:now',
            'time' => 'required|string|regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/',
            'duration_minutes' => 'required|integer|min:30|max:180',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'customer_message' => 'nullable|string|max:1000',
            'location' => 'required|in:showroom,customer_address,other',
            'address' => 'nullable|string|max:255',
            'special_requirements' => 'nullable|string|max:500',
        ]);
        
        // Combine date and time
        $appointmentDateTime = Carbon::parse($validated['appointment_date'] . ' ' . $validated['time']);
        
        // Check if the time slot is still available
        $existingAppointment = Appointment::whereDate('appointment_date', $appointmentDateTime->toDateString())
                                         ->whereTime('appointment_date', $appointmentDateTime->toTimeString())
                                         ->whereNotIn('status', [Appointment::STATUS_CANCELLED])
                                         ->exists();
        
        if ($existingAppointment) {
            return back()->withErrors(['time' => 'Denna tid är inte längre tillgänglig. Vänligen välj en annan tid.']);
        }
        
        // Create the appointment
        DB::transaction(function () use ($user, $validated, $appointmentDateTime) {
            Appointment::create([
                'customer_id' => $user->id,
                'car_id' => $validated['car_id'],
                'type' => $validated['type'],
                'appointment_date' => $appointmentDateTime,
                'duration_minutes' => $validated['duration_minutes'],
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'customer_message' => $validated['customer_message'],
                'location' => $validated['location'],
                'address' => $validated['address'],
                'special_requirements' => $validated['special_requirements'],
                'status' => Appointment::STATUS_REQUESTED,
            ]);
        });
        
        return redirect()->route('customer.appointments.index')
                        ->with('success', 'Din bokning har skickats! Vi kommer att kontakta dig inom kort för att bekräfta tiden.');
    }
    
    /**
     * Show appointment details
     */
    public function show(Appointment $appointment): Response
    {
        // Ensure customer can only view their own appointments
        if ($appointment->customer_id !== Auth::id()) {
            abort(403);
        }
        
        $appointment->load(['car', 'assignedAgent']);
        
        $appointmentData = [
            'id' => $appointment->id,
            'type' => $appointment->type,
            'type_label' => $appointment->getTypeLabel(),
            'status' => $appointment->status,
            'status_label' => $appointment->getStatusLabel(),
            'status_color' => $appointment->getStatusColor(),
            'appointment_date' => $appointment->appointment_date,
            'duration_minutes' => $appointment->duration_minutes,
            'duration_hours' => $appointment->getDurationHours(),
            'end_time' => $appointment->getEndTime(),
            'location' => $appointment->location,
            'address' => $appointment->address,
            'customer_name' => $appointment->customer_name,
            'customer_email' => $appointment->customer_email,
            'customer_phone' => $appointment->customer_phone,
            'customer_message' => $appointment->customer_message,
            'special_requirements' => $appointment->special_requirements,
            'admin_notes' => $appointment->admin_notes,
            'completion_notes' => $appointment->completion_notes,
            'confirmed_at' => $appointment->confirmed_at,
            'completed_at' => $appointment->completed_at,
            'cancelled_at' => $appointment->cancelled_at,
            'cancellation_reason' => $appointment->cancellation_reason,
            'can_be_cancelled' => $appointment->canBeCancelled(),
            'can_be_rescheduled' => $appointment->canBeRescheduled(),
            'is_upcoming' => $appointment->isUpcoming(),
            'is_overdue' => $appointment->isOverdue(),
            'car' => $appointment->car ? [
                'id' => $appointment->car->id,
                'make' => $appointment->car->make,
                'model' => $appointment->car->model,
                'variant' => $appointment->car->variant,
                'year' => $appointment->car->year,
                'price' => $appointment->car->price,
                'mileage' => $appointment->car->mileage,
                'fuel_type' => $appointment->car->fuel_type,
                'transmission' => $appointment->car->transmission,
            ] : null,
            'assigned_agent' => $appointment->assignedAgent ? [
                'id' => $appointment->assignedAgent->id,
                'name' => $appointment->assignedAgent->name,
                'email' => $appointment->assignedAgent->email,
                'phone' => $appointment->assignedAgent->phone,
            ] : null,
        ];
        
        return Inertia::render('Customer/Appointments/Show', [
            'appointment' => $appointmentData,
        ]);
    }
    
    /**
     * Cancel an appointment
     */
    public function cancel(Request $request, Appointment $appointment)
    {
        // Ensure customer can only cancel their own appointments
        if ($appointment->customer_id !== Auth::id()) {
            abort(403);
        }
        
        $request->validate([
            'cancellation_reason' => 'nullable|string|max:255',
        ]);
        
        if (!$appointment->canBeCancelled()) {
            return back()->withErrors(['error' => 'Denna bokning kan inte längre avbokas.']);
        }
        
        $appointment->cancel($request->cancellation_reason);
        
        return back()->with('success', 'Bokningen har avbokats.');
    }
    
    /**
     * Request to reschedule an appointment
     */
    public function reschedule(Request $request, Appointment $appointment)
    {
        // Ensure customer can only reschedule their own appointments  
        if ($appointment->customer_id !== Auth::id()) {
            abort(403);
        }
        
        $request->validate([
            'new_date' => 'required|date|after:now',
            'new_time' => 'required|string|regex:/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/',
            'reason' => 'nullable|string|max:255',
        ]);
        
        if (!$appointment->canBeRescheduled()) {
            return back()->withErrors(['error' => 'Denna bokning kan inte längre omboka.']);
        }
        
        // Combine new date and time
        $newDateTime = Carbon::parse($request->new_date . ' ' . $request->new_time);
        
        // Check availability
        $existingAppointment = Appointment::whereDate('appointment_date', $newDateTime->toDateString())
                                         ->whereTime('appointment_date', $newDateTime->toTimeString())
                                         ->whereNotIn('status', [Appointment::STATUS_CANCELLED])
                                         ->where('id', '!=', $appointment->id)
                                         ->exists();
        
        if ($existingAppointment) {
            return back()->withErrors(['new_time' => 'Denna tid är inte tillgänglig. Vänligen välj en annan tid.']);
        }
        
        $appointment->reschedule($newDateTime);
        
        // Add a note about the reschedule request
        if ($request->reason) {
            $appointment->update([
                'customer_message' => ($appointment->customer_message ? $appointment->customer_message . "\n\n" : '') . 
                                    "Ombokning begärd: " . $request->reason
            ]);
        }
        
        return back()->with('success', 'Begäran om ombokning har skickats. Vi kommer att kontakta dig för att bekräfta den nya tiden.');
    }
}
