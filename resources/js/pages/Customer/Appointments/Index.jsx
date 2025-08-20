import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Car, 
    User, 
    CheckCircle, 
    XCircle,
    AlertCircle,
    Plus,
    Filter,
    Eye,
    Edit,
    MoreHorizontal
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function AppointmentsIndex({ appointments, stats, filter }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString('sv-SE', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    const getStatusBadgeVariant = (status) => {
        const variants = {
            'requested': 'secondary',
            'confirmed': 'default',
            'completed': 'success',
            'cancelled': 'destructive',
            'no_show': 'outline'
        };
        return variants[status] || 'secondary';
    };

    const handleFilterChange = (newFilter) => {
        router.get(route('customer.appointments.index'), { filter: newFilter }, {
            preserveState: true,
            replace: true
        });
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );

    const AppointmentCard = ({ appointment }) => {
        const dateTime = formatDateTime(appointment.appointment_date);
        
        return (
            <Card className="mb-4">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant={getStatusBadgeVariant(appointment.status)}>
                                    {appointment.status_label}
                                </Badge>
                                <Badge variant="outline">
                                    {appointment.type_label}
                                </Badge>
                                {appointment.is_upcoming && (
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                        Kommande
                                    </Badge>
                                )}
                                {appointment.is_overdue && (
                                    <Badge variant="destructive">
                                        Försenad
                                    </Badge>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date and Time */}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>{dateTime.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="h-4 w-4" />
                                    <span>{dateTime.time} ({appointment.duration_minutes} min)</span>
                                </div>
                                
                                {/* Location */}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span>
                                        {appointment.location === 'showroom' && 'Utställning'}
                                        {appointment.location === 'customer_address' && 'Kundens adress'}
                                        {appointment.location === 'other' && 'Annan plats'}
                                        {appointment.address && ` - ${appointment.address}`}
                                    </span>
                                </div>
                                
                                {/* Assigned Agent */}
                                {appointment.assigned_agent && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User className="h-4 w-4" />
                                        <span>{appointment.assigned_agent.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={route('customer.appointments.show', appointment.id)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Visa detaljer
                                    </Link>
                                </DropdownMenuItem>
                                {appointment.can_be_rescheduled && (
                                    <DropdownMenuItem>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Boka om
                                    </DropdownMenuItem>
                                )}
                                {appointment.can_be_cancelled && (
                                    <DropdownMenuItem className="text-red-600">
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Avboka
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                    {/* Car Information */}
                    {appointment.car && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Car className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <h4 className="font-medium">
                                            {appointment.car.make} {appointment.car.model} {appointment.car.variant && `${appointment.car.variant} `}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            Årsmodell {appointment.car.year} • {appointment.car.mileage?.toLocaleString()} km
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-blue-600">
                                        {formatPrice(appointment.car.price)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Messages */}
                    {appointment.customer_message && (
                        <div className="text-sm text-gray-600 italic mb-2">
                            <strong>Ditt meddelande:</strong> {appointment.customer_message}
                        </div>
                    )}
                    
                    {appointment.admin_notes && (
                        <div className="text-sm text-blue-600 bg-blue-50 rounded p-3">
                            <strong>Meddelande från oss:</strong> {appointment.admin_notes}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <CustomerLayout title="Mina bokningar">
            <Head title="Mina bokningar" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mina bokningar</h1>
                    <p className="text-gray-600 mt-1">
                        Hantera dina bokade tider för visningar och provkörningar
                    </p>
                </div>
                <Button asChild>
                    <Link href="/cars">
                        <Plus className="h-4 w-4 mr-2" />
                        Boka ny tid
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Totalt"
                    value={stats.total}
                    icon={Calendar}
                    color="text-gray-500"
                />
                <StatCard
                    title="Kommande"
                    value={stats.upcoming}
                    icon={Clock}
                    color="text-blue-500"
                />
                <StatCard
                    title="Väntar på bekräftelse"
                    value={stats.pending}
                    icon={AlertCircle}
                    color="text-yellow-500"
                />
                <StatCard
                    title="Genomförda"
                    value={stats.completed}
                    icon={CheckCircle}
                    color="text-green-500"
                />
            </div>

            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={handleFilterChange} className="mb-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="upcoming">Kommande</TabsTrigger>
                    <TabsTrigger value="pending">Väntande</TabsTrigger>
                    <TabsTrigger value="confirmed">Bekräftade</TabsTrigger>
                    <TabsTrigger value="past">Tidigare</TabsTrigger>
                    <TabsTrigger value="all">Alla</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-6">
                    {/* Appointments List */}
                    {appointments.data && appointments.data.length > 0 ? (
                        <div>
                            {appointments.data.map((appointment) => (
                                <AppointmentCard key={appointment.id} appointment={appointment} />
                            ))}
                            
                            {/* Pagination */}
                            {appointments.links && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Visar {appointments.from} - {appointments.to} av {appointments.total} bokningar
                                    </div>
                                    <div className="flex space-x-2">
                                        {appointments.links.map((link, index) => {
                                            if (link.url === null) return null;
                                            
                                            return (
                                                <Button
                                                    key={index}
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => router.get(link.url)}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-8">
                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {filter === 'upcoming' && 'Inga kommande bokningar'}
                                    {filter === 'pending' && 'Inga väntande bokningar'}
                                    {filter === 'confirmed' && 'Inga bekräftade bokningar'}
                                    {filter === 'past' && 'Inga tidigare bokningar'}
                                    {filter === 'all' && 'Inga bokningar ännu'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {filter === 'upcoming' && 'Du har inga kommande bokningar för tillfället.'}
                                    {filter === 'pending' && 'Alla dina bokningar har blivit behandlade.'}
                                    {filter === 'confirmed' && 'Du har inga bekräftade bokningar just nu.'}
                                    {filter === 'past' && 'Du har inga tidigare bokningar att visa.'}
                                    {filter === 'all' && 'Du har inte gjort några bokningar ännu.'}
                                </p>
                                <Button asChild>
                                    <Link href="/cars">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Boka din första tid
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </CustomerLayout>
    );
}