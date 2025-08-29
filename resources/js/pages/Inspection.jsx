import { Head, Link, useForm } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    FileSearch,
    CheckCircle,
    Shield,
    Clock,
    AlertTriangle,
    Car,
    Settings,
    Wrench,
    Battery,
    Gauge,
    Users,
    Calendar,
    MapPin
} from 'lucide-react';

export default function Inspection() {
    const { data, setData, post, processing, errors } = useForm({
        service_type: '',
        car_registration: '',
        car_make: '',
        car_model: '',
        car_year: '',
        location: '',
        preferred_date: '',
        preferred_time: '',
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/inspection/book');
    };

    const inspectionServices = [
        {
            id: 'basic',
            title: 'Grundbesiktning',
            price: '1,495 kr',
            duration: '45 min',
            description: 'Standard kontroll av bilens skick',
            includes: [
                'Motor och växellåda',
                'Bromsar och däck',
                'Belysning och elektronik',
                'Kaross och lack',
                'Interiör kontroll'
            ]
        },
        {
            id: 'comprehensive',
            title: 'Omfattande besiktning',
            price: '2,495 kr',
            duration: '90 min',
            description: 'Detaljerad genomgång med testköring',
            includes: [
                'Allt i grundbesiktning',
                'Testköring',
                'Diagnostisk avläsning',
                'Underredskontroll på lyft',
                'Detaljerad rapport',
                'Köprekommendation'
            ]
        },
        {
            id: 'premium',
            title: 'Premium besiktning',
            price: '3,995 kr',
            duration: '2-3 timmar',
            description: 'Komplett genomgång med värdering',
            includes: [
                'Allt i omfattande besiktning',
                'Historikkontroll',
                'Värdering',
                'Lackdjupsmätning',
                'Kompressiontest',
                'Garantiförslag',
                'Förhandlingsunderlag'
            ]
        }
    ];

    const checkpoints = [
        { icon: Settings, label: 'Motor & Mekanik', items: 150 },
        { icon: Gauge, label: 'Prestanda', items: 45 },
        { icon: Shield, label: 'Säkerhet', items: 80 },
        { icon: Battery, label: 'Elektronik', items: 60 },
        { icon: Car, label: 'Kaross & Lack', items: 40 },
        { icon: Wrench, label: 'Service & Underhåll', items: 25 }
    ];

    return (
        <MarketingLayout>
            <Head title="Bilbesiktning - Din Bil Deal" />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Professionell bilbesiktning
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Låt våra certifierade tekniker granska bilen innan köp. 
                            Vi kontrollerar över 400 punkter för din trygghet.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" onClick={() => document.getElementById('booking').scrollIntoView({ behavior: 'smooth' })}>
                                Boka besiktning
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/cars">Se våra kontrollerade bilar</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Packages */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Välj besiktningspaket</h2>
                        <p className="text-xl text-muted-foreground">
                            Anpassade paket för olika behov och budgetar
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {inspectionServices.map((service) => (
                            <Card key={service.id} className={service.id === 'comprehensive' ? 'border-primary' : ''}>
                                {service.id === 'comprehensive' && (
                                    <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                                        Mest populära
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle>{service.title}</CardTitle>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-3xl font-bold">{service.price}</span>
                                        <span className="text-muted-foreground">/ {service.duration}</span>
                                    </div>
                                    <CardDescription className="mt-2">
                                        {service.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {service.includes.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button 
                                        className="w-full mt-6" 
                                        variant={service.id === 'comprehensive' ? 'default' : 'outline'}
                                        onClick={() => {
                                            setData('service_type', service.id);
                                            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        Välj {service.title}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Inspection Points */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Vad vi kontrollerar</h2>
                        <p className="text-xl text-muted-foreground">
                            Över 400 kontrollpunkter för maximal trygghet
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
                        {checkpoints.map((checkpoint, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="pt-6">
                                    <checkpoint.icon className="h-12 w-12 text-primary mx-auto mb-3" />
                                    <h3 className="font-semibold text-sm mb-1">{checkpoint.label}</h3>
                                    <p className="text-2xl font-bold text-primary">{checkpoint.items}+</p>
                                    <p className="text-xs text-muted-foreground">kontrollpunkter</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Booking Form */}
            <section id="booking" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Boka besiktning</CardTitle>
                                <CardDescription>
                                    Fyll i formuläret så kontaktar vi dig för att boka tid
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Service Selection */}
                                    <div>
                                        <Label htmlFor="service">Välj tjänst *</Label>
                                        <Select 
                                            value={data.service_type} 
                                            onValueChange={value => setData('service_type', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Välj besiktningspaket" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="basic">Grundbesiktning - 1,495 kr</SelectItem>
                                                <SelectItem value="comprehensive">Omfattande besiktning - 2,495 kr</SelectItem>
                                                <SelectItem value="premium">Premium besiktning - 3,995 kr</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.service_type && <p className="text-sm text-destructive mt-1">{errors.service_type}</p>}
                                    </div>

                                    {/* Car Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Biluppgifter</h3>
                                        
                                        <div>
                                            <Label htmlFor="registration">Registreringsnummer (valfritt)</Label>
                                            <Input
                                                id="registration"
                                                placeholder="ABC 123"
                                                value={data.car_registration}
                                                onChange={e => setData('car_registration', e.target.value.toUpperCase())}
                                                className="uppercase"
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="make">Märke</Label>
                                                <Input
                                                    id="make"
                                                    placeholder="t.ex. Volvo"
                                                    value={data.car_make}
                                                    onChange={e => setData('car_make', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="model">Modell</Label>
                                                <Input
                                                    id="model"
                                                    placeholder="t.ex. XC60"
                                                    value={data.car_model}
                                                    onChange={e => setData('car_model', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="year">Årsmodell</Label>
                                            <Input
                                                id="year"
                                                type="number"
                                                placeholder="t.ex. 2021"
                                                value={data.car_year}
                                                onChange={e => setData('car_year', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Location and Time */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Plats och tid</h3>
                                        
                                        <div>
                                            <Label htmlFor="location">
                                                <MapPin className="inline mr-1 h-4 w-4" />
                                                Önskad plats *
                                            </Label>
                                            <Select 
                                                value={data.location} 
                                                onValueChange={value => setData('location', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Välj besiktningsstation" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="stockholm">Stockholm - Kungsgatan 10</SelectItem>
                                                    <SelectItem value="goteborg">Göteborg - Avenyn 21</SelectItem>
                                                    <SelectItem value="malmo">Malmö - Stortorget 5</SelectItem>
                                                    <SelectItem value="mobile">Mobil besiktning (vi kommer till dig)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.location && <p className="text-sm text-destructive mt-1">{errors.location}</p>}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="date">
                                                    <Calendar className="inline mr-1 h-4 w-4" />
                                                    Önskat datum
                                                </Label>
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={data.preferred_date}
                                                    onChange={e => setData('preferred_date', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="time">
                                                    <Clock className="inline mr-1 h-4 w-4" />
                                                    Önskad tid
                                                </Label>
                                                <Select 
                                                    value={data.preferred_time} 
                                                    onValueChange={value => setData('preferred_time', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Välj tid" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="morning">Förmiddag (08:00-12:00)</SelectItem>
                                                        <SelectItem value="afternoon">Eftermiddag (12:00-17:00)</SelectItem>
                                                        <SelectItem value="evening">Kväll (17:00-20:00)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Kontaktuppgifter</h3>
                                        
                                        <div>
                                            <Label htmlFor="name">Namn *</Label>
                                            <Input
                                                id="name"
                                                placeholder="För- och efternamn"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                            />
                                            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="email">E-post *</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="din@email.se"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                />
                                                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="phone">Telefon *</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="07X-XXX XX XX"
                                                    value={data.phone}
                                                    onChange={e => setData('phone', e.target.value)}
                                                />
                                                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full" disabled={processing}>
                                        {processing ? 'Bokar...' : 'Boka besiktning'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-8">Varför välja vår besiktning?</h2>
                        <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">Certifierade tekniker</h3>
                                <p className="text-sm text-muted-foreground">
                                    Alla våra besiktningsmän är utbildade och certifierade
                                </p>
                            </div>
                            <div className="text-center">
                                <FileSearch className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">Detaljerad rapport</h3>
                                <p className="text-sm text-muted-foreground">
                                    Få en omfattande rapport med bilder och rekommendationer
                                </p>
                            </div>
                            <div className="text-center">
                                <AlertTriangle className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">Oberoende granskning</h3>
                                <p className="text-sm text-muted-foreground">
                                    Vi är helt oberoende och arbetar endast för din trygghet
                                </p>
                            </div>
                            <div className="text-center">
                                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">98% nöjda kunder</h3>
                                <p className="text-sm text-muted-foreground">
                                    Över 10,000 genomförda besiktningar med högt betyg
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}