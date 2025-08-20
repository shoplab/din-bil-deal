import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
    Car,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Power,
    PowerOff,
    SortAsc,
    SortDesc,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function CarsIndex({ cars, filters, makes, statuses }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    const getStatusColor = (status) => {
        const colors = {
            'available': 'bg-green-100 text-green-800',
            'reserved': 'bg-yellow-100 text-yellow-800',
            'sold': 'bg-gray-100 text-gray-800',
            'maintenance': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            'available': 'Tillgänglig',
            'reserved': 'Reserverad',
            'sold': 'Såld',
            'maintenance': 'Underhåll'
        };
        return texts[status] || status;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.cars.index'), {
            ...filters,
            search: searchTerm
        });
    };

    const handleFilterChange = (key, value) => {
        // Convert "all" back to undefined for backend
        const filterValue = value === 'all' ? undefined : value;
        
        router.get(route('admin.cars.index'), {
            ...filters,
            [key]: filterValue,
            page: 1 // Reset to first page when filtering
        });
    };

    const handleSort = (sortBy) => {
        const newOrder = filters.sort === sortBy && filters.order === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.cars.index'), {
            ...filters,
            sort: sortBy,
            order: newOrder
        });
    };

    const handleTogglePublished = (car) => {
        router.patch(route('admin.cars.toggle-published', car.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Success message handled by backend
            }
        });
    };

    const handleDelete = (car) => {
        router.delete(route('admin.cars.destroy', car.id), {
            onSuccess: () => {
                // Success message handled by backend
            }
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AdminLayout title="Fordonshantering">
            <Head title="Fordon - Admin" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fordonshantering</h1>
                    <p className="text-gray-600">Hantera alla fordon i systemet</p>
                </div>
                <Link href={route('admin.cars.create')}>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Lägg till fordon
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Filter och sökning</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                placeholder="Sök efter märke, modell, år..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        
                        <Select 
                            value={filters.status || 'all'} 
                            onValueChange={(value) => handleFilterChange('status', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alla statusar</SelectItem>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {getStatusText(status)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select 
                            value={filters.make || 'all'} 
                            onValueChange={(value) => handleFilterChange('make', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Märke" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alla märken</SelectItem>
                                {makes.map((make) => (
                                    <SelectItem key={make} value={make}>
                                        {make}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select 
                            value={filters.published || 'all'} 
                            onValueChange={(value) => handleFilterChange('published', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Publicering" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alla</SelectItem>
                                <SelectItem value="yes">Publicerade</SelectItem>
                                <SelectItem value="no">Opublicerade</SelectItem>
                            </SelectContent>
                        </Select>
                    </form>
                </CardContent>
            </Card>

            {/* Cars Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        Fordon ({cars.total})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleSort('make')}
                                            className="font-semibold"
                                        >
                                            Fordon
                                            {filters.sort === 'make' && (
                                                filters.order === 'asc' ? 
                                                <SortAsc className="h-4 w-4 ml-1" /> : 
                                                <SortDesc className="h-4 w-4 ml-1" />
                                            )}
                                        </Button>
                                    </th>
                                    <th className="text-left p-4">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleSort('year')}
                                            className="font-semibold"
                                        >
                                            År
                                            {filters.sort === 'year' && (
                                                filters.order === 'asc' ? 
                                                <SortAsc className="h-4 w-4 ml-1" /> : 
                                                <SortDesc className="h-4 w-4 ml-1" />
                                            )}
                                        </Button>
                                    </th>
                                    <th className="text-left p-4">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleSort('price')}
                                            className="font-semibold"
                                        >
                                            Pris
                                            {filters.sort === 'price' && (
                                                filters.order === 'asc' ? 
                                                <SortAsc className="h-4 w-4 ml-1" /> : 
                                                <SortDesc className="h-4 w-4 ml-1" />
                                            )}
                                        </Button>
                                    </th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">Publicering</th>
                                    <th className="text-left p-4">Säljare</th>
                                    <th className="text-left p-4">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => handleSort('created_at')}
                                            className="font-semibold"
                                        >
                                            Skapad
                                            {filters.sort === 'created_at' && (
                                                filters.order === 'asc' ? 
                                                <SortAsc className="h-4 w-4 ml-1" /> : 
                                                <SortDesc className="h-4 w-4 ml-1" />
                                            )}
                                        </Button>
                                    </th>
                                    <th className="text-right p-4">Åtgärder</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center p-8 text-gray-500">
                                            <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>Inga fordon hittades</p>
                                            <p className="text-sm mt-2">Prova att ändra dina filterinställningar</p>
                                        </td>
                                    </tr>
                                ) : (
                                    cars.data.map((car) => (
                                        <tr key={car.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    {car.images.length > 0 ? (
                                                        <img
                                                            src={`/storage/${car.images[0]}`}
                                                            alt={`${car.make} ${car.model}`}
                                                            className="h-12 w-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center">
                                                            <Car className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{car.make} {car.model}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {car.mileage?.toLocaleString()} km • {car.fuel_type} • {car.transmission}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">{car.year}</td>
                                            <td className="p-4 font-medium">{formatPrice(car.price)}</td>
                                            <td className="p-4">
                                                <Badge className={getStatusColor(car.status)}>
                                                    {getStatusText(car.status)}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {car.published_at ? (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        Publicerad
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">
                                                        Opublicerad
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {car.created_by ? (
                                                    <div>
                                                        <p className="text-sm font-medium">{car.created_by.name}</p>
                                                        <p className="text-xs text-gray-500">{car.created_by.email}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {formatDate(car.created_at)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Åtgärder</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.cars.show', car.id)}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Visa
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.cars.edit', car.id)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Redigera
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        
                                                        <DropdownMenuItem 
                                                            onClick={() => handleTogglePublished(car)}
                                                        >
                                                            {car.published_at ? (
                                                                <>
                                                                    <PowerOff className="h-4 w-4 mr-2" />
                                                                    Avpublicera
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Power className="h-4 w-4 mr-2" />
                                                                    Publicera
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        
                                                        <DropdownMenuSeparator />

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem 
                                                                    onSelect={(e) => e.preventDefault()}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Ta bort
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Ta bort fordon</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Är du säker på att du vill ta bort {car.make} {car.model} ({car.year})? 
                                                                        Denna åtgärd kan inte ångras.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                                                    <AlertDialogAction 
                                                                        onClick={() => handleDelete(car)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Ta bort
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {cars.last_page > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-6 border-t">
                            <div className="text-sm text-gray-700">
                                Visar {cars.from} till {cars.to} av {cars.total} fordon
                            </div>
                            <div className="flex items-center space-x-2">
                                {cars.prev_page_url && (
                                    <Link href={cars.prev_page_url}>
                                        <Button variant="outline" size="sm">
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Föregående
                                        </Button>
                                    </Link>
                                )}
                                <span className="px-3 py-1 text-sm">
                                    Sida {cars.current_page} av {cars.last_page}
                                </span>
                                {cars.next_page_url && (
                                    <Link href={cars.next_page_url}>
                                        <Button variant="outline" size="sm">
                                            Nästa
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}