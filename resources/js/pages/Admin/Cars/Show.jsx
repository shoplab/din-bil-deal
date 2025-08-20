import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    ArrowLeft,
    Edit,
    Trash2,
    Power,
    PowerOff,
    MoreHorizontal,
    Calendar,
    User,
    MapPin,
    Fuel,
    Settings,
    Palette,
    Shield,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useState } from 'react';

export default function CarShow({ car }) {
    const [selectedImage, setSelectedImage] = useState(0);

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

    const getConditionText = (condition) => {
        const texts = {
            'excellent': 'Utmärkt',
            'very_good': 'Mycket bra',
            'good': 'Bra',
            'fair': 'Godtagbar',
            'poor': 'Dålig'
        };
        return texts[condition] || condition;
    };

    const getFuelTypeText = (fuelType) => {
        const texts = {
            'gasoline': 'Bensin',
            'diesel': 'Diesel',
            'electric': 'El',
            'hybrid': 'Hybrid',
            'plugin_hybrid': 'Laddhybrid'
        };
        return texts[fuelType] || fuelType;
    };

    const getTransmissionText = (transmission) => {
        const texts = {
            'manual': 'Manuell',
            'automatic': 'Automat',
            'cvt': 'CVT'
        };
        return texts[transmission] || transmission;
    };

    const getBodyTypeText = (bodyType) => {
        const texts = {
            'sedan': 'Sedan',
            'hatchback': 'Halvkombi',
            'wagon': 'Kombi',
            'suv': 'SUV',
            'coupe': 'Coupé',
            'convertible': 'Cabriolet',
            'pickup': 'Pickup',
            'van': 'Skåpbil'
        };
        return texts[bodyType] || bodyType;
    };

    const handleTogglePublished = () => {
        router.patch(route('admin.cars.toggle-published', car.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Success message handled by backend
            }
        });
    };

    const handleDelete = () => {
        router.delete(route('admin.cars.destroy', car.id), {
            onSuccess: () => {
                // Redirect handled by backend
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout title={`${car.make} ${car.model}`}>
            <Head title={`${car.make} ${car.model} - Admin`} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.cars.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Tillbaka
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {car.make} {car.model} ({car.year})
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(car.status)}>
                                {getStatusText(car.status)}
                            </Badge>
                            {car.published_at ? (
                                <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Publicerad
                                </Badge>
                            ) : (
                                <Badge variant="outline">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Opublicerad
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <MoreHorizontal className="h-4 w-4 mr-2" />
                            Åtgärder
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Åtgärder</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem asChild>
                            <Link href={route('admin.cars.edit', car.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Redigera
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={handleTogglePublished}>
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
                                        onClick={handleDelete}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Ta bort
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Images */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bilder</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {car.images && car.images.length > 0 ? (
                                <div>
                                    {/* Main Image */}
                                    <div className="mb-4">
                                        <img
                                            src={`/storage/${car.images[selectedImage]}`}
                                            alt={`${car.make} ${car.model}`}
                                            className="w-full h-96 object-cover rounded-lg"
                                        />
                                    </div>
                                    
                                    {/* Thumbnail Navigation */}
                                    {car.images.length > 1 && (
                                        <div className="grid grid-cols-6 gap-2">
                                            {car.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`relative rounded-lg overflow-hidden ${
                                                        selectedImage === index ? 'ring-2 ring-blue-500' : ''
                                                    }`}
                                                >
                                                    <img
                                                        src={`/storage/${image}`}
                                                        alt={`${car.make} ${car.model} ${index + 1}`}
                                                        className="w-full h-16 object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                                    <div className="text-center">
                                        <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">Inga bilder tillgängliga</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Description */}
                    {car.description && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Beskrivning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 whitespace-pre-wrap">{car.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Features */}
                    {car.features && car.features.length > 0 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Utrustning och funktioner</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {car.features.map((feature, index) => (
                                        <Badge key={index} variant="secondary">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Details Sidebar */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Grundinformation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center pb-4 border-b">
                                <div className="text-3xl font-bold text-green-600">
                                    {formatPrice(car.price)}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">År:</span>
                                    <span className="font-medium">{car.year}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Settings className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Mätarställning:</span>
                                    <span className="font-medium">{car.mileage?.toLocaleString()} km</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Fuel className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Bränsle:</span>
                                    <span className="font-medium">{getFuelTypeText(car.fuel_type)}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Settings className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Växellåda:</span>
                                    <span className="font-medium">{getTransmissionText(car.transmission)}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Car className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Karosstyp:</span>
                                    <span className="font-medium">{getBodyTypeText(car.body_type)}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Palette className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Färg:</span>
                                    <span className="font-medium">{car.color}</span>
                                </div>

                                {car.interior_color && (
                                    <div className="flex items-center gap-3">
                                        <Palette className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Inredning:</span>
                                        <span className="font-medium">{car.interior_color}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Shield className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">Skick:</span>
                                    <span className="font-medium">{getConditionText(car.condition)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Seller Info */}
                    {car.created_by && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Säljare</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <User className="h-8 w-8 text-gray-400" />
                                    <div>
                                        <p className="font-medium">{car.created_by.name}</p>
                                        <p className="text-sm text-gray-500">{car.created_by.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Timestamps */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tidsstämplar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Skapad:</p>
                                <p className="font-medium">{formatDate(car.created_at)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Uppdaterad:</p>
                                <p className="font-medium">{formatDate(car.updated_at)}</p>
                            </div>

                            {car.published_at && (
                                <div>
                                    <p className="text-sm text-gray-600">Publicerad:</p>
                                    <p className="font-medium">{formatDate(car.published_at)}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}