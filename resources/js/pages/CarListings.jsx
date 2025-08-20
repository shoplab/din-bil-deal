import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import CarCard from '@/components/CarCard';
import { 
    Search, 
    Filter, 
    ArrowUpDown,
    Grid3X3,
    List,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CarListings({ 
    cars = { data: [] }, 
    filters = {}, 
    pagination = {},
    makes = [],
    fuelTypes = [],
    priceRange = { min: 0, max: 2000000 }
}) {
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        search: filters.search || '',
        make: filters.make || '',
        priceMin: filters.priceMin || '',
        priceMax: filters.priceMax || '',
        yearMin: filters.yearMin || '',
        yearMax: filters.yearMax || '',
        fuelType: filters.fuelType || '',
        sortBy: filters.sortBy || 'created_at',
        sortOrder: filters.sortOrder || 'desc'
    });

    // Sample car data for demonstration
    const sampleCars = Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        make: ['Volvo', 'BMW', 'Audi', 'Mercedes-Benz', 'Toyota', 'Volkswagen'][index % 6],
        model: ['XC90', '3 Series', 'A4', 'C-Class', 'Camry', 'Golf'][index % 6],
        year: 2020 + (index % 4),
        price: 150000 + (index * 50000),
        mileage: 20000 + (index * 15000),
        fuel_type: ['Bensin', 'Diesel', 'Hybrid', 'El'][index % 4],
        location: ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala'][index % 4],
        featured: index < 3,
        rating: 4.5 + (index % 5) / 10,
        imageUrl: null,
        transmission: index % 2 === 0 ? 'Automat' : 'Manuell',
        description: 'Välskött bil i mycket bra skick med fullständig servicehistorik.'
    }));

    const displayCars = cars.data && cars.data.length > 0 ? cars.data : sampleCars;

    const handleFilterChange = (key, value) => {
        // Convert "all" values back to empty strings for backend compatibility
        const processedValue = value === "all" ? "" : value;
        setSearchFilters(prev => ({ ...prev, [key]: processedValue }));
    };

    const applyFilters = () => {
        router.get('/cars', searchFilters, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        const resetFilters = {
            search: '',
            make: '',
            priceMin: '',
            priceMax: '',
            yearMin: '',
            yearMax: '',
            fuelType: '',
            sortBy: 'created_at',
            sortOrder: 'desc'
        };
        setSearchFilters(resetFilters);
        router.get('/cars', resetFilters);
    };

    const handleSort = (sortBy) => {
        const newOrder = searchFilters.sortBy === sortBy && searchFilters.sortOrder === 'asc' ? 'desc' : 'asc';
        const newFilters = { ...searchFilters, sortBy, sortOrder: newOrder };
        setSearchFilters(newFilters);
        router.get('/cars', newFilters, { preserveState: true });
    };

    return (
        <MarketingLayout>
            <Head title="Bilar till salu - Din Bil Deal" />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Bilar till salu</h1>
                    <p className="text-muted-foreground">
                        Hitta din perfekta bil bland {(pagination.total || displayCars.length).toLocaleString()} verifierade bilar
                    </p>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className={cn(
                        "lg:col-span-1",
                        showFilters ? "block" : "hidden lg:block"
                    )}>
                        <Card className="sticky top-24">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold">Filter</h2>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={clearFilters}
                                        className="text-primary"
                                    >
                                        Rensa alla
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {/* Search */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Sök</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Sök bil, märke, modell..."
                                                value={searchFilters.search}
                                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {/* Make */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Märke</label>
                                        <Select
                                            value={searchFilters.make || "all"}
                                            onValueChange={(value) => handleFilterChange('make', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Alla märken" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Alla märken</SelectItem>
                                                <SelectItem value="Volvo">Volvo</SelectItem>
                                                <SelectItem value="BMW">BMW</SelectItem>
                                                <SelectItem value="Audi">Audi</SelectItem>
                                                <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                                                <SelectItem value="Toyota">Toyota</SelectItem>
                                                <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                                                <SelectItem value="Tesla">Tesla</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Prisintervall</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Från"
                                                value={searchFilters.priceMin}
                                                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Till"
                                                value={searchFilters.priceMax}
                                                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Year Range */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Årsmodell</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Select
                                                value={searchFilters.yearMin || "all"}
                                                onValueChange={(value) => handleFilterChange('yearMin', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Från" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Från</SelectItem>
                                                    {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                                                        <SelectItem key={year} value={year.toString()}>
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Select
                                                value={searchFilters.yearMax || "all"}
                                                onValueChange={(value) => handleFilterChange('yearMax', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Till" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Till</SelectItem>
                                                    {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                                                        <SelectItem key={year} value={year.toString()}>
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Fuel Type */}
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Bränsle</label>
                                        <Select
                                            value={searchFilters.fuelType || "all"}
                                            onValueChange={(value) => handleFilterChange('fuelType', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Alla bränslen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Alla bränslen</SelectItem>
                                                <SelectItem value="petrol">Bensin</SelectItem>
                                                <SelectItem value="diesel">Diesel</SelectItem>
                                                <SelectItem value="hybrid">Hybrid</SelectItem>
                                                <SelectItem value="electric">El</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator />

                                    <Button onClick={applyFilters} className="w-full">
                                        <Filter className="mr-2 h-4 w-4" />
                                        Tillämpa filter
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="lg:hidden"
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filter
                                </Button>
                                
                                <span className="text-sm text-muted-foreground">
                                    Visar {displayCars.length} av {pagination.total || displayCars.length} bilar
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Sort */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Sortera:</span>
                                    <Select
                                        value={`${searchFilters.sortBy}-${searchFilters.sortOrder}`}
                                        onValueChange={(value) => {
                                            const [sortBy, sortOrder] = value.split('-');
                                            handleFilterChange('sortBy', sortBy);
                                            handleFilterChange('sortOrder', sortOrder);
                                            applyFilters();
                                        }}
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="created_at-desc">Senast tillagda</SelectItem>
                                            <SelectItem value="price-asc">Pris: Lägst först</SelectItem>
                                            <SelectItem value="price-desc">Pris: Högst först</SelectItem>
                                            <SelectItem value="year-desc">År: Nyast först</SelectItem>
                                            <SelectItem value="year-asc">År: Äldst först</SelectItem>
                                            <SelectItem value="mileage-asc">Mil: Lägst först</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* View Toggle */}
                                <div className="flex border rounded-md">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="rounded-r-none"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className="rounded-l-none"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Car Grid/List */}
                        <div className={cn(
                            "grid gap-6",
                            viewMode === 'grid' 
                                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                                : "grid-cols-1"
                        )}>
                            {displayCars.map((car) => (
                                <CarCard
                                    key={car.id}
                                    car={car}
                                    viewMode={viewMode}
                                    onCardClick={() => router.visit(`/cars/${car.id}`)}
                                    onFavoriteClick={(car) => {
                                        // Handle favorite logic here
                                        console.log('Favorite clicked for car:', car.id);
                                    }}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.last_page > 1 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex items-center space-x-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={pagination.current_page <= 1}
                                        onClick={() => {
                                            if (pagination.current_page > 1) {
                                                router.get('/cars', { ...searchFilters, page: pagination.current_page - 1 });
                                            }
                                        }}
                                    >
                                        Föregående
                                    </Button>
                                    
                                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Button 
                                                key={page}
                                                variant={pagination.current_page === page ? "default" : "outline"} 
                                                size="sm"
                                                onClick={() => router.get('/cars', { ...searchFilters, page })}
                                            >
                                                {page}
                                            </Button>
                                        );
                                    })}
                                    
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        disabled={pagination.current_page >= pagination.last_page}
                                        onClick={() => {
                                            if (pagination.current_page < pagination.last_page) {
                                                router.get('/cars', { ...searchFilters, page: pagination.current_page + 1 });
                                            }
                                        }}
                                    >
                                        Nästa
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MarketingLayout>
    );
}