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
    Users,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Phone,
    Mail,
    MessageSquare,
    Star,
    Clock,
    SortAsc,
    SortDesc,
    ChevronLeft,
    ChevronRight,
    Target,
    TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function LeadsIndex({ leads, filters, statuses, sources, priorities }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    const getStatusColor = (status) => {
        const colors = {
            'open': 'bg-blue-100 text-blue-800',
            'in_process': 'bg-yellow-100 text-yellow-800',
            'waiting': 'bg-orange-100 text-orange-800',
            'finance': 'bg-purple-100 text-purple-800',
            'done': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const texts = {
            'open': 'Öppen',
            'in_process': 'Pågår',
            'waiting': 'Väntar',
            'finance': 'Finansiering',
            'done': 'Klar',
            'cancelled': 'Avbruten'
        };
        return texts[status] || status;
    };

    const getPriorityColor = (priority) => {
        const colors = {
            1: 'bg-red-100 text-red-800',
            2: 'bg-yellow-100 text-yellow-800',
            3: 'bg-gray-100 text-gray-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityText = (priority) => {
        const texts = {
            1: 'Hög',
            2: 'Medium',
            3: 'Låg'
        };
        return texts[priority] || priority;
    };

    const getSourceText = (source) => {
        const texts = {
            'needs_analysis': 'Behovsanalys',
            'car_deal_request': 'Bilaffär förfrågan',
            'sell_car': 'Sälja bil',
            'website_contact': 'Webbplats kontakt'
        };
        return texts[source] || source;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.leads.index'), {
            ...filters,
            search: searchTerm
        });
    };

    const handleFilterChange = (key, value) => {
        router.get(route('admin.leads.index'), {
            ...filters,
            [key]: value,
            page: 1 // Reset to first page when filtering
        });
    };

    const handleSort = (sortBy) => {
        const newOrder = filters.sort === sortBy && filters.order === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.leads.index'), {
            ...filters,
            sort: sortBy,
            order: newOrder
        });
    };

    const handleMarkContacted = (lead) => {
        router.patch(route('admin.leads.mark-contacted', lead.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Success message handled by backend
            }
        });
    };

    const handleUpdateStatus = (lead, status) => {
        router.patch(route('admin.leads.update-status', lead.id), { status }, {
            preserveScroll: true,
            onSuccess: () => {
                // Success message handled by backend
            }
        });
    };

    const handleUpdatePriority = (lead, priority) => {
        router.patch(route('admin.leads.update-priority', lead.id), { priority }, {
            preserveScroll: true,
            onSuccess: () => {
                // Success message handled by backend
            }
        });
    };

    const handleDelete = (lead) => {
        router.delete(route('admin.leads.destroy', lead.id), {
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
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="Lead-hantering">
            <Head title="Leads - Admin" />

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lead-hantering</h1>
                    <p className="text-gray-600">Hantera alla leads och potentiella kunder</p>
                </div>
                <Link href={route('admin.leads.create')}>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Lägg till lead
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Filter och sökning</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                placeholder="Sök efter namn, e-post, telefon..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        
                        <Select 
                            value={filters.status || 'all'} 
                            onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}
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
                            value={filters.priority || 'all'} 
                            onValueChange={(value) => handleFilterChange('priority', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Prioritet" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alla prioriteter</SelectItem>
                                {priorities.map((priority) => (
                                    <SelectItem key={priority} value={priority.toString()}>
                                        {getPriorityText(priority)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select 
                            value={filters.source || 'all'} 
                            onValueChange={(value) => handleFilterChange('source', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Källa" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alla källor</SelectItem>
                                {sources.map((source) => (
                                    <SelectItem key={source} value={source}>
                                        {getSourceText(source)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select 
                            value={filters.date_range || 'all'} 
                            onValueChange={(value) => handleFilterChange('date_range', value === 'all' ? undefined : value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alla datum</SelectItem>
                                <SelectItem value="today">Idag</SelectItem>
                                <SelectItem value="this_week">Denna vecka</SelectItem>
                                <SelectItem value="this_month">Denna månad</SelectItem>
                                <SelectItem value="last_30_days">Senaste 30 dagarna</SelectItem>
                            </SelectContent>
                        </Select>
                    </form>
                </CardContent>
            </Card>

            {/* Leads Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Leads ({leads.total})
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
                                            onClick={() => handleSort('name')}
                                            className="font-semibold"
                                        >
                                            Kontakt
                                            {filters.sort === 'name' && (
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
                                            onClick={() => handleSort('status')}
                                            className="font-semibold"
                                        >
                                            Status
                                            {filters.sort === 'status' && (
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
                                            onClick={() => handleSort('priority')}
                                            className="font-semibold"
                                        >
                                            Prioritet
                                            {filters.sort === 'priority' && (
                                                filters.order === 'asc' ? 
                                                <SortAsc className="h-4 w-4 ml-1" /> : 
                                                <SortDesc className="h-4 w-4 ml-1" />
                                            )}
                                        </Button>
                                    </th>
                                    <th className="text-left p-4">Källa</th>
                                    <th className="text-left p-4">Intresserad av</th>
                                    <th className="text-left p-4">Budget</th>
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
                                    <th className="text-left p-4">Senast kontaktad</th>
                                    <th className="text-right p-4">Åtgärder</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center p-8 text-gray-500">
                                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>Inga leads hittades</p>
                                            <p className="text-sm mt-2">Prova att ändra dina filterinställningar</p>
                                        </td>
                                    </tr>
                                ) : (
                                    leads.data.map((lead) => (
                                        <tr key={lead.id} className="border-b hover:bg-gray-50">
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-medium">{lead.name}</p>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                        <Mail className="h-3 w-3" />
                                                        <span>{lead.email}</span>
                                                    </div>
                                                    {lead.phone && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Phone className="h-3 w-3" />
                                                            <span>{lead.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={getStatusColor(lead.status)}>
                                                    {getStatusText(lead.status)}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={getPriorityColor(lead.priority)}>
                                                    {getPriorityText(lead.priority)}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm">
                                                {getSourceText(lead.source)}
                                            </td>
                                            <td className="p-4">
                                                {lead.interested_car ? (
                                                    <div className="text-sm">
                                                        <p className="font-medium">
                                                            {lead.interested_car.make} {lead.interested_car.model}
                                                        </p>
                                                        <p className="text-gray-500">
                                                            {lead.interested_car.year} • {formatPrice(lead.interested_car.price)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm">
                                                {lead.budget_min || lead.budget_max ? (
                                                    <div>
                                                        {lead.budget_min && formatPrice(lead.budget_min)}
                                                        {lead.budget_min && lead.budget_max && ' - '}
                                                        {lead.budget_max && formatPrice(lead.budget_max)}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {formatDate(lead.created_at)}
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {lead.last_activity_at ? (
                                                    formatDateTime(lead.last_activity_at)
                                                ) : (
                                                    <span className="text-orange-500">Aldrig</span>
                                                )}
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
                                                            <Link href={route('admin.leads.show', lead.id)}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Visa
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.leads.edit', lead.id)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Redigera
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        
                                                        <DropdownMenuSeparator />

                                                        <DropdownMenuItem 
                                                            onClick={() => handleMarkContacted(lead)}
                                                        >
                                                            <Phone className="h-4 w-4 mr-2" />
                                                            Markera som kontaktad
                                                        </DropdownMenuItem>

                                                        {/* Status Updates */}
                                                        <DropdownMenuLabel>Ändra status</DropdownMenuLabel>
                                                        {statuses.filter(s => s !== lead.status).map((status) => (
                                                            <DropdownMenuItem 
                                                                key={status}
                                                                onClick={() => handleUpdateStatus(lead, status)}
                                                            >
                                                                <Target className="h-4 w-4 mr-2" />
                                                                {getStatusText(status)}
                                                            </DropdownMenuItem>
                                                        ))}

                                                        <DropdownMenuSeparator />

                                                        {/* Priority Updates */}
                                                        <DropdownMenuLabel>Ändra prioritet</DropdownMenuLabel>
                                                        {priorities.filter(p => p !== lead.priority).map((priority) => (
                                                            <DropdownMenuItem 
                                                                key={priority}
                                                                onClick={() => handleUpdatePriority(lead, priority)}
                                                            >
                                                                <Star className="h-4 w-4 mr-2" />
                                                                {getPriorityText(priority)}
                                                            </DropdownMenuItem>
                                                        ))}

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
                                                                    <AlertDialogTitle>Ta bort lead</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Är du säker på att du vill ta bort lead för {lead.name}? 
                                                                        Denna åtgärd kan inte ångras.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                                                                    <AlertDialogAction 
                                                                        onClick={() => handleDelete(lead)}
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
                    {leads.last_page > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-6 border-t">
                            <div className="text-sm text-gray-700">
                                Visar {leads.from} till {leads.to} av {leads.total} leads
                            </div>
                            <div className="flex items-center space-x-2">
                                {leads.prev_page_url && (
                                    <Link href={leads.prev_page_url}>
                                        <Button variant="outline" size="sm">
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Föregående
                                        </Button>
                                    </Link>
                                )}
                                <span className="px-3 py-1 text-sm">
                                    Sida {leads.current_page} av {leads.last_page}
                                </span>
                                {leads.next_page_url && (
                                    <Link href={leads.next_page_url}>
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