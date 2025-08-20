import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    ArrowLeft,
    Send,
    Clock,
    User,
    Car,
    Phone,
    Mail,
    MessageSquare,
    AlertCircle,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Paperclip
} from 'lucide-react';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

export default function ShowMessage({ conversation, messages }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
    });

    const messagesEndRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom();
        }
    }, [messages, isAtBottom]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.messages.reply', conversation.id), {
            onSuccess: () => {
                reset('message');
                scrollToBottom();
            }
        });
    };

    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        
        if (isToday(date)) {
            return `Idag ${format(date, 'HH:mm')}`;
        } else if (isYesterday(date)) {
            return `Igår ${format(date, 'HH:mm')}`;
        } else {
            return format(date, 'MMM d, HH:mm', { locale: sv });
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

    const getStatusIcon = (status) => {
        const icons = {
            'open': Clock,
            'in_progress': MessageSquare,
            'waiting_customer': AlertCircle,
            'closed': CheckCircle
        };
        return icons[status] || Clock;
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

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const StatusIcon = getStatusIcon(conversation.status);

    return (
        <CustomerLayout title={conversation.subject}>
            <Head title={conversation.subject} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link href={route('customer.messages.index')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Tillbaka
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{conversation.subject}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(conversation.priority)}`}></div>
                            <Badge variant={getStatusBadgeVariant(conversation.status)} className="text-xs">
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {conversation.status_label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                                {conversation.type_label}
                            </Badge>
                            <span className="text-sm text-gray-500">
                                {conversation.priority_label} prioritet
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Messages Area */}
                <div className="lg:col-span-3">
                    <Card className="h-[600px] flex flex-col">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Konversation</CardTitle>
                                <div className="text-sm text-gray-500">
                                    {messages.length} meddelanden
                                </div>
                            </div>
                        </CardHeader>
                        
                        {/* Messages List */}
                        <CardContent className="flex-1 overflow-y-auto space-y-4 pb-0">
                            {messages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${
                                        message.is_from_customer ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <Avatar className="h-8 w-8 mt-1">
                                        {message.is_from_customer ? (
                                            <AvatarFallback className="bg-blue-500 text-white text-xs">
                                                {getInitials(message.sender.name)}
                                            </AvatarFallback>
                                        ) : (
                                            <AvatarFallback className="bg-green-500 text-white text-xs">
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        )}
                                    </Avatar>

                                    {/* Message Content */}
                                    <div className={`flex-1 max-w-[70%] ${
                                        message.is_from_customer ? 'text-right' : 'text-left'
                                    }`}>
                                        <div className={`rounded-lg px-4 py-3 ${
                                            message.is_from_customer 
                                                ? 'bg-blue-500 text-white ml-auto' 
                                                : 'bg-gray-100 text-gray-900'
                                        }`}>
                                            <div className="whitespace-pre-wrap break-words">
                                                {message.message}
                                            </div>
                                            
                                            {/* Attachments */}
                                            {message.attachments && message.attachments.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-white/20">
                                                    {message.attachments.map((attachment, attachIndex) => (
                                                        <div key={attachIndex} className="flex items-center gap-2 text-sm">
                                                            <Paperclip className="h-3 w-3" />
                                                            <span>{attachment.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Message Meta */}
                                        <div className={`text-xs text-gray-500 mt-1 ${
                                            message.is_from_customer ? 'text-right' : 'text-left'
                                        }`}>
                                            <span className="font-medium">{message.sender.name}</span>
                                            {message.sender.role === 'admin' && (
                                                <span className="ml-1 text-green-600">• Support</span>
                                            )}
                                            <span className="ml-2">{formatMessageTime(message.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </CardContent>

                        {/* Reply Form */}
                        {conversation.status !== 'closed' && (
                            <div className="border-t p-4">
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <Textarea
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Skriv ditt svar..."
                                        rows={3}
                                        className={errors.message ? 'border-red-500' : ''}
                                        disabled={processing}
                                        required
                                    />
                                    {errors.message && (
                                        <p className="text-sm text-red-600">{errors.message}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            {data.message.length}/2000 tecken
                                        </p>
                                        <Button type="submit" disabled={processing || !data.message.trim()}>
                                            <Send className="h-4 w-4 mr-2" />
                                            {processing ? 'Skickar...' : 'Skicka svar'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Closed Conversation Notice */}
                        {conversation.status === 'closed' && (
                            <div className="border-t p-4">
                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Denna konversation är stängd. Kontakta oss om du behöver ytterligare hjälp.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Car Information */}
                    {conversation.car && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Car className="h-5 w-5" />
                                    Bil information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {conversation.car.make} {conversation.car.model}
                                        </h3>
                                        <p className="text-gray-600">
                                            {conversation.car.variant && `${conversation.car.variant} • `}
                                            {conversation.car.year}
                                        </p>
                                    </div>
                                    {conversation.car.price && (
                                        <div className="text-2xl font-bold text-green-600">
                                            {conversation.car.price.toLocaleString('sv-SE')} kr
                                        </div>
                                    )}
                                    <Button variant="outline" size="sm" asChild className="w-full">
                                        <Link href={`/cars/${conversation.car.id}`}>
                                            Visa bil detaljer
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Agent Information */}
                    {conversation.assigned_agent && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Din säljare
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback className="bg-green-500 text-white">
                                                {getInitials(conversation.assigned_agent.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold">
                                                {conversation.assigned_agent.name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Säljkonsulent
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span>{conversation.assigned_agent.email}</span>
                                        </div>
                                        {conversation.assigned_agent.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span>{conversation.assigned_agent.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Conversation Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Konversation detaljer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <div className="font-medium text-gray-900">Status</div>
                                    <Badge variant={getStatusBadgeVariant(conversation.status)} className="mt-1">
                                        {conversation.status_label}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Prioritet</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(conversation.priority)}`}></div>
                                        <span className="text-sm">{conversation.priority_label}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Typ</div>
                                    <div className="text-gray-600 mt-1">{conversation.type_label}</div>
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">Skapad</div>
                                    <div className="text-gray-600 mt-1">
                                        {format(new Date(conversation.created_at), 'MMM d, yyyy', { locale: sv })}
                                    </div>
                                </div>
                            </div>

                            {conversation.last_message_at && (
                                <div className="pt-3 border-t">
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900">Senaste aktivitet</div>
                                        <div className="text-gray-600 mt-1">
                                            {formatDistanceToNow(new Date(conversation.last_message_at), { 
                                                addSuffix: true, 
                                                locale: sv 
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Åtgärder</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full" asChild>
                                <Link href={route('customer.messages.create')}>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Nytt meddelande
                                </Link>
                            </Button>
                            
                            {conversation.car && (
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={route('customer.appointments.create', { car_id: conversation.car.id })}>
                                        <Clock className="h-4 w-4 mr-2" />
                                        Boka provkörning
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CustomerLayout>
    );
}