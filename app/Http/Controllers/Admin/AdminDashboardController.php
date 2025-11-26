<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Lead;
use App\Models\Deal;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Get dashboard statistics
        $stats = [
            'cars' => [
                'total' => Car::count(),
                'available' => Car::available()->count(),
                'published' => Car::published()->count(),
                'featured' => Car::featured()->count(),
                'sold_this_month' => Car::where('status', 'sold')
                    ->whereMonth('updated_at', now()->month)
                    ->count(),
            ],
            'leads' => [
                'total' => Lead::count(),
                'new' => Lead::where('status', 'open')->count(),
                'qualified' => Lead::where('status', 'in_process')->count(),
                'contacted' => Lead::whereIn('status', ['in_process', 'waiting'])->count(),
                'converted' => Lead::where('status', 'done')->count(),
                'this_month' => Lead::whereMonth('created_at', now()->month)->count(),
            ],
            'deals' => [
                'total' => Deal::count(),
                'active' => Deal::whereIn('status', ['negotiation', 'contract', 'financing'])->count(),
                'closed_won' => Deal::where('status', 'closed_won')->count(),
                'closed_lost' => Deal::where('status', 'closed_lost')->count(),
                'total_value' => Deal::where('status', 'closed_won')->sum('final_price'),
                'pipeline_value' => Deal::whereNotIn('status', ['closed_won', 'closed_lost'])->sum('final_price'),
                'this_month_value' => Deal::where('status', 'closed_won')
                    ->whereMonth('updated_at', now()->month)
                    ->sum('final_price'),
            ],
            'users' => [
                'total' => User::count(),
                'admins' => User::where('role', 'admin')->count(),
                'customers' => User::where('role', 'customer')->count(),
                'active_today' => User::whereDate('last_login_at', today())->count(),
            ]
        ];

        // Recent activity
        $recentCars = Car::with('createdBy')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($car) {
                return [
                    'id' => $car->id,
                    'make' => $car->make,
                    'model' => $car->model,
                    'year' => $car->year,
                    'price' => $car->price,
                    'status' => $car->status,
                    'created_at' => $car->created_at,
                    'created_by' => $car->createdBy->name ?? 'System'
                ];
            });

        $recentLeads = Lead::with('assignedAgent')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'name' => $lead->name,
                    'email' => $lead->email,
                    'phone' => $lead->phone,
                    'status' => $lead->status,
                    'source' => $lead->source,
                    'created_at' => $lead->created_at,
                    'assigned_to' => $lead->assignedAgent->name ?? 'Unassigned'
                ];
            });

        $recentDeals = Deal::with(['lead', 'car', 'assignedAgent'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($deal) {
                return [
                    'id' => $deal->id,
                    'status' => $deal->status,
                    'deal_value' => $deal->final_price ?? $deal->vehicle_price ?? 0,
                    'probability' => $deal->probability,
                    'created_at' => $deal->created_at,
                    'lead_name' => $deal->lead->name ?? 'Unknown',
                    'car_info' => $deal->car ? "{$deal->car->make} {$deal->car->model}" : 'No car',
                    'assigned_to' => $deal->assignedAgent->name ?? 'Unassigned'
                ];
            });

        // Monthly trends (last 6 months)
        $monthlyStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthlyStats[] = [
                'month' => $date->format('M Y'),
                'leads' => Lead::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
                'deals' => Deal::where('status', 'closed_won')
                    ->whereYear('updated_at', $date->year)
                    ->whereMonth('updated_at', $date->month)
                    ->count(),
                'revenue' => Deal::where('status', 'closed_won')
                    ->whereYear('updated_at', $date->year)
                    ->whereMonth('updated_at', $date->month)
                    ->sum('final_price'),
                'cars_sold' => Car::where('status', 'sold')
                    ->whereYear('updated_at', $date->year)
                    ->whereMonth('updated_at', $date->month)
                    ->count(),
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentActivity' => [
                'cars' => $recentCars,
                'leads' => $recentLeads,
                'deals' => $recentDeals,
            ],
            'monthlyStats' => $monthlyStats,
        ]);
    }
}
