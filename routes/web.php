<?php

use App\Http\Controllers\ProfileController;
use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $featuredCars = Car::published()
        ->available()
        ->featured()
        ->with('createdBy')
        ->orderBy('created_at', 'desc')
        ->limit(6)
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
                'location' => 'Stockholm', // Default for now
                'featured' => $car->featured,
                'rating' => 4.5 + (rand(0, 5) / 10), // Sample rating
                'description' => $car->description,
                'images' => []
            ];
        });

    return Inertia::render('MarketingHome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'cars' => [],
        'featuredCars' => $featuredCars,
    ]);
})->name('home');


// Marketing pages
Route::get('/cars', function () {
    $query = Car::published()->available()->with('createdBy');
    
    // Debug: Log the query
    $count = $query->count();
    \Log::info('Cars query count: ' . $count);
    
    if ($count === 0) {
        \Log::info('No cars found with published and available scopes');
        \Log::info('Total cars in database: ' . Car::count());
        \Log::info('Published cars: ' . Car::whereNotNull('published_at')->count());
        \Log::info('Available cars: ' . Car::where('status', 'available')->count());
    }

    // Apply filters
    $filters = request()->only(['search', 'make', 'priceMin', 'priceMax', 'yearMin', 'yearMax', 'fuelType']);
    
    if (request('search')) {
        $query->search(request('search'));
    }
    
    if (request('make')) {
        $query->byMake(request('make'));
    }
    
    if (request('priceMin') && request('priceMax')) {
        $query->inPriceRange((float) request('priceMin'), (float) request('priceMax'));
    }
    
    if (request('yearMin')) {
        $query->byYear((int) request('yearMin'), request('yearMax') ? (int) request('yearMax') : null);
    }
    
    if (request('fuelType')) {
        $query->byFuelType(request('fuelType'));
    }

    // Apply sorting
    $sortBy = request('sortBy', 'created_at');
    $sortOrder = request('sortOrder', 'desc');
    
    if ($sortBy === 'price') {
        $query->orderBy('price', $sortOrder);
    } elseif ($sortBy === 'year') {
        $query->orderBy('year', $sortOrder);
    } elseif ($sortBy === 'mileage') {
        $query->orderBy('mileage', $sortOrder);
    } else {
        $query->orderBy('created_at', $sortOrder);
    }

    $cars = $query->paginate(12)->through(function ($car) {
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
            'location' => 'Stockholm', // Default for now
            'featured' => $car->featured,
            'rating' => 4.5 + (rand(0, 5) / 10), // Sample rating
            'description' => $car->description,
            'images' => []
        ];
    });

    // Get available makes for filter dropdown
    $makes = Car::published()->available()
        ->distinct()
        ->orderBy('make')
        ->pluck('make')
        ->toArray();

    return Inertia::render('CarListings', [
        'cars' => $cars,
        'filters' => $filters,
        'pagination' => [
            'current_page' => $cars->currentPage(),
            'last_page' => $cars->lastPage(),
            'total' => $cars->total()
        ],
        'makes' => $makes,
        'fuelTypes' => ['petrol', 'diesel', 'hybrid', 'electric'],
        'priceRange' => ['min' => 0, 'max' => 2000000]
    ]);
});

Route::get('/cars/{id}', function ($id) {
    $car = Car::published()
        ->available()
        ->with('createdBy')
        ->findOrFail($id);

    // Increment view count
    $car->incrementViews();

    // Get similar cars
    $similarCars = Car::published()
        ->available()
        ->where('id', '!=', $car->id)
        ->where('make', $car->make)
        ->limit(4)
        ->get()
        ->map(function ($car) {
            return [
                'id' => $car->id,
                'make' => $car->make,
                'model' => $car->model,
                'year' => $car->year,
                'price' => $car->price,
                'mileage' => $car->mileage,
                'fuel_type' => $car->fuel_type,
                'location' => 'Stockholm'
            ];
        });

    $carData = [
        'id' => $car->id,
        'make' => $car->make,
        'model' => $car->model,
        'variant' => $car->variant,
        'year' => $car->year,
        'price' => $car->price,
        'original_price' => $car->original_price,
        'mileage' => $car->mileage,
        'fuel_type' => $car->fuel_type,
        'transmission' => $car->transmission,
        'location' => 'Stockholm',
        'featured' => $car->featured,
        'rating' => 4.5 + (rand(0, 5) / 10),
        'description' => $car->description,
        'features' => $car->features ?? [],
        'specifications' => [
            'engine' => $car->engine_size ? $car->engine_size . 'L' : '2.0L Turbo',
            'power' => $car->power_hp ? $car->power_hp . ' hk' : '200 hk',
            'torque' => '300 Nm',
            'topSpeed' => '200 km/h',
            'acceleration' => '7.5 s (0-100 km/h)',
            'fuelConsumption' => '0.6 l/100km',
            'electricRange' => $car->fuel_type === 'electric' ? '400 km' : '50 km',
            'co2Emissions' => '15 g/km',
            'drivetrain' => $car->drivetrain ?? 'FWD',
            'seats' => $car->seats ?? '5',
            'doors' => $car->doors ?? '5',
            'weight' => '1800 kg'
        ],
        'history' => [
            'owners' => $car->previous_owners ?? 1,
            'accidents' => $car->accident_history ? 1 : 0,
            'serviceRecords' => 5,
            'lastService' => '2024-01-15',
            'registrationDate' => $car->year . '-03-15',
            'nextInspection' => ($car->year + 3) . '-03-15'
        ],
        'financing' => [
            'monthlyPayment' => round($car->price / 120),
            'downPayment' => round($car->price * 0.2),
            'loanTerm' => 120,
            'interestRate' => 3.95
        ]
    ];

    $seller = [
        'name' => $car->createdBy->name ?? 'Säljare',
        'title' => 'Certifierad bilsäljare',
        'avatar' => null,
        'rating' => 4.8,
        'reviews' => rand(50, 200),
        'phone' => '08-123 456 78',
        'email' => $car->createdBy->email ?? 'info@dinbildeal.se',
        'dealership' => 'Din Bil Deal Stockholm'
    ];

    return Inertia::render('CarDetail', [
        'car' => $carData,
        'similarCars' => $similarCars,
        'seller' => $seller
    ]);
});

