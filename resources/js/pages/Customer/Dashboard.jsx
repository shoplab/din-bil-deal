import { Head, Link } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    Heart, 
    MessageSquare, 
    Calendar,
    Car,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    Eye,
    ArrowRight,
    Star
} from 'lucide-react';

export default function CustomerDashboard({ 
    user, 
    stats, 
    recentLeads, 
    savedCars, 
    recentDeals, 
    upcomingAppointments 
}) {
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

    const getLeadStatusBadgeVariant = (status) => {
        switch(status) {
            case 'new': return 'default';
            case 'contacted': return 'secondary'; 
            case 'qualified': return 'outline';
            case 'converted': return 'success';
            default: return 'destructive';
        }
    };

    const getDealStatusColor = (color) => {
        const colorMap = {
            'blue': 'bg-blue-500',
            'cyan': 'bg-cyan-500', 
            'yellow': 'bg-yellow-500',
            'orange': 'bg-orange-500',
            'purple': 'bg-purple-500',
            'pink': 'bg-pink-500',
            'indigo': 'bg-indigo-500',
            'violet': 'bg-violet-500',
            'amber': 'bg-amber-500',
            'lime': 'bg-lime-500',
            'green': 'bg-green-500',
            'red': 'bg-red-500',
        };
        return colorMap[color] || 'bg-gray-500';
    };

    return (
        <CustomerLayout title="Dashboard">
            <Head title="Min dashboard" />

            {/* Welcome Section */}
            <div className="mb-8">
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-blue-600 text-white text-lg">
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Välkommen tillbaka, {user.name.split(' ')[0]}!
                            </h1>
                            <p className="text-gray-600">
                                Här kan du hantera dina sparade bilar, förfrågningar och bokningar
                            </p>
                            {!user.email_verified_at && (
                                <div className="mt-3">
                                    <Badge variant="destructive" className="mr-2">
                                        E-post ej verifierad
                                    </Badge>
                                    <Button variant="outline" size="sm">
                                        Skicka verifieringsmail
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sparade bilar</CardTitle>
                        <Heart className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.saved_cars_count}</div>
                        <p className="text-xs text-muted-foreground">
                            bilar i dina favoriter
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Förfrågningar</CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.leads_count}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.active_leads_count} aktiva
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avslutade köp</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.converted_leads_count}</div>
                        <p className="text-xs text-muted-foreground">
                            genomförda bilköp
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bokade tider</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.appointments_count || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            kommande möten
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Senaste aktivitet
                        </CardTitle>
                        <CardDescription>
                            Dina senaste förfrågningar och uppdateringar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLeads?.length > 0 ? (
                                recentLeads.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant={getLeadStatusBadgeVariant(lead.status)}>
                                                    {lead.status_label}
                                                </Badge>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(lead.created_at)}
                                                </span>
                                            </div>
                                            {lead.car && (
                                                <p className="text-sm font-medium">
                                                    {lead.car.make} {lead.car.model} ({lead.car.year})
                                                </p>
                                            )}
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    Ingen aktivitet än. Börja genom att titta på bilar!
                                </p>
                            )}
                        </div>
                        {recentLeads?.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <Link href="/customer/inquiries">
                                    <Button variant="outline" className="w-full">
                                        Visa alla förfrågningar
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Deals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Car className="h-5 w-5" />
                            Pågående affärer
                        </CardTitle>
                        <CardDescription>
                            Status för dina bilköp
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentDeals?.length > 0 ? (
                                recentDeals.map((deal) => (
                                    <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-2 h-2 rounded-full ${getDealStatusColor(deal.status_color)}`}></div>
                                                <span className="text-sm font-medium">{deal.status_label}</span>
                                                <span className="text-xs text-gray-500">
                                                    {deal.probability}% chans
                                                </span>
                                            </div>
                                            {deal.car && (
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm">
                                                        {deal.car.make} {deal.car.model} ({deal.car.year})
                                                    </p>
                                                    <p className="text-sm font-semibold">
                                                        {formatPrice(deal.final_price || deal.vehicle_price)}
                                                    </p>
                                                </div>
                                            )}
                                            {deal.assigned_agent && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    Säljare: {deal.assigned_agent.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    Inga pågående affärer för tillfället
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Saved Cars Section */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Dina sparade bilar
                    </CardTitle>
                    <CardDescription>
                        Bilar du har sparat för senare
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {savedCars?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedCars.map((car) => (
                                <div key={car.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-video bg-gray-200 relative">
                                        {car.primary_image ? (
                                            <img 
                                                src={car.primary_image} 
                                                alt={`${car.make} ${car.model}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Car className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm">
                                            {car.make} {car.model} {car.variant && `${car.variant} `}({car.year})
                                        </h3>
                                        <p className="text-lg font-bold text-blue-600 mt-1">
                                            {formatPrice(car.price)}
                                        </p>
                                        <div className="text-xs text-gray-600 mt-1">
                                            {car.mileage.toLocaleString()} km • {car.fuel_type} • {car.transmission}
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <Link href={`/cars/${car.id}`}>
                                                <Button variant="outline" size="sm">
                                                    Visa bil
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="sm">
                                                <Heart className="h-4 w-4 text-red-500 fill-current" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">
                                Du har inga sparade bilar än
                            </p>
                            <Link href="/cars">
                                <Button>
                                    Utforska bilar
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                    
                    {savedCars?.length > 0 && (
                        <div className="mt-6 pt-4 border-t">
                            <Link href="/customer/saved-cars">
                                <Button variant="outline" className="w-full">
                                    Visa alla sparade bilar ({stats.saved_cars_count})
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Snabbåtgärder</CardTitle>
                    <CardDescription>
                        Vanliga uppgifter för att hantera ditt bilköp
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/cars">
                            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                                <Car className="h-6 w-6" />
                                <span className="text-sm">Bläddra bilar</span>
                            </Button>
                        </Link>
                        <Link href="/customer/saved-cars">
                            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                                <Heart className="h-6 w-6" />
                                <span className="text-sm">Sparade bilar</span>
                            </Button>
                        </Link>
                        <Link href="/customer/appointments">
                            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                                <Calendar className="h-6 w-6" />
                                <span className="text-sm">Boka tid</span>
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                                <MessageSquare className="h-6 w-6" />
                                <span className="text-sm">Kontakta oss</span>
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </CustomerLayout>
    );
}