import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    MessageSquare, 
    Car, 
    ArrowLeft,
    AlertCircle,
    Send,
    FileText,
    Phone,
    Mail,
    CreditCard,
    Wrench,
    MessageCircle
} from 'lucide-react';

export default function CreateMessage({ car, conversationTypes, errors }) {
    const { data, setData, post, processing, errors: formErrors } = useForm({
        subject: car ? `Förfrågan om ${car.make} ${car.model} (${car.year})` : '',
        type: car ? 'car_inquiry' : 'general_inquiry',
        message: '',
        car_id: car?.id || null,
        priority: 'medium',
    });

    const [selectedType, setSelectedType] = useState(data.type);

    const getTypeIcon = (type) => {
        const icons = {
            'general_inquiry': MessageCircle,
            'car_inquiry': Car,
            'financing': CreditCard,
            'service': Wrench,
            'complaint': AlertCircle,
        };
        return icons[type] || MessageCircle;
    };

    const getTypeDescription = (type) => {
        const descriptions = {
            'general_inquiry': 'Allmänna frågor om våra tjänster och bilar',
            'car_inquiry': 'Specifika frågor om en bil eller flera bilar',
            'financing': 'Frågor om finansiering, leasing eller betalningsalternativ',
            'service': 'Support och service för befintliga kunder',
            'complaint': 'Klagomål eller problem som behöver uppmärksamhet',
        };
        return descriptions[type] || '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.messages.store'));
    };

    const handleTypeChange = (value) => {
        setSelectedType(value);
        setData('type', value);
        
        // Update subject if it's a car inquiry
        if (value === 'car_inquiry' && car) {
            setData('subject', `Förfrågan om ${car.make} ${car.model} (${car.year})`);
        } else if (value !== 'car_inquiry' && car && data.subject.includes('Förfrågan om')) {
            setData('subject', '');
        }
    };

    return (
        <CustomerLayout title="Nytt meddelande">
            <Head title="Nytt meddelande" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" asChild>
                    <Link href={route('customer.messages.index')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Tillbaka till meddelanden
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nytt meddelande</h1>
                    <p className="text-gray-600 mt-1">
                        Skicka ett meddelande till vårt säljteam
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Meddelande information
                            </CardTitle>
                            <CardDescription>
                                Fyll i formuläret nedan för att skicka ditt meddelande
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Message Type */}
                                <div className="space-y-3">
                                    <Label>Typ av förfrågan</Label>
                                    <RadioGroup
                                        value={selectedType}
                                        onValueChange={handleTypeChange}
                                        className="grid grid-cols-1 gap-4"
                                    >
                                        {conversationTypes.map((type) => {
                                            const Icon = getTypeIcon(type.value);
                                            return (
                                                <div key={type.value} className="flex items-center space-x-2">
                                                    <RadioGroupItem 
                                                        value={type.value} 
                                                        id={type.value}
                                                        className="peer sr-only"
                                                    />
                                                    <Label
                                                        htmlFor={type.value}
                                                        className="flex items-start gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer w-full"
                                                    >
                                                        <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                                                        <div className="flex-1">
                                                            <div className="font-medium">{type.label}</div>
                                                            <div className="text-sm text-muted-foreground mt-1">
                                                                {getTypeDescription(type.value)}
                                                            </div>
                                                        </div>
                                                    </Label>
                                                </div>
                                            );
                                        })}
                                    </RadioGroup>
                                    {formErrors.type && (
                                        <p className="text-sm text-red-600">{formErrors.type}</p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Ämne</Label>
                                    <Input
                                        id="subject"
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="Beskriv ditt ärende kort..."
                                        className={formErrors.subject ? 'border-red-500' : ''}
                                        required
                                    />
                                    {formErrors.subject && (
                                        <p className="text-sm text-red-600">{formErrors.subject}</p>
                                    )}
                                </div>

                                {/* Priority */}
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Prioritet</Label>
                                    <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Välj prioritet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Låg - Inte brådskande</SelectItem>
                                            <SelectItem value="medium">Medel - Normal hantering</SelectItem>
                                            <SelectItem value="high">Hög - Behöver snabb respons</SelectItem>
                                            <SelectItem value="urgent">Brådskande - Akut ärende</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {formErrors.priority && (
                                        <p className="text-sm text-red-600">{formErrors.priority}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <Label htmlFor="message">Meddelande</Label>
                                    <Textarea
                                        id="message"
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Skriv ditt meddelande här..."
                                        rows={6}
                                        className={formErrors.message ? 'border-red-500' : ''}
                                        required
                                    />
                                    <p className="text-sm text-gray-500">
                                        {data.message.length}/2000 tecken
                                    </p>
                                    {formErrors.message && (
                                        <p className="text-sm text-red-600">{formErrors.message}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('customer.messages.index')}>
                                            Avbryt
                                        </Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Send className="h-4 w-4 mr-2" />
                                        {processing ? 'Skickar...' : 'Skicka meddelande'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Car Information */}
                    {car && (
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
                                            {car.make} {car.model}
                                        </h3>
                                        <p className="text-gray-600">
                                            {car.variant && `${car.variant} • `}{car.year}
                                        </p>
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {car.price?.toLocaleString('sv-SE')} kr
                                    </div>
                                    <Button variant="outline" size="sm" asChild className="w-full">
                                        <Link href={`/cars/${car.id}`}>
                                            Visa bil detaljer
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Help & Tips */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Tips för ditt meddelande
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">För snabbaste svar:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Var så specifik som möjligt</li>
                                    <li>• Inkludera relevanta detaljer</li>
                                    <li>• Välj rätt typ av förfrågan</li>
                                    <li>• Ange korrekt prioritet</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Svarstider:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Brådskande: Inom 2 timmar</li>
                                    <li>• Hög: Inom 4 timmar</li>
                                    <li>• Medel: Inom 24 timmar</li>
                                    <li>• Låg: Inom 48 timmar</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontakta oss direkt</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <div>
                                    <div className="font-medium">Telefon</div>
                                    <div className="text-gray-600">08-123 456 78</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <div>
                                    <div className="font-medium">E-post</div>
                                    <div className="text-gray-600">info@dinbildeal.se</div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 pt-2 border-t">
                                Öppettider: Mån-Fre 9-18, Lör 10-15
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CustomerLayout>
    );
}