Route::get('/contact', function () {
    return Inertia::render('Contact');
});

Route::post('/contact', function () {
    // Handle contact form submission
    return redirect()->back()->with('success', 'Meddelande skickat!');
});

Route::get('/dashboard', function () {
    $user = auth()->user();
    
    // Redirect admin users to admin dashboard
    if ($user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    
    // Redirect customer users to customer dashboard
    if ($user->role === 'customer') {
        return redirect()->route('customer.dashboard');
    }
    
    // For other roles, show basic dashboard
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes
Route::middleware(['auth', App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [App\Http\Controllers\Admin\AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Cars Management
    Route::resource('cars', App\Http\Controllers\Admin\CarController::class);
    Route::patch('cars/{car}/toggle-published', [App\Http\Controllers\Admin\CarController::class, 'togglePublished'])->name('cars.toggle-published');
    
    // Leads Management
    Route::resource('leads', App\Http\Controllers\Admin\LeadController::class);
    Route::patch('leads/{lead}/mark-contacted', [App\Http\Controllers\Admin\LeadController::class, 'markContacted'])->name('leads.mark-contacted');
    Route::patch('leads/{lead}/update-status', [App\Http\Controllers\Admin\LeadController::class, 'updateStatus'])->name('leads.update-status');
    Route::patch('leads/{lead}/update-priority', [App\Http\Controllers\Admin\LeadController::class, 'updatePriority'])->name('leads.update-priority');
    
    // Deals Management
    Route::resource('deals', App\Http\Controllers\Admin\DealController::class);
    Route::get('deals-kanban', [App\Http\Controllers\Admin\DealController::class, 'kanban'])->name('deals.kanban');
    Route::get('deals-table', [App\Http\Controllers\Admin\DealController::class, 'table'])->name('deals.table');
    
    // Analytics
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('/', [App\Http\Controllers\Admin\AnalyticsController::class, 'index'])->name('index');
        Route::get('/sales', [App\Http\Controllers\Admin\AnalyticsController::class, 'sales'])->name('sales');
        Route::get('/leads', [App\Http\Controllers\Admin\AnalyticsController::class, 'leads'])->name('leads');
        Route::get('/inventory', [App\Http\Controllers\Admin\AnalyticsController::class, 'inventory'])->name('inventory');
    });

    // Users Management
    Route::resource('users', App\Http\Controllers\Admin\UserController::class);
    Route::post('users/{user}/reset-password', [App\Http\Controllers\Admin\UserController::class, 'resetPassword'])->name('users.reset-password');
    Route::patch('users/{user}/toggle-verification', [App\Http\Controllers\Admin\UserController::class, 'toggleVerification'])->name('users.toggle-verification');
    
    // Appointments Management
    Route::resource('appointments', App\Http\Controllers\Admin\AppointmentController::class);
    Route::patch('appointments/{appointment}/confirm', [App\Http\Controllers\Admin\AppointmentController::class, 'confirm'])->name('appointments.confirm');
    Route::patch('appointments/{appointment}/complete', [App\Http\Controllers\Admin\AppointmentController::class, 'complete'])->name('appointments.complete');
    Route::patch('appointments/{appointment}/cancel', [App\Http\Controllers\Admin\AppointmentController::class, 'cancel'])->name('appointments.cancel');
    Route::patch('appointments/{appointment}/mark-no-show', [App\Http\Controllers\Admin\AppointmentController::class, 'markNoShow'])->name('appointments.mark-no-show');
    Route::patch('appointments/{appointment}/reschedule', [App\Http\Controllers\Admin\AppointmentController::class, 'reschedule'])->name('appointments.reschedule');
    
    // Conversations Management
    Route::resource('conversations', App\Http\Controllers\Admin\ConversationController::class);
    Route::post('conversations/{conversation}/reply', [App\Http\Controllers\Admin\ConversationController::class, 'reply'])->name('conversations.reply');
    Route::patch('conversations/{conversation}/status', [App\Http\Controllers\Admin\ConversationController::class, 'updateStatus'])->name('conversations.update-status');
    Route::patch('conversations/{conversation}/priority', [App\Http\Controllers\Admin\ConversationController::class, 'updatePriority'])->name('conversations.update-priority');
    Route::patch('conversations/{conversation}/assign', [App\Http\Controllers\Admin\ConversationController::class, 'assign'])->name('conversations.assign');
    Route::patch('conversations/{conversation}/close', [App\Http\Controllers\Admin\ConversationController::class, 'close'])->name('conversations.close');
    Route::patch('conversations/{conversation}/reopen', [App\Http\Controllers\Admin\ConversationController::class, 'reopen'])->name('conversations.reopen');
});

// Customer Authentication Routes
Route::prefix('customer')->name('customer.')->group(function () {
    // Guest customer routes (login, register)
    Route::middleware('guest')->group(function () {
        Route::get('/register', [App\Http\Controllers\Auth\CustomerAuthController::class, 'showRegistrationForm'])->name('register');
        Route::post('/register', [App\Http\Controllers\Auth\CustomerAuthController::class, 'register']);
        Route::get('/login', [App\Http\Controllers\Auth\CustomerAuthController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [App\Http\Controllers\Auth\CustomerAuthController::class, 'login']);
    });
    
    // Authenticated customer routes
    Route::middleware([App\Http\Middleware\CustomerMiddleware::class])->group(function () {
        // Dashboard
        Route::get('/dashboard', [App\Http\Controllers\Customer\CustomerDashboardController::class, 'index'])->name('dashboard');
        
        // Saved Cars
        Route::get('/saved-cars', [App\Http\Controllers\Customer\CustomerDashboardController::class, 'savedCars'])->name('saved-cars');
        Route::post('/cars/{car}/toggle-saved', [App\Http\Controllers\Customer\CustomerDashboardController::class, 'toggleSavedCar'])->name('toggle-saved-car');
        
        // Appointments
        Route::get('/appointments', [App\Http\Controllers\Customer\AppointmentController::class, 'index'])->name('appointments.index');
        Route::get('/appointments/create/{car}', [App\Http\Controllers\Customer\AppointmentController::class, 'create'])->name('appointments.create');
        Route::post('/appointments/store', [App\Http\Controllers\Customer\AppointmentController::class, 'store'])->name('appointments.store');
        Route::get('/appointments/{appointment}', [App\Http\Controllers\Customer\AppointmentController::class, 'show'])->name('appointments.show');
        Route::post('/appointments/{appointment}/cancel', [App\Http\Controllers\Customer\AppointmentController::class, 'cancel'])->name('appointments.cancel');
        Route::post('/appointments/{appointment}/reschedule', [App\Http\Controllers\Customer\AppointmentController::class, 'reschedule'])->name('appointments.reschedule');
        Route::post('/appointments/time-slots', [App\Http\Controllers\Customer\AppointmentController::class, 'getTimeSlots'])->name('appointments.time-slots');
        
        // Messages
        Route::get('/messages', [App\Http\Controllers\Customer\MessageController::class, 'index'])->name('messages.index');
        Route::get('/messages/create', [App\Http\Controllers\Customer\MessageController::class, 'create'])->name('messages.create');
        Route::post('/messages', [App\Http\Controllers\Customer\MessageController::class, 'store'])->name('messages.store');
        Route::get('/messages/{conversation}', [App\Http\Controllers\Customer\MessageController::class, 'show'])->name('messages.show');
        Route::post('/messages/{conversation}/reply', [App\Http\Controllers\Customer\MessageController::class, 'reply'])->name('messages.reply');
        Route::get('/cars/{car}/messages/create', [App\Http\Controllers\Customer\MessageController::class, 'createFromCar'])->name('messages.create-from-car');
        
        // Profile Management
        Route::get('/profile', [App\Http\Controllers\Customer\ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [App\Http\Controllers\Customer\ProfileController::class, 'update'])->name('profile.update');
        Route::put('/profile/password', [App\Http\Controllers\Customer\ProfileController::class, 'updatePassword'])->name('profile.password');
        Route::post('/profile/send-verification', [App\Http\Controllers\Customer\ProfileController::class, 'sendVerification'])->name('profile.send-verification');
        Route::get('/profile/delete', [App\Http\Controllers\Customer\ProfileController::class, 'showDelete'])->name('profile.delete');
        Route::delete('/profile', [App\Http\Controllers\Customer\ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::get('/profile/download', [App\Http\Controllers\Customer\ProfileController::class, 'downloadData'])->name('profile.download');
        
        // Email Verification
        Route::get('/verify-email', [App\Http\Controllers\Auth\CustomerAuthController::class, 'showVerificationNotice'])->name('verification.notice');
        Route::post('/email/verification-notification', [App\Http\Controllers\Auth\CustomerAuthController::class, 'resendVerificationEmail'])->name('verification.send');
        
        // Logout
        Route::post('/logout', [App\Http\Controllers\Auth\CustomerAuthController::class, 'logout'])->name('logout');
    });
});

require __DIR__.'/auth.php';
