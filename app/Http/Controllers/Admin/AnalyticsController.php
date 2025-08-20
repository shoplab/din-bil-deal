<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Lead;
use App\Models\Deal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->get('period', '30'); // days
        $startDate = Carbon::now()->subDays((int) $period);

        // Overview stats
        $stats = [
            'total_cars' => Car::count(),
            'published_cars' => Car::published()->count(),
            'featured_cars' => Car::featured()->count(),
            'total_leads' => Lead::count(),
            'new_leads' => Lead::where('status', 'new')->count(),
            'converted_leads' => Lead::where('status', 'converted')->count(),
            'total_deals' => Deal::count(),
            'active_deals' => Deal::whereNotIn('status', ['closed_won', 'closed_lost'])->count(),
            'won_deals' => Deal::where('status', 'closed_won')->count(),
        ];

        // Recent activity
        $recentLeads = Lead::with('interestedCar')
            ->where('created_at', '>=', $startDate)
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($lead) {
                return [
                    'id' => $lead->id,
                    'name' => $lead->name,
                    'email' => $lead->email,
                    'status' => $lead->status,
                    'source' => $lead->source,
                    'created_at' => $lead->created_at,
                    'interested_car' => $lead->interestedCar ? [
                        'make' => $lead->interestedCar->make,
                        'model' => $lead->interestedCar->model,
                        'year' => $lead->interestedCar->year,
                    ] : null,
                ];
            });

        // Top performing cars (most viewed)
        $topCars = Car::published()
            ->available()
            ->orderBy('views', 'desc')
            ->take(10)
            ->get()
            ->map(function ($car) {
                return [
                    'id' => $car->id,
                    'make' => $car->make,
                    'model' => $car->model,
                    'year' => $car->year,
                    'price' => $car->price,
                    'views' => $car->views,
                ];
            });

        // Lead sources breakdown
        $leadSources = Lead::select('source', DB::raw('count(*) as total'))
            ->where('created_at', '>=', $startDate)
            ->groupBy('source')
            ->pluck('total', 'source')
            ->toArray();

        // Monthly trends (last 12 months)
        $monthlyLeads = [];
        $monthlyDeals = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthKey = $date->format('Y-m');
            
            $monthlyLeads[$monthKey] = Lead::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
                
            $monthlyDeals[$monthKey] = Deal::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
        }

        return Inertia::render('Admin/Analytics/Index', [
            'stats' => $stats,
            'recentLeads' => $recentLeads,
            'topCars' => $topCars,
            'leadSources' => $leadSources,
            'monthlyLeads' => $monthlyLeads,
            'monthlyDeals' => $monthlyDeals,
            'period' => $period,
        ]);
    }

    public function sales(Request $request)
    {
        $period = $request->get('period', '30');
        $startDate = Carbon::now()->subDays((int) $period);

        // Sales metrics
        $salesStats = [
            'total_revenue' => Deal::where('status', 'closed_won')->sum('final_price'),
            'period_revenue' => Deal::where('status', 'closed_won')
                ->where('closed_at', '>=', $startDate)
                ->sum('final_price'),
            'average_deal_value' => Deal::where('status', 'closed_won')->avg('final_price'),
            'conversion_rate' => $this->calculateConversionRate(),
            'total_deals' => Deal::count(),
            'won_deals' => Deal::where('status', 'closed_won')->count(),
            'lost_deals' => Deal::where('status', 'closed_lost')->count(),
            'pending_deals' => Deal::whereNotIn('status', ['closed_won', 'closed_lost'])->count(),
        ];

        // Deal stages breakdown
        $dealStages = Deal::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // Revenue by month (last 12 months)
        $monthlyRevenue = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthKey = $date->format('Y-m');
            
            $monthlyRevenue[$monthKey] = Deal::where('status', 'closed_won')
                ->whereYear('closed_at', $date->year)
                ->whereMonth('closed_at', $date->month)
                ->sum('final_price');
        }

        // Top sales by car make
        $salesByMake = Deal::join('cars', 'deals.car_id', '=', 'cars.id')
            ->where('deals.status', 'closed_won')
            ->select('cars.make', DB::raw('count(*) as total_sales'), DB::raw('sum(deals.final_price) as total_revenue'))
            ->groupBy('cars.make')
            ->orderBy('total_revenue', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('Admin/Analytics/Sales', [
            'salesStats' => $salesStats,
            'dealStages' => $dealStages,
            'monthlyRevenue' => $monthlyRevenue,
            'salesByMake' => $salesByMake,
            'period' => $period,
        ]);
    }

    public function leads(Request $request)
    {
        $period = $request->get('period', '30');
        $startDate = Carbon::now()->subDays((int) $period);

        // Lead metrics
        $leadStats = [
            'total_leads' => Lead::count(),
            'period_leads' => Lead::where('created_at', '>=', $startDate)->count(),
            'new_leads' => Lead::where('status', 'new')->count(),
            'contacted_leads' => Lead::where('status', 'contacted')->count(),
            'qualified_leads' => Lead::where('status', 'qualified')->count(),
            'converted_leads' => Lead::where('status', 'converted')->count(),
            'lost_leads' => Lead::where('status', 'lost')->count(),
            'conversion_rate' => $this->calculateLeadConversionRate(),
        ];

        // Lead status breakdown
        $leadStatuses = Lead::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // Lead sources performance
        $sourcePerformance = Lead::select('source', 
                DB::raw('count(*) as total_leads'),
                DB::raw('sum(case when status = "converted" then 1 else 0 end) as converted_leads'),
                DB::raw('avg(case when status = "converted" then 1.0 else 0.0 end) * 100 as conversion_rate'))
            ->groupBy('source')
            ->get()
            ->toArray();

        // Daily lead generation (last 30 days)
        $dailyLeads = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dateKey = $date->format('Y-m-d');
            
            $dailyLeads[$dateKey] = Lead::whereDate('created_at', $date)->count();
        }

        // Lead priority distribution
        $leadPriorities = Lead::select('priority', DB::raw('count(*) as total'))
            ->groupBy('priority')
            ->pluck('total', 'priority')
            ->toArray();

        return Inertia::render('Admin/Analytics/Leads', [
            'leadStats' => $leadStats,
            'leadStatuses' => $leadStatuses,
            'sourcePerformance' => $sourcePerformance,
            'dailyLeads' => $dailyLeads,
            'leadPriorities' => $leadPriorities,
            'period' => $period,
        ]);
    }

    public function inventory(Request $request)
    {
        // Inventory metrics
        $inventoryStats = [
            'total_cars' => Car::count(),
            'published_cars' => Car::published()->count(),
            'available_cars' => Car::available()->count(),
            'sold_cars' => Car::where('status', 'sold')->count(),
            'featured_cars' => Car::featured()->count(),
            'avg_price' => Car::published()->available()->avg('price'),
            'total_value' => Car::published()->available()->sum('price'),
        ];

        // Cars by make
        $carsByMake = Car::select('make', DB::raw('count(*) as total'))
            ->groupBy('make')
            ->orderBy('total', 'desc')
            ->get()
            ->toArray();

        // Cars by fuel type
        $carsByFuelType = Car::select('fuel_type', DB::raw('count(*) as total'))
            ->groupBy('fuel_type')
            ->pluck('total', 'fuel_type')
            ->toArray();

        // Cars by year range
        $carsByYear = Car::select(
                DB::raw('case 
                    when year >= 2020 then "2020+"
                    when year >= 2015 then "2015-2019"
                    when year >= 2010 then "2010-2014"
                    when year >= 2005 then "2005-2009"
                    else "Before 2005"
                end as year_range'),
                DB::raw('count(*) as total'))
            ->groupBy('year_range')
            ->pluck('total', 'year_range')
            ->toArray();

        // Price distribution
        $priceDistribution = Car::published()->available()
            ->select(
                DB::raw('case 
                    when price < 100000 then "Under 100k"
                    when price < 200000 then "100k-200k"
                    when price < 300000 then "200k-300k"
                    when price < 500000 then "300k-500k"
                    when price < 1000000 then "500k-1M"
                    else "Over 1M"
                end as price_range'),
                DB::raw('count(*) as total'))
            ->groupBy('price_range')
            ->pluck('total', 'price_range')
            ->toArray();

        // Most viewed cars
        $mostViewed = Car::published()
            ->available()
            ->orderBy('views', 'desc')
            ->take(20)
            ->get()
            ->map(function ($car) {
                return [
                    'id' => $car->id,
                    'make' => $car->make,
                    'model' => $car->model,
                    'year' => $car->year,
                    'price' => $car->price,
                    'views' => $car->views,
                    'created_at' => $car->created_at,
                ];
            });

        // Average days on market
        $avgDaysOnMarket = Car::published()
            ->available()
            ->selectRaw('avg(julianday("now") - julianday(created_at)) as avg_days')
            ->value('avg_days');

        return Inertia::render('Admin/Analytics/Inventory', [
            'inventoryStats' => $inventoryStats,
            'carsByMake' => $carsByMake,
            'carsByFuelType' => $carsByFuelType,
            'carsByYear' => $carsByYear,
            'priceDistribution' => $priceDistribution,
            'mostViewed' => $mostViewed,
            'avgDaysOnMarket' => round($avgDaysOnMarket, 1),
        ]);
    }

    private function calculateConversionRate()
    {
        $totalLeads = Lead::count();
        $convertedLeads = Lead::where('status', 'converted')->count();
        
        return $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 1) : 0;
    }

    private function calculateLeadConversionRate()
    {
        $totalLeads = Lead::count();
        $convertedLeads = Lead::where('status', 'converted')->count();
        
        return $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 2) : 0;
    }
}
