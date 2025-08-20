import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    Calendar, 
    Clock, 
    MapPin, 
    Car, 
    AlertCircle, 
    CheckCircle,
    ArrowLeft,
    Loader2
} from 'lucide-react';

export default function CreateAppointment({ car, user, availableDates, appointmentTypes, preselectedType = 'test_drive' }) {
    const [selectedDate, setSelectedDate] = useState('');
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(60);

    const { data, setData, post, processing, errors, reset } = useForm({
        car_id: car.id,
        type: preselectedType,
        appointment_date: '',
        time: '',
        duration_minutes: 60,
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: user.phone || '',
        customer_message: '',
        location: 'showroom',
        address: '',
        special_requirements: ''
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('sv-SE', {
            style: 'currency',
            currency: 'SEK',
            minimumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('sv-SE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getDurationOptions = () => {
        const baseOptions = [
            { value: 60, label: '1 timme' },
            { value: 90, label: '1,5 timmar' },
            { value: 120, label: '2 timmar' }
        ];

        // Add extra time for test drives
        if (data.type === 'test_drive') {
            return [
                ...baseOptions,
                { value: 150, label: '2,5 timmar' },
                { value: 180, label: '3 timmar' }
            ];
        }

        return baseOptions;
    };

    const fetchTimeSlots = async (date, duration) => {
        if (!date || !duration) return;
        
        setIsLoadingTimeSlots(true);
        try {
            const response = await fetch('/customer/appointments/time-slots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ date, duration })
            });
            
            if (response.ok) {
                const result = await response.json();
                setAvailableTimeSlots(result.timeSlots || []);
            } else {
                setAvailableTimeSlots([]);
            }
        } catch (error) {
            console.error('Error fetching time slots:', error);
            setAvailableTimeSlots([]);
        } finally {
            setIsLoadingTimeSlots(false);
        }
    };

    useEffect(() => {
        if (selectedDate && selectedDuration) {
            fetchTimeSlots(selectedDate, selectedDuration);
        }
    }, [selectedDate, selectedDuration]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setData('appointment_date', date);
        setData('time', ''); // Reset time selection
    };

    const handleDurationChange = (duration) => {
        const durationNum = parseInt(duration);
        setSelectedDuration(durationNum);
        setData('duration_minutes', durationNum);
        setData('time', ''); // Reset time selection
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.appointments.store'));
    };

    const getTypeDescription = (type) => {
        const descriptions = {
            viewing: 'Besök vår utställning för att titta på bilen närmre. Perfekt för att få en första uppfattning.',
            test_drive: 'Provkör bilen för att känna hur den fungerar på vägen. Kör- och ID-kort krävs.',
            consultation: 'Träffa en av våra experter för personlig rådgivning om bilköp och finansiering.'
        };
        return descriptions[type] || '';
    };

    return (
        <CustomerLayout title="Boka tid">
            <Head title={`Boka tid - ${car.make} ${car.model}`} />

            <div className="mb-6">
                <Link href="/customer/appointments" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Tillbaka till mina bokningar
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Car Information */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="h-5 w-5" />
                                Bil som ska visas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {car.make} {car.model} {car.variant && `${car.variant} `}
                                    </h3>
                                    <p className="text-gray-600">Årsmodell {car.year}</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">
                                        {formatPrice(car.price)}
                                    </p>
                                </div>
                                
                                <Separator />
                                
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Miltal:</span>
                                        <span>{car.mileage?.toLocaleString()} km</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Bränsle:</span>
                                        <span>{car.fuel_type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Växellåda:</span>
                                        <span>{car.transmission}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Booking Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Boka din tid
                            </CardTitle>
                            <CardDescription>
                                Välj vilken typ av möte du vill ha och när det passar dig bäst
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Appointment Type */}
                                <div className="space-y-3">
                                    <Label className="text-base font-medium">Typ av möte</Label>
                                    <RadioGroup 
                                        value={data.type} 
                                        onValueChange={(value) => setData('type', value)}
                                        className="grid grid-cols-1 gap-4"
                                    >
                                        {appointmentTypes.map((type) => (
                                            <div key={type.value} className="relative">
                                                <RadioGroupItem 
                                                    value={type.value} 
                                                    id={type.value}
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor={type.value}
                                                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50"
                                                >
                                                    <div>
                                                        <div className="font-medium">{type.label}</div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            {getTypeDescription(type.value)}
                                                        </div>
                                                    </div>
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    {errors.type && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{errors.type}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-3">
                                    <Label htmlFor="appointment_date" className="text-base font-medium">
                                        Välj datum
                                    </Label>
                                    <Select value={selectedDate} onValueChange={handleDateChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Välj ett datum" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableDates.map((date) => (
                                                <SelectItem key={date} value={date}>
                                                    {formatDate(date)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.appointment_date && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{errors.appointment_date}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Duration Selection */}
                                <div className="space-y-3">
                                    <Label className="text-base font-medium">Mötets längd</Label>
                                    <Select 
                                        value={selectedDuration.toString()} 
                                        onValueChange={handleDurationChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Välj längd" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getDurationOptions().map((option) => (
                                                <SelectItem key={option.value} value={option.value.toString()}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Time Selection */}
                                {selectedDate && (
                                    <div className="space-y-3">
                                        <Label className="text-base font-medium flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Välj tid
                                        </Label>
                                        
                                        {isLoadingTimeSlots ? (
                                            <div className="flex items-center justify-center py-4">
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                                <span className="ml-2">Laddar tillgängliga tider...</span>
                                            </div>
                                        ) : availableTimeSlots.length > 0 ? (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                {availableTimeSlots.map((slot) => (
                                                    <Button
                                                        key={slot.value}
                                                        type="button"
                                                        variant={data.time === slot.value ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setData('time', slot.value)}
                                                        className="h-10"
                                                    >
                                                        {slot.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        ) : (
                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    Inga tillgängliga tider för valt datum och längd. Vänligen välj ett annat datum.
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        
                                        {errors.time && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>{errors.time}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                )}

                                {/* Location */}
                                <div className="space-y-3">
                                    <Label className="text-base font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Var vill du träffas?
                                    </Label>
                                    <RadioGroup 
                                        value={data.location} 
                                        onValueChange={(value) => setData('location', value)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="showroom" id="showroom" />
                                            <Label htmlFor="showroom">På vår utställning</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="customer_address" id="customer_address" />
                                            <Label htmlFor="customer_address">På min adress (extra avgift kan tillkomma)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="other" id="other" />
                                            <Label htmlFor="other">Annan plats</Label>
                                        </div>
                                    </RadioGroup>
                                    
                                    {(data.location === 'customer_address' || data.location === 'other') && (
                                        <div className="mt-2">
                                            <Label htmlFor="address">Adress</Label>
                                            <Input
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                placeholder="Ange fullständig adress"
                                                className="mt-1"
                                            />
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Contact Information */}
                                <div className="space-y-4">
                                    <h3 className="font-medium">Kontaktuppgifter</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="customer_name">Namn *</Label>
                                            <Input
                                                id="customer_name"
                                                value={data.customer_name}
                                                onChange={(e) => setData('customer_name', e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                            {errors.customer_name && (
                                                <p className="text-sm text-red-600 mt-1">{errors.customer_name}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="customer_phone">Telefon</Label>
                                            <Input
                                                id="customer_phone"
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                className="mt-1"
                                                placeholder="070-123 45 67"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="customer_email">E-post *</Label>
                                        <Input
                                            id="customer_email"
                                            type="email"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                        {errors.customer_email && (
                                            <p className="text-sm text-red-600 mt-1">{errors.customer_email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <Label htmlFor="customer_message">Meddelande (valfritt)</Label>
                                    <Textarea
                                        id="customer_message"
                                        value={data.customer_message}
                                        onChange={(e) => setData('customer_message', e.target.value)}
                                        placeholder="Har du några specifika frågor eller önskemål inför mötet?"
                                        rows={3}
                                    />
                                </div>

                                {/* Special Requirements */}
                                <div className="space-y-2">
                                    <Label htmlFor="special_requirements">Särskilda behov (valfritt)</Label>
                                    <Textarea
                                        id="special_requirements"
                                        value={data.special_requirements}
                                        onChange={(e) => setData('special_requirements', e.target.value)}
                                        placeholder="T.ex. rullstolstillgänglighet, translator eller andra särskilda önskemål"
                                        rows={2}
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        size="lg"
                                        disabled={processing || !data.time || !selectedDate}
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Skickar bokning...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Skicka bokningsförfrågan
                                            </>
                                        )}
                                    </Button>
                                    
                                    <p className="text-sm text-gray-600 mt-2 text-center">
                                        Vi bekräftar din bokning inom 24 timmar
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CustomerLayout>
    );
}