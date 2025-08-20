<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Car;
use App\Models\Lead;
use App\Models\Deal;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CustomerDashboardController extends Controller
{
    /**
     * Display the customer dashboard.
     */
    public function index(): Response
    {
        $user = Auth::user();
        
        // Get customer statistics
        $stats = $user->getCustomerStats();
        
        // Get recent activity
        $recentLeads = $user->leads()
            ->with('interestedCar')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'status' => $lead->status,
                    'status_label' => $lead->getStatusLabel(),
                    'created_at' => $lead->created_at,
                    'car' => $lead->interestedCar ? [
                        'id' => $lead->interestedCar->id,
                        'make' => $lead->interestedCar->make,
                        'model' => $lead->interestedCar->model,
                        'year' => $lead->interestedCar->year,
                        'price' => $lead->interestedCar->price,
                    ] : null,
                ];
            });
        
        // Get saved cars
        $savedCars = $user->savedCars()
            ->published()
            ->available()
            ->with(['images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->take(6)
            ->get()
            ->map(function ($car) {
                return [
                    'id' => $car->id,
                    'make' => $car->make,
                    'model' => $car->model,
                    'variant' => $car->variant,
                    'year' => $car->year,
                    'price' => $car->price,
                    'mileage' => $car->mileage,
                    'fuel_type' => $car->fuel_type,
                    'transmission' => $car->transmission,
                    'status' => $car->status,
                    'primary_image' => $car->images->first()?->image_path,
                ];
            });
        
        // Get recent deals (if any)
        $recentDeals = Deal::whereHas('lead', function ($query) use ($user) {
                $query->where('customer_id', $user->id);
            })
            ->with(['car', 'assignedAgent'])
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()
            ->map(function ($deal) {
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
                    'car' => $deal->car ? [
                        'make' => $deal->car->make,
                        'model' => $deal->car->model,
                        'year' => $deal->car->year,
                    ] : null,
                    'assigned_agent' => $deal->assignedAgent ? [
                        'name' => $deal->assignedAgent->name,
                        'email' => $deal->assignedAgent->email,
                    ] : null,
                ];
            });
        
        // Get upcoming appointments
        $upcomingAppointments = $user->appointments()
            ->upcoming()
            ->with(['car', 'assignedAgent'])
            ->orderBy('appointment_date', 'asc')
            ->take(3)
            ->get()
            ->map(function ($appointment) {
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
                    'car' => $appointment->car ? [
                        'id' => $appointment->car->id,
                        'make' => $appointment->car->make,
                        'model' => $appointment->car->model,
                        'year' => $appointment->car->year,
                        'price' => $appointment->car->price,
                    ] : null,
                    'assigned_agent' => $appointment->assignedAgent ? [
                        'name' => $appointment->assignedAgent->name,
                        'email' => $appointment->assignedAgent->email,
                    ] : null,
                ];
            });

        return Inertia::render('Customer/Dashboard', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'email_verified_at' => $user->email_verified_at,
                'preferred_contact_method' => $user->preferred_contact_method,
                'marketing_consent' => $user->marketing_consent,
            ],
            'stats' => $stats,
            'recentLeads' => $recentLeads,
            'savedCars' => $savedCars,
            'recentDeals' => $recentDeals,
            'upcomingAppointments' => $upcomingAppointments,
        ]);
    }
    
    /**
     * Toggle save/unsave a car for the customer
     */
    public function toggleSavedCar(Request $request, Car $car)
    {
        $user = Auth::user();
        
        if ($user->hasSavedCar($car->id)) {
            $user->unsaveCar($car->id);
            return back()->with('success', 'Bil borttagen från sparade.');
        } else {
            $user->saveCar($car->id);
            return back()->with('success', 'Bil sparad!');
        }
    }
    
    /**
     * Get all saved cars for the customer
     */
    public function savedCars(): Response
    {
        $user = Auth::user();
        
        $savedCars = $user->savedCars()
            ->published()
            ->with(['images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->paginate(12)
            ->through(function ($car) {
                return [
                    'id' => $car->id,
                    'make' => $car->make,
                    'model' => $car->model,
                    'variant' => $car->variant,
                    'year' => $car->year,
                    'price' => $car->price,
                    'mileage' => $car->mileage,
                    'fuel_type' => $car->fuel_type,
                    'transmission' => $car->transmission,
                    'status' => $car->status,
                    'primary_image' => $car->images->first()?->image_path,
                    'created_at' => $car->created_at,
                ];
            });

        return Inertia::render('Customer/SavedCars', [
            'savedCars' => $savedCars,
        ]);
    }
}