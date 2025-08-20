<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CarController extends Controller
{
    public function index(Request $request)
    {
        $query = Car::with('createdBy');

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('make')) {
            $query->where('make', $request->make);
        }

        if ($request->filled('published')) {
            if ($request->published === 'yes') {
                $query->published();
            } elseif ($request->published === 'no') {
                $query->whereNull('published_at');
            }
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $cars = $query->paginate(15)->through(function ($car) {
            return [
                'id' => $car->id,
                'make' => $car->make,
                'model' => $car->model,
                'year' => $car->year,
                'price' => $car->price,
                'status' => $car->status,
                'mileage' => $car->mileage,
                'fuel_type' => $car->fuel_type,
                'transmission' => $car->transmission,
                'published_at' => $car->published_at,
                'created_at' => $car->created_at,
                'created_by' => $car->createdBy ? [
                    'id' => $car->createdBy->id,
                    'name' => $car->createdBy->name,
                    'email' => $car->createdBy->email,
                ] : null,
                'images' => $car->images ? $car->images->take(1)->toArray() : [],
            ];
        });

        // Get filter options
        $makes = Car::distinct()->pluck('make')->sort()->values();
        $statuses = ['available', 'reserved', 'sold', 'maintenance'];

        return Inertia::render('Admin/Cars/Index', [
            'cars' => $cars,
            'filters' => $request->only(['search', 'status', 'make', 'published', 'sort', 'order']),
            'makes' => $makes,
            'statuses' => $statuses,
        ]);
    }

    public function create()
    {
        $users = User::where('role', 'admin')
                    ->orWhere('role', 'seller')
                    ->select('id', 'name', 'email')
                    ->get();

        return Inertia::render('Admin/Cars/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'price' => 'required|numeric|min:0',
            'mileage' => 'required|integer|min:0',
            'fuel_type' => 'required|in:gasoline,diesel,electric,hybrid,plugin_hybrid',
            'transmission' => 'required|in:manual,automatic,cvt',
            'body_type' => 'required|in:sedan,hatchback,wagon,suv,coupe,convertible,pickup,van',
            'color' => 'required|string|max:255',
            'interior_color' => 'nullable|string|max:255',
            'condition' => 'required|in:excellent,very_good,good,fair,poor',
            'status' => 'required|in:available,reserved,sold,maintenance',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'images' => 'nullable|array|max:20',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'published' => 'boolean',
            'created_by' => 'required|exists:users,id',
        ]);

        // Handle image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('cars', 'public');
                $imagePaths[] = $path;
            }
        }

        $validated['images'] = $imagePaths;
        $validated['published_at'] = $validated['published'] ? now() : null;
        unset($validated['published']);

        $car = Car::create($validated);

        return redirect()->route('admin.cars.show', $car)
                        ->with('success', 'Fordon skapat framgångsrikt!');
    }

    public function show(Car $car)
    {
        $car->load('createdBy');

        return Inertia::render('Admin/Cars/Show', [
            'car' => [
                'id' => $car->id,
                'make' => $car->make,
                'model' => $car->model,
                'year' => $car->year,
                'price' => $car->price,
                'mileage' => $car->mileage,
                'fuel_type' => $car->fuel_type,
                'transmission' => $car->transmission,
                'body_type' => $car->body_type,
                'color' => $car->color,
                'interior_color' => $car->interior_color,
                'condition' => $car->condition,
                'status' => $car->status,
                'description' => $car->description,
                'features' => $car->features ?? [],
                'images' => $car->images ?? [],
                'published_at' => $car->published_at,
                'created_at' => $car->created_at,
                'updated_at' => $car->updated_at,
                'created_by' => $car->createdBy ? [
                    'id' => $car->createdBy->id,
                    'name' => $car->createdBy->name,
                    'email' => $car->createdBy->email,
                ] : null,
            ]
        ]);
    }

    public function edit(Car $car)
    {
        $users = User::where('role', 'admin')
                    ->orWhere('role', 'seller')
                    ->select('id', 'name', 'email')
                    ->get();

        return Inertia::render('Admin/Cars/Edit', [
            'car' => [
                'id' => $car->id,
                'make' => $car->make,
                'model' => $car->model,
                'year' => $car->year,
                'price' => $car->price,
                'mileage' => $car->mileage,
                'fuel_type' => $car->fuel_type,
                'transmission' => $car->transmission,
                'body_type' => $car->body_type,
                'color' => $car->color,
                'interior_color' => $car->interior_color,
                'condition' => $car->condition,
                'status' => $car->status,
                'description' => $car->description,
                'features' => $car->features ?? [],
                'images' => $car->images ?? [],
                'published_at' => $car->published_at,
                'created_by' => $car->created_by,
            ],
            'users' => $users,
        ]);
    }

    public function update(Request $request, Car $car)
    {
        $validated = $request->validate([
            'make' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'price' => 'required|numeric|min:0',
            'mileage' => 'required|integer|min:0',
            'fuel_type' => 'required|in:gasoline,diesel,electric,hybrid,plugin_hybrid',
            'transmission' => 'required|in:manual,automatic,cvt',
            'body_type' => 'required|in:sedan,hatchback,wagon,suv,coupe,convertible,pickup,van',
            'color' => 'required|string|max:255',
            'interior_color' => 'nullable|string|max:255',
            'condition' => 'required|in:excellent,very_good,good,fair,poor',
            'status' => 'required|in:available,reserved,sold,maintenance',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'new_images' => 'nullable|array|max:20',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'existing_images' => 'nullable|array',
            'published' => 'boolean',
            'created_by' => 'required|exists:users,id',
        ]);

        // Handle existing images
        $existingImages = $validated['existing_images'] ?? [];
        
        // Handle new image uploads
        $newImagePaths = [];
        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $image) {
                $path = $image->store('cars', 'public');
                $newImagePaths[] = $path;
            }
        }

        // Combine existing and new images
        $allImages = array_merge($existingImages, $newImagePaths);
        $validated['images'] = $allImages;

        // Handle published status
        if ($validated['published'] && !$car->published_at) {
            $validated['published_at'] = now();
        } elseif (!$validated['published']) {
            $validated['published_at'] = null;
        }

        unset($validated['published'], $validated['new_images'], $validated['existing_images']);

        $car->update($validated);

        return redirect()->route('admin.cars.show', $car)
                        ->with('success', 'Fordon uppdaterat framgångsrikt!');
    }

    public function destroy(Car $car)
    {
        // Delete associated images
        if ($car->images) {
            foreach ($car->images as $imagePath) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        $car->delete();

        return redirect()->route('admin.cars.index')
                        ->with('success', 'Fordon borttaget framgångsrikt!');
    }

    public function togglePublished(Car $car)
    {
        $car->update([
            'published_at' => $car->published_at ? null : now()
        ]);

        $status = $car->published_at ? 'publicerat' : 'avpublicerat';
        
        return back()->with('success', "Fordon {$status} framgångsrikt!");
    }
}
