import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    MessageSquare, 
    Plus, 
    Clock, 
    CheckCircle, 
    XCircle,
    AlertCircle,
    Eye,
    Car,
    User,
    Calendar,
    MoreHorizontal
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MessagesIndex({ conversations, stats, filter }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.abs(now - date) / 36e5;
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (diffInHours < 168) { // Less than a week
            return date.toLocaleDateString('sv-SE', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } else {
            return date.toLocaleDateString('sv-SE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getStatusBadgeVariant = (status) => {
        const variants = {
            'open': 'default',
            'in_progress': 'secondary',
            'waiting_customer': 'outline',
            'closed': 'success'
        };
        return variants[status] || 'secondary';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'low': 'bg-gray-500',
            'medium': 'bg-blue-500',
            'high': 'bg-orange-500',
            'urgent': 'bg-red-500'
        };
        return colors[priority] || 'bg-gray-500';
    };

    const handleFilterChange = (newFilter) => {
        router.get(route('customer.messages.index'), { filter: newFilter }, {
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

    const ConversationCard = ({ conversation }) => (
        <Card className={`mb-4 cursor-pointer hover:shadow-md transition-shadow ${
            conversation.unread_count > 0 ? 'ring-2 ring-blue-200' : ''
        }`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(conversation.priority)}`}></div>
                            <Badge variant={getStatusBadgeVariant(conversation.status)} className="text-xs">
                                {conversation.status_label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {conversation.type_label}
                            </Badge>
                            {conversation.unread_count > 0 && (
                                <Badge className="bg-blue-600 text-white text-xs">
                                    {conversation.unread_count} nya
                                </Badge>
                            )}
                        </div>

                        {/* Subject */}
                        <Link href={route('customer.messages.show', conversation.id)} className="block">
                            <h3 className={`text-lg font-semibold mb-2 hover:text-blue-600 transition-colors ${
                                conversation.unread_count > 0 ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                                {conversation.subject}
                            </h3>
                        </Link>

                        {/* Car Info */}
                        {conversation.car && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Car className="h-4 w-4" />
                                <span>
                                    {conversation.car.make} {conversation.car.model} ({conversation.car.year})
                                </span>
                            </div>
                        )}

                        {/* Last Message Preview */}
                        {conversation.last_message && (
                            <div className="mb-3">
                                <p className={`text-sm text-gray-600 line-clamp-2 ${
                                    conversation.unread_count > 0 ? 'font-medium text-gray-800' : ''
                                }`}>
                                    <span className="font-medium">
                                        {conversation.last_message.is_from_customer ? 'Du: ' : 'Support: '}
                                    </span>
                                    {conversation.last_message.message}
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                                {conversation.assigned_agent && (
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        <span>{conversation.assigned_agent.name}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDate(conversation.last_message_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={route('customer.messages.show', conversation.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Visa konversation
                                </Link>
                            </DropdownMenuItem>
                            {conversation.car && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/cars/${conversation.car.id}`}>
                                        <Car className="mr-2 h-4 w-4" />
                                        Visa bil
                                    </Link>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <CustomerLayout title="Meddelanden">
            <Head title="Meddelanden" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Meddelanden</h1>
                    <p className="text-gray-600 mt-1">
                        Hantera dina konversationer med vårt säljteam
                    </p>
                </div>
                <Button asChild>
                    <Link href={route('customer.messages.create')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nytt meddelande
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Totalt"
                    value={stats.total}
                    icon={MessageSquare}
                    color="text-gray-500"
                />
                <StatCard
                    title="Olästa"
                    value={stats.unread}
                    icon={AlertCircle}
                    color="text-blue-500"
                />
                <StatCard
                    title="Öppna"
                    value={stats.open}
                    icon={Clock}
                    color="text-yellow-500"
                />
                <StatCard
                    title="Stängda"
                    value={stats.closed}
                    icon={CheckCircle}
                    color="text-green-500"
                />
            </div>

            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={handleFilterChange} className="mb-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Alla</TabsTrigger>
                    <TabsTrigger value="unread">Olästa</TabsTrigger>
                    <TabsTrigger value="open">Öppna</TabsTrigger>
                    <TabsTrigger value="closed">Stängda</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-6">
                    {/* Conversations List */}
                    {conversations.data && conversations.data.length > 0 ? (
                        <div>
                            {conversations.data.map((conversation) => (
                                <ConversationCard key={conversation.id} conversation={conversation} />
                            ))}
                            
                            {/* Pagination */}
                            {conversations.links && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Visar {conversations.from} - {conversations.to} av {conversations.total} konversationer
                                    </div>
                                    <div className="flex space-x-2">
                                        {conversations.links.map((link, index) => {
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
                                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {filter === 'unread' && 'Inga olästa meddelanden'}
                                    {filter === 'open' && 'Inga öppna konversationer'}
                                    {filter === 'closed' && 'Inga stängda konversationer'}
                                    {filter === 'all' && 'Inga meddelanden ännu'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {filter === 'unread' && 'Alla dina meddelanden är lästa.'}
                                    {filter === 'open' && 'Du har inga öppna konversationer för tillfället.'}
                                    {filter === 'closed' && 'Du har inga stängda konversationer att visa.'}
                                    {filter === 'all' && 'Du har inte startat någon konversation ännu.'}
                                </p>
                                <Button asChild>
                                    <Link href={route('customer.messages.create')}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Skicka ditt första meddelande
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