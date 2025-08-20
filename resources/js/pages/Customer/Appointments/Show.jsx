import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Car, 
    User, 
    Phone, 
    Mail,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Edit,
    FileText,
    Loader2
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export default function ShowAppointment({ appointment }) {
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

    const { data: cancelData, setData: setCancelData, post: postCancel, processing: cancelProcessing } = useForm({
        cancellation_reason: ''
    });

    const { data: rescheduleData, setData: setRescheduleData, post: postReschedule, processing: rescheduleProcessing } = useForm({
        new_date: '',
        new_time: '',
        reason: ''
    });

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
            full: date.toLocaleDateString('sv-SE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            date: date.toLocaleDateString('sv-SE'),
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

    const handleCancel = (e) => {
        e.preventDefault();
        postCancel(route('customer.appointments.cancel', appointment.id), {
            onSuccess: () => {
                setShowCancelDialog(false);
            }
        });
    };

    const handleReschedule = (e) => {
        e.preventDefault();
        postReschedule(route('customer.appointments.reschedule', appointment.id), {
            onSuccess: () => {
                setShowRescheduleDialog(false);
            }
        });
    };

    const dateTime = formatDateTime(appointment.appointment_date);

    return (
        <CustomerLayout title="Bokningsdetaljer">
            <Head title={`Bokning - ${appointment.type_label}`} />

            <div className="mb-6">
                <Link href="/customer/appointments" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Tillbaka till mina bokningar
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status and Basic Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        {appointment.type_label}
                                    </CardTitle>
                                    <CardDescription>
                                        Boknings-ID: #{appointment.id}
                                    </CardDescription>
                                </div>
                                <Badge variant={getStatusBadgeVariant(appointment.status)} className="text-sm">
                                    {appointment.status_label}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="font-medium">{dateTime.full}</p>
                                        <p className="text-sm text-gray-600">{dateTime.date}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="font-medium">{dateTime.time}</p>
                                        <p className="text-sm text-gray-600">
                                            {appointment.duration_hours} timme{appointment.duration_hours !== 1 ? 'r' : ''}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="font-medium">
                                            {appointment.location === 'showroom' && 'Vår utställning'}
                                            {appointment.location === 'customer_address' && 'Din adress'}
                                            {appointment.location === 'other' && 'Annan plats'}
                                        </p>
                                        {appointment.address && (
                                            <p className="text-sm text-gray-600">{appointment.address}</p>
                                        )}
                                    </div>
                                </div>
                                
                                {appointment.assigned_agent && (
                                    <div className="flex items-center gap-3">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">{appointment.assigned_agent.name}</p>
                                            <p className="text-sm text-gray-600">Din säljare</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Status Indicators */}
                            <div className="pt-4 border-t">
                                {appointment.is_upcoming && (
                                    <Alert>
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Kommande möte. Vi ses snart!
                                        </AlertDescription>
                                    </Alert>
                                )}
                                
                                {appointment.is_overdue && (
                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>
                                            Detta möte har passerat och är markerat som försenat.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                
                                {appointment.status === 'completed' && (
                                    <Alert>
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Mötet är genomfört. Tack för ditt besök!
                                        </AlertDescription>
                                    </Alert>
                                )}
                                
                                {appointment.status === 'cancelled' && (
                                    <Alert variant="destructive">
                                        <XCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Denna bokning har avbokats.
                                            {appointment.cancellation_reason && ` Anledning: ${appointment.cancellation_reason}`}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Car Information */}
                    {appointment.car && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Car className="h-5 w-5" />
                                    Bil som ska visas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">
                                            {appointment.car.make} {appointment.car.model} {appointment.car.variant && `${appointment.car.variant} `}
                                        </h3>
                                        <p className="text-gray-600">Årsmodell {appointment.car.year}</p>
                                        <p className="text-2xl font-bold text-blue-600 mt-2">
                                            {formatPrice(appointment.car.price)}
                                        </p>
                                    </div>
                                </div>
                                
                                <Separator className="my-4" />
                                
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-600">Miltal</p>
                                        <p className="font-medium">{appointment.car.mileage?.toLocaleString()} km</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Bränsle</p>
                                        <p className="font-medium">{appointment.car.fuel_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Växellåda</p>
                                        <p className="font-medium">{appointment.car.transmission}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-4">
                                    <Button variant="outline" asChild>
                                        <Link href={`/cars/${appointment.car.id}`}>
                                            Visa full bilinfo
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Messages and Notes */}
                    {(appointment.customer_message || appointment.special_requirements || appointment.admin_notes || appointment.completion_notes) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Meddelanden och anteckningar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {appointment.customer_message && (
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-700 mb-1">Ditt meddelande:</h4>
                                        <p className="text-sm bg-gray-50 p-3 rounded-lg">{appointment.customer_message}</p>
                                    </div>
                                )}
                                
                                {appointment.special_requirements && (
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-700 mb-1">Särskilda behov:</h4>
                                        <p className="text-sm bg-gray-50 p-3 rounded-lg">{appointment.special_requirements}</p>
                                    </div>
                                )}
                                
                                {appointment.admin_notes && (
                                    <div>
                                        <h4 className="font-medium text-sm text-blue-700 mb-1">Meddelande från oss:</h4>
                                        <p className="text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">{appointment.admin_notes}</p>
                                    </div>
                                )}
                                
                                {appointment.completion_notes && (
                                    <div>
                                        <h4 className="font-medium text-sm text-green-700 mb-1">Uppföljning efter mötet:</h4>
                                        <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-200">{appointment.completion_notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Kontaktinformation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{appointment.customer_name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{appointment.customer_email}</span>
                            </div>
                            {appointment.customer_phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{appointment.customer_phone}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    {(appointment.can_be_cancelled || appointment.can_be_rescheduled) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Åtgärder</CardTitle>
                                <CardDescription>
                                    Hantera din bokning
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {appointment.can_be_rescheduled && (
                                    <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Boka om tid
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <form onSubmit={handleReschedule}>
                                                <DialogHeader>
                                                    <DialogTitle>Boka om din tid</DialogTitle>
                                                    <DialogDescription>
                                                        Välj en ny tid för ditt möte. Vi bekräftar den nya tiden inom 24 timmar.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor="new_date">Nytt datum</Label>
                                                            <Input
                                                                id="new_date"
                                                                type="date"
                                                                value={rescheduleData.new_date}
                                                                onChange={(e) => setRescheduleData('new_date', e.target.value)}
                                                                min={new Date().toISOString().split('T')[0]}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="new_time">Ny tid</Label>
                                                            <Input
                                                                id="new_time"
                                                                type="time"
                                                                value={rescheduleData.new_time}
                                                                onChange={(e) => setRescheduleData('new_time', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="reschedule_reason">Anledning (valfritt)</Label>
                                                        <Textarea
                                                            id="reschedule_reason"
                                                            placeholder="Varför vill du boka om?"
                                                            value={rescheduleData.reason}
                                                            onChange={(e) => setRescheduleData('reason', e.target.value)}
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="button" variant="outline" onClick={() => setShowRescheduleDialog(false)}>
                                                        Avbryt
                                                    </Button>
                                                    <Button type="submit" disabled={rescheduleProcessing}>
                                                        {rescheduleProcessing ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Skickar...
                                                            </>
                                                        ) : (
                                                            'Skicka ombokning'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                )}
                                
                                {appointment.can_be_cancelled && (
                                    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" className="w-full">
                                                <XCircle className="h-4 w-4 mr-2" />
                                                Avboka tid
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <form onSubmit={handleCancel}>
                                                <DialogHeader>
                                                    <DialogTitle>Avboka din tid</DialogTitle>
                                                    <DialogDescription>
                                                        Är du säker på att du vill avboka denna tid? Detta går inte att ångra.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <Label htmlFor="cancellation_reason">Anledning (valfritt)</Label>
                                                    <Textarea
                                                        id="cancellation_reason"
                                                        placeholder="Varför avbokar du?"
                                                        value={cancelData.cancellation_reason}
                                                        onChange={(e) => setCancelData('cancellation_reason', e.target.value)}
                                                        rows={3}
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="button" variant="outline" onClick={() => setShowCancelDialog(false)}>
                                                        Behåll bokningen
                                                    </Button>
                                                    <Button type="submit" variant="destructive" disabled={cancelProcessing}>
                                                        {cancelProcessing ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Avbokar...
                                                            </>
                                                        ) : (
                                                            'Ja, avboka'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Timestamps */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Bokningshistorik
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Bokad:</span>
                                <span>{new Date(appointment.created_at).toLocaleDateString('sv-SE')}</span>
                            </div>
                            
                            {appointment.confirmed_at && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bekräftad:</span>
                                    <span>{new Date(appointment.confirmed_at).toLocaleDateString('sv-SE')}</span>
                                </div>
                            )}
                            
                            {appointment.completed_at && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Genomförd:</span>
                                    <span>{new Date(appointment.completed_at).toLocaleDateString('sv-SE')}</span>
                                </div>
                            )}
                            
                            {appointment.cancelled_at && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Avbokad:</span>
                                    <span>{new Date(appointment.cancelled_at).toLocaleDateString('sv-SE')}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CustomerLayout>
    );
}