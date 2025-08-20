import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Car,
    Users,
    Target,
    TrendingUp,
    TrendingDown,
    Plus,
    Eye,
    BarChart3,
    DollarSign,
    Activity,
    UserCheck,
    Clock,
    CheckCircle,
    AlertCircle,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard({ stats, recentActivity, monthlyStats }) {
    const statCards = [
        {
            title: 'Totalt antal fordon',
            value: stats.cars.total,
            change: '+12%',
            changeType: 'positive',
            icon: Car,
            href: '/admin/cars',
            subtitle: `${stats.cars.available} tillgängliga • ${stats.cars.published} publicerade`
        },
        {
            title: 'Aktiva leads',
            value: stats.leads.total,
            change: '+23%',
            changeType: 'positive',
            icon: Users,
            href: '/admin/leads',
            subtitle: `${stats.leads.new} nya • ${stats.leads.qualified} kvalificerade`
        },
        {
            title: 'Pågående affärer',
            value: stats.deals.active,
            change: '+8%',
            changeType: 'positive',
            icon: Target,
            href: '/admin/deals',
            subtitle: `${Math.round(stats.deals.pipeline_value / 1000)}k SEK i pipeline`
        },
        {
            title: 'Försäljning denna månad',
            value: `${Math.round(stats.deals.this_month_value / 1000)}k`,
            change: '+15%',
            changeType: 'positive',
            icon: TrendingUp,
            href: '/admin/analytics/sales',
            subtitle: `${stats.cars.sold_this_month} fordon sålda`
        }
    ];

    const getStatusColor = (status) => {
        const colors = {
            'new': 'bg-blue-100 text-blue-800',
            'qualified': 'bg-green-100 text-green-800',
            'contacted': 'bg-yellow-100 text-yellow-800',
            'converted': 'bg-purple-100 text-purple-800',
            'available': 'bg-green-100 text-green-800',
            'reserved': 'bg-yellow-100 text-yellow-800',
            'sold': 'bg-gray-100 text-gray-800',
            'negotiating': 'bg-blue-100 text-blue-800',
            'contract_review': 'bg-yellow-100 text-yellow-800',
            'financing': 'bg-orange-100 text-orange-800',
            'closed_won': 'bg-green-100 text-green-800',
            'closed_lost': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('sv-SE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard - Admin" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <stat.icon className="h-8 w-8 text-primary" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {stat.title}
                                        </dt>
                                        <dd className="flex items-baseline">
                                            <div className="text-2xl font-semibold text-gray-900">
                                                {stat.value ? stat.value.toLocaleString() : '0'}
                                            </div>
                                            <div className={cn(
                                                "ml-2 flex items-baseline text-sm font-semibold",
                                                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                            )}>
                                                {stat.changeType === 'positive' ? (
                                                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4 mr-1" />
                                                ) : (
                                                    <TrendingDown className="self-center flex-shrink-0 h-4 w-4 mr-1" />
                                                )}
                                                {stat.change}
                                            </div>
                                        </dd>
                                        <dd className="text-sm text-gray-600 mt-1">
                                            {stat.subtitle}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Link href={stat.href}>
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Visa detaljer
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Snabbåtgärder</CardTitle>
                        <CardDescription>De vanligaste åtgärderna du utför</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/admin/cars/create">
                                <Button variant="outline" className="w-full h-20 flex flex-col">
                                    <Plus className="h-6 w-6 mb-2" />
                                    Lägg till fordon
                                </Button>
                            </Link>
                            <Link href="/admin/leads">
                                <Button variant="outline" className="w-full h-20 flex flex-col">
                                    <Users className="h-6 w-6 mb-2" />
                                    Hantera leads
                                </Button>
                            </Link>
                            <Link href="/admin/deals/create">
                                <Button variant="outline" className="w-full h-20 flex flex-col">
                                    <Target className="h-6 w-6 mb-2" />
                                    Skapa affär
                                </Button>
                            </Link>
                            <Link href="/admin/analytics">
                                <Button variant="outline" className="w-full h-20 flex flex-col">
                                    <BarChart3 className="h-6 w-6 mb-2" />
                                    Visa rapporter
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Cars */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Senaste fordon</CardTitle>
                        <Link href="/admin/cars">
                            <Button variant="ghost" size="sm">
                                Visa alla
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.cars.map((car) => (
                                <div key={car.id} className="flex items-center space-x-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {car.make} {car.model} {car.year}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {car.price ? car.price.toLocaleString() : '0'} SEK • {formatDate(car.created_at)}
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(car.status)}>
                                        {car.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Leads */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Senaste leads</CardTitle>
                        <Link href="/admin/leads">
                            <Button variant="ghost" size="sm">
                                Visa alla
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.leads.map((lead) => (
                                <div key={lead.id} className="flex items-center space-x-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {lead.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {lead.source} • {formatDate(lead.created_at)}
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(lead.status)}>
                                        {lead.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Deals */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-base font-medium">Senaste affärer</CardTitle>
                        <Link href="/admin/deals">
                            <Button variant="ghost" size="sm">
                                Visa alla
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.deals.map((deal) => (
                                <div key={deal.id} className="flex items-center space-x-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {deal.title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {deal.deal_value ? deal.deal_value.toLocaleString() : '0'} SEK • {formatDate(deal.created_at)}
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(deal.stage)}>
                                        {deal.stage}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Monthly Trends Chart Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle>Månatlig utveckling</CardTitle>
                    <CardDescription>Översikt över leads, affärer och försäljning senaste 6 månaderna</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                        <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Chart kommer att implementeras här</p>
                            <p className="text-sm text-gray-400 mt-2">
                                Data: {monthlyStats.length} månader tillgänglig
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}