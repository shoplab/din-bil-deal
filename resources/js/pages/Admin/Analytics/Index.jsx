import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    BarChart3,
    Car,
    Users,
    TrendingUp,
    DollarSign,
    Activity,
    Target,
    Eye,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Minus
} from 'lucide-react';
import { useState } from 'react';

export default function AnalyticsIndex({ 
    stats, 
    recentLeads, 
    topCars, 
    leadSources, 
    monthlyLeads, 
    monthlyDeals, 
    period = '30' 
}) {
    const [selectedPeriod, setSelectedPeriod] = useState(period);

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num?.toString() || '0';
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

    const getTrendIcon = (current, previous) => {
        if (current > previous) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
        if (current < previous) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
        return <Minus className="h-4 w-4 text-gray-400" />;
    };

    const getSourceText = (source) => {
        const texts = {
            'website': 'Webbplats',
            'phone': 'Telefon',
            'email': 'E-post',
            'social_media': 'Sociala medier',
            'referral': 'Hänvisning',
            'advertising': 'Annonsering'
        };
        return texts[source] || source;
    };

    const handlePeriodChange = (newPeriod) => {
        setSelectedPeriod(newPeriod);
        window.location.href = `?period=${newPeriod}`;
    };

    return (
        <AdminLayout title="Analytics Dashboard">
            <Head title="Analytics - Admin" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600">Översikt över affärsresultat och prestanda</p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Välj period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Senaste 7 dagarna</SelectItem>
                            <SelectItem value="30">Senaste 30 dagarna</SelectItem>
                            <SelectItem value="90">Senaste 90 dagarna</SelectItem>
                            <SelectItem value="365">Senaste året</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Totalt bilar</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_cars}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.published_cars} publicerade
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Totalt leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_leads}</div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{stats.new_leads} nya</span>
                            <span>•</span>
                            <span>{stats.converted_leads} konverterade</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Aktiva affärer</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active_deals}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.won_deals} vunna av {stats.total_deals} totalt
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Konverteringsgrad</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.total_leads > 0 ? 
                                ((stats.converted_leads / stats.total_leads) * 100).toFixed(1) : 0
                            }%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            leads till kunder
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Leads */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Senaste leads
                        </CardTitle>
                        <CardDescription>
                            Nyligen skapade leads (senaste {selectedPeriod} dagarna)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentLeads?.length > 0 ? (
                                recentLeads.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium">{lead.name}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>{getSourceText(lead.source)}</span>
                                                <span>•</span>
                                                <span>{formatDate(lead.created_at)}</span>
                                            </div>
                                            {lead.interested_car && (
                                                <p className="text-sm text-gray-600">
                                                    Intresserad av: {lead.interested_car.make} {lead.interested_car.model} ({lead.interested_car.year})
                                                </p>
                                            )}
                                        </div>
                                        <Badge variant={
                                            lead.status === 'new' ? 'default' :
                                            lead.status === 'contacted' ? 'secondary' :
                                            lead.status === 'qualified' ? 'outline' :
                                            lead.status === 'converted' ? 'success' : 'destructive'
                                        }>
                                            {lead.status === 'new' ? 'Ny' :
                                             lead.status === 'contacted' ? 'Kontaktad' :
                                             lead.status === 'qualified' ? 'Kvalificerad' :
                                             lead.status === 'converted' ? 'Konverterad' : 'Förlorad'}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">Inga leads hittades för denna period</p>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <Link href="/admin/leads">
                                <Button variant="outline" className="w-full">
                                    Visa alla leads
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Performing Cars */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Mest visade bilar
                        </CardTitle>
                        <CardDescription>
                            Bilar med flest visningar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topCars?.length > 0 ? (
                                topCars.map((car, index) => (
                                    <div key={car.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium">{car.make} {car.model}</p>
                                                <p className="text-sm text-gray-500">
                                                    {car.year} • {formatPrice(car.price)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{car.views}</p>
                                            <p className="text-xs text-gray-500">visningar</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">Ingen data tillgänglig</p>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <Link href="/admin/cars">
                                <Button variant="outline" className="w-full">
                                    Hantera bilar
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Sources */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lead-källor</CardTitle>
                        <CardDescription>
                            Fördelning av lead-källor (senaste {selectedPeriod} dagarna)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {Object.entries(leadSources || {}).map(([source, count]) => (
                                <div key={source} className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{getSourceText(source)}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full" 
                                                style={{ 
                                                    width: `${Math.max(10, (count / Math.max(...Object.values(leadSources))) * 100)}%` 
                                                }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Snabbåtgärder</CardTitle>
                        <CardDescription>
                            Vanliga administrativa uppgifter
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/admin/cars/create">
                                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                                    <Car className="h-6 w-6" />
                                    <span className="text-sm">Lägg till bil</span>
                                </Button>
                            </Link>
                            <Link href="/admin/leads/create">
                                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                                    <Users className="h-6 w-6" />
                                    <span className="text-sm">Lägg till lead</span>
                                </Button>
                            </Link>
                            <Link href="/admin/analytics/sales">
                                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                                    <DollarSign className="h-6 w-6" />
                                    <span className="text-sm">Försäljning</span>
                                </Button>
                            </Link>
                            <Link href="/admin/analytics/inventory">
                                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center gap-2">
                                    <BarChart3 className="h-6 w-6" />
                                    <span className="text-sm">Lager</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}