import { Head, Link, useForm } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Car,
    Search,
    CheckCircle,
    Shield,
    Clock,
    DollarSign,
    FileSearch,
    Users,
    TrendingDown,
    Info,
    Phone,
    Mail,
    User,
    Calendar,
    AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export default function CarDealRegistration() {
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [carData, setCarData] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        registration_number: '',
        car_make: '',
        car_model: '',
        car_year: '',
        car_mileage: '',
        desired_price: '',
        urgency: 'normal',
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleRegistrationSearch = async () => {
        if (!registrationNumber || registrationNumber.length < 6) {
            return;
        }
        
        setIsSearching(true);
        
        // Simulate API call to car.info
        setTimeout(() => {
            const mockData = {
                make: 'Volvo',
                model: 'XC60',
                year: '2021',
                mileage: '45000',
                fuel: 'Hybrid',
                transmission: 'Automatisk',
                color: 'Svart metallic',
                engine: '2.0L T8',
                power: '390 hk',
                owners: 1,
                nextInspection: '2024-03-15',
                estimatedValue: '385000'
            };
            
            setCarData(mockData);
            setData({
                ...data,
                registration_number: registrationNumber,
                car_make: mockData.make,
                car_model: mockData.model,
                car_year: mockData.year,
                car_mileage: mockData.mileage
            });
            setIsSearching(false);
        }, 1500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/car-deal/register');
    };

    const benefits = [
        {
            icon: Shield,
            title: 'Säker affär',
            description: 'Vi säkerställer att köpet genomförs tryggt'
        },
        {
            icon: DollarSign,
            title: 'Bästa pris',
            description: 'Vi förhandlar för att du ska få bästa möjliga pris'
        },
        {
            icon: Clock,
            title: 'Snabb process',
            description: 'Vi hanterar all administration åt dig'
        },
        {
            icon: Users,
            title: 'Experthjälp',
            description: 'Våra specialister guidar dig genom hela processen'
        }
    ];

    const process = [
        {
            step: 1,
            title: 'Registrera bil',
            description: 'Ange registreringsnummer eller biluppgifter'
        },
        {
            step: 2,
            title: 'Vi kontaktar säljaren',
            description: 'Våra experter tar kontakt och förhandlar'
        },
        {
            step: 3,
            title: 'Besiktning & kontroll',
            description: 'Vi säkerställer bilens skick och historik'
        },
        {
            step: 4,
            title: 'Slutför affären',
            description: 'Vi hjälper med all dokumentation och betalning'
        }
    ];

    return (
        <MarketingLayout>
            <Head title="Registrera bilaffär - Din Bil Deal" />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Låt oss hjälpa dig köpa bilen du vill ha
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Hittade du en bil du gillar? Vi tar hand om förhandling, 
                            besiktning och all administration. Endast 1% provision vid lyckad affär.
                        </p>
                        <Alert className="text-left max-w-2xl mx-auto">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Så fungerar det:</strong> Du anger bilens registreringsnummer, 
                                vi hämtar all information automatiskt från Transportstyrelsen och 
                                kontaktar säljaren åt dig. Du betalar ingenting förrän affären är klar.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Så här går det till</h2>
                        <p className="text-xl text-muted-foreground">
                            Vi gör bilköpet enkelt och tryggt för dig
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {process.map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-xl">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Registration Form */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Registrera din bilaffär</CardTitle>
                                        <CardDescription>
                                            Ange bilens registreringsnummer så hämtar vi all information automatiskt
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Registration Number Search */}
                                            <div className="p-6 bg-primary/5 rounded-lg">
                                                <Label htmlFor="reg_search" className="text-base font-semibold mb-3 block">
                                                    <Car className="inline mr-2 h-5 w-5 text-primary" />
                                                    Sök med registreringsnummer
                                                </Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="reg_search"
                                                        placeholder="ABC 123"
                                                        value={registrationNumber}
                                                        onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                                                        className="uppercase flex-1"
                                                    />
                                                    <Button 
                                                        type="button"
                                                        onClick={handleRegistrationSearch}
                                                        disabled={isSearching || registrationNumber.length < 6}
                                                    >
                                                        {isSearching ? (
                                                            <>
                                                                <Clock className="mr-2 h-4 w-4 animate-spin" />
                                                                Söker...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Search className="mr-2 h-4 w-4" />
                                                                Sök
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    Vi hämtar bilens information från Transportstyrelsen
                                                </p>
                                            </div>

                                            {/* Car Data Display */}
                                            {carData && (
                                                <Alert className="border-primary/20 bg-primary/5">
                                                    <CheckCircle className="h-4 w-4 text-primary" />
                                                    <AlertDescription>
                                                        <strong className="block mb-2">Bil hittad!</strong>
                                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                                            <div>
                                                                <span className="text-muted-foreground">Märke & Modell:</span> {carData.make} {carData.model}
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">År:</span> {carData.year}
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Miltal:</span> {carData.mileage} km
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Drivmedel:</span> {carData.fuel}
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Växellåda:</span> {carData.transmission}
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground">Färg:</span> {carData.color}
                                                            </div>
                                                            <div className="col-span-2 mt-2 pt-2 border-t">
                                                                <span className="text-muted-foreground">Uppskattat värde:</span>{' '}
                                                                <span className="font-semibold text-primary">
                                                                    {parseInt(carData.estimatedValue).toLocaleString('sv-SE')} kr
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {/* Manual Car Details (if no registration) */}
                                            {!carData && (
                                                <div className="space-y-4">
                                                    <h3 className="font-semibold">Eller ange biluppgifter manuellt</h3>
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
                                                        <div>
                                                            <Label htmlFor="mileage">Miltal (km)</Label>
                                                            <Input
                                                                id="mileage"
                                                                type="number"
                                                                placeholder="t.ex. 45000"
                                                                value={data.car_mileage}
                                                                onChange={e => setData('car_mileage', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Deal Details */}
                                            <div className="space-y-4">
                                                <h3 className="font-semibold">Affärsdetaljer</h3>
                                                
                                                <div>
                                                    <Label htmlFor="desired_price">Önskat pris (SEK)</Label>
                                                    <Input
                                                        id="desired_price"
                                                        type="number"
                                                        placeholder="Vad är du villig att betala?"
                                                        value={data.desired_price}
                                                        onChange={e => setData('desired_price', e.target.value)}
                                                    />
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Vi förhandlar för att få bästa möjliga pris
                                                    </p>
                                                </div>
                                                
                                                <div>
                                                    <Label>Hur bråttom har du?</Label>
                                                    <div className="flex gap-4 mt-2">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="urgency"
                                                                value="urgent"
                                                                checked={data.urgency === 'urgent'}
                                                                onChange={e => setData('urgency', e.target.value)}
                                                                className="mr-2"
                                                            />
                                                            <span className="text-sm">Akut (inom 1 vecka)</span>
                                                        </label>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="urgency"
                                                                value="normal"
                                                                checked={data.urgency === 'normal'}
                                                                onChange={e => setData('urgency', e.target.value)}
                                                                className="mr-2"
                                                            />
                                                            <span className="text-sm">Normal (2-4 veckor)</span>
                                                        </label>
                                                        <label className="flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="urgency"
                                                                value="flexible"
                                                                checked={data.urgency === 'flexible'}
                                                                onChange={e => setData('urgency', e.target.value)}
                                                                className="mr-2"
                                                            />
                                                            <span className="text-sm">Flexibel</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="message">Meddelande (valfritt)</Label>
                                                    <Textarea
                                                        id="message"
                                                        placeholder="Berätta mer om vad du letar efter eller har för frågor"
                                                        value={data.message}
                                                        onChange={e => setData('message', e.target.value)}
                                                        rows={4}
                                                    />
                                                </div>
                                            </div>

                                            {/* Contact Information */}
                                            <div className="space-y-4">
                                                <h3 className="font-semibold">Kontaktuppgifter</h3>
                                                
                                                <div>
                                                    <Label htmlFor="name">
                                                        <User className="inline mr-1 h-4 w-4" />
                                                        Namn *
                                                    </Label>
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
                                                        <Label htmlFor="email">
                                                            <Mail className="inline mr-1 h-4 w-4" />
                                                            E-post *
                                                        </Label>
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
                                                        <Label htmlFor="phone">
                                                            <Phone className="inline mr-1 h-4 w-4" />
                                                            Telefon *
                                                        </Label>
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

                                            <Alert>
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    <strong>Ingen kostnad förrän affären är klar!</strong> Vi tar endast 
                                                    1% provision när du köpt bilen. Om affären inte går igenom betalar du ingenting.
                                                </AlertDescription>
                                            </Alert>

                                            <Button type="submit" size="lg" className="w-full" disabled={processing}>
                                                {processing ? 'Skickar...' : 'Registrera bilaffär'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Benefits */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Fördelar</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-start">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                                    <benefit.icon className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm">{benefit.title}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {benefit.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Savings Calculator */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <TrendingDown className="mr-2 h-5 w-5 text-primary" />
                                            Potentiell besparing
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Våra kunder sparar i genomsnitt 15-20% på bilköp genom vår 
                                            förhandling och expertis.
                                        </p>
                                        <div className="p-4 bg-primary/5 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-1">
                                                På en bil för 300 000 kr
                                            </p>
                                            <p className="text-2xl font-bold text-primary">
                                                45 000 - 60 000 kr
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                i potentiell besparing
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Trust Badge */}
                                <Card>
                                    <CardContent className="pt-6 text-center">
                                        <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
                                        <h4 className="font-semibold mb-2">100% Trygg affär</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Vi är medlemmar i Motorbranschens Riksförbund och följer 
                                            alla branschstandarder.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}