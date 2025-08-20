import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
    Phone, 
    Mail, 
    MapPin,
    Clock,
    Send,
    MessageSquare,
    Car,
    Calculator,
    Shield
} from 'lucide-react';

export default function Contact() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        interest_type: '',
        car_interest: '',
        budget_range: '',
        message: '',
        preferred_contact: 'email',
        newsletter: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                alert('Tack för ditt meddelande! Vi återkommer inom 24 timmar.');
                reset();
            }
        });
    };

    return (
        <MarketingLayout>
            <Head title="Kontakt - Din Bil Deal" />
            
            <div className="container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Kontakta oss</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Vi är här för att hjälpa dig hitta din drömbil eller sälja din nuvarande bil. 
                        Kontakta oss idag så hjälper vi dig vidare.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageSquare className="mr-2 h-5 w-5" />
                                    Skicka meddelande
                                </CardTitle>
                                <CardDescription>
                                    Fyll i formuläret nedan så återkommer vi inom 24 timmar
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Information */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Namn *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                error={errors.name}
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="email">E-post *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                error={errors.email}
                                                required
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="phone">Telefonnummer</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                error={errors.phone}
                                                placeholder="08-123 456 78"
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="preferred_contact">Föredragen kontaktväg</Label>
                                            <Select
                                                value={data.preferred_contact}
                                                onValueChange={(value) => setData('preferred_contact', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="email">E-post</SelectItem>
                                                    <SelectItem value="phone">Telefon</SelectItem>
                                                    <SelectItem value="both">Båda</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Interest Information */}
                                    <div>
                                        <Label htmlFor="interest_type">Vad är du intresserad av? *</Label>
                                        <Select
                                            value={data.interest_type}
                                            onValueChange={(value) => setData('interest_type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Välj ditt intresse" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="buy">Köpa bil</SelectItem>
                                                <SelectItem value="sell">Sälja bil</SelectItem>
                                                <SelectItem value="trade">Byta bil</SelectItem>
                                                <SelectItem value="financing">Finansiering</SelectItem>
                                                <SelectItem value="valuation">Bilvärdering</SelectItem>
                                                <SelectItem value="other">Övrigt</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.interest_type && (
                                            <p className="text-sm text-red-600 mt-1">{errors.interest_type}</p>
                                        )}
                                    </div>

                                    {data.interest_type === 'buy' && (
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="car_interest">Biltyp av intresse</Label>
                                                <Select
                                                    value={data.car_interest}
                                                    onValueChange={(value) => setData('car_interest', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Välj biltyp" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sedan">Sedan</SelectItem>
                                                        <SelectItem value="suv">SUV</SelectItem>
                                                        <SelectItem value="hatchback">Halvkombi</SelectItem>
                                                        <SelectItem value="wagon">Kombi</SelectItem>
                                                        <SelectItem value="coupe">Coupé</SelectItem>
                                                        <SelectItem value="convertible">Cabriolet</SelectItem>
                                                        <SelectItem value="electric">Elbil</SelectItem>
                                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="budget_range">Budgetområde</Label>
                                                <Select
                                                    value={data.budget_range}
                                                    onValueChange={(value) => setData('budget_range', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Välj budget" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0-100000">Under 100,000 kr</SelectItem>
                                                        <SelectItem value="100000-200000">100,000 - 200,000 kr</SelectItem>
                                                        <SelectItem value="200000-400000">200,000 - 400,000 kr</SelectItem>
                                                        <SelectItem value="400000-600000">400,000 - 600,000 kr</SelectItem>
                                                        <SelectItem value="600000-800000">600,000 - 800,000 kr</SelectItem>
                                                        <SelectItem value="800000+">Över 800,000 kr</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="subject">Ämne</Label>
                                        <Input
                                            id="subject"
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            error={errors.subject}
                                            placeholder="Kort beskrivning av ditt ärende"
                                        />
                                        {errors.subject && (
                                            <p className="text-sm text-red-600 mt-1">{errors.subject}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="message">Meddelande *</Label>
                                        <Textarea
                                            id="message"
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            error={errors.message}
                                            rows={5}
                                            placeholder="Berätta mer om vad vi kan hjälpa dig med..."
                                            required
                                        />
                                        {errors.message && (
                                            <p className="text-sm text-red-600 mt-1">{errors.message}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="newsletter"
                                            checked={data.newsletter}
                                            onChange={(e) => setData('newsletter', e.target.checked)}
                                            className="rounded border-gray-300"
                                        />
                                        <Label htmlFor="newsletter" className="text-sm">
                                            Jag vill prenumerera på nyhetsbrev och få information om nya bilar
                                        </Label>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full" disabled={processing}>
                                        {processing ? (
                                            <>Skickar...</>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Skicka meddelande
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        {/* Contact Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Kontaktuppgifter</CardTitle>
                                <CardDescription>
                                    Andra sätt att nå oss på
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <div>
                                        <div className="font-medium">Telefon</div>
                                        <div className="text-sm text-muted-foreground">08-123 456 78</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <div>
                                        <div className="font-medium">E-post</div>
                                        <div className="text-sm text-muted-foreground">info@dinbildeal.se</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <div>
                                        <div className="font-medium">Adress</div>
                                        <div className="text-sm text-muted-foreground">
                                            Storgatan 123<br />
                                            111 22 Stockholm
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Opening Hours */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Clock className="mr-2 h-5 w-5" />
                                    Öppettider
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Måndag - Fredag:</span>
                                        <span>08:00 - 18:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Lördag:</span>
                                        <span>10:00 - 15:00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Söndag:</span>
                                        <span>Stängt</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Services */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Snabbtjänster</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start">
                                    <Car className="mr-2 h-4 w-4" />
                                    Bilvärdering online
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Calculator className="mr-2 h-4 w-4" />
                                    Lånekalylator
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Försäkring
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Response Time */}
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div>
                                        <div className="font-medium text-sm">Snabb responstid</div>
                                        <div className="text-xs text-muted-foreground">
                                            Vi svarar inom 2 timmar på vardagar
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </MarketingLayout>
    );
}