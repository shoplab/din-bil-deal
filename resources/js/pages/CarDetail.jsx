import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    ArrowLeft,
    Phone, 
    Mail, 
    MapPin, 
    Calendar, 
    Fuel, 
    Gauge,
    Cog,
    Shield,
    Star,
    Heart,
    Share2,
    Calculator,
    FileText,
    CheckCircle,
    AlertCircle,
    Car,
    Users,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CarDetail({ car, similarCars = [], seller = null }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [showContactForm, setShowContactForm] = useState(false);

    // Sample car data if not provided
    const sampleCar = car || {
        id: 1,
        make: 'Volvo',
        model: 'XC90 T8 AWD',
        variant: 'Inscription',
        year: 2023,
        price: 849000,
        originalPrice: 895000,
        mileage: 2500,
        fuelType: 'Hybrid',
        transmission: 'Automat',
        location: 'Stockholm',
        featured: true,
        rating: 4.8,
        images: [
            '/images/car-placeholder.jpg',
            '/images/car-interior.jpg',
            '/images/car-engine.jpg'
        ],
        description: 'Denna Volvo XC90 T8 AWD Inscription från 2023 är en fantastisk familjebil som kombinerar luxus, prestanda och miljövänlighet. Bilen är i utmärkt skick och har körts varsamt av en ägare.',
        features: [
            'Luftkonditionering',
            'Navigationsystem',
            'Backkamera',
            'Värmda säten',
            'Panoramatak',
            'Parkeringshjälp',
            'Bluetooth',
            'Cruise control',
            'LED-strålkastare',
            'Läderklädsel'
        ],
        specifications: {
            engine: '2.0L Turbo + Elmotor',
            power: '400 hk',
            torque: '640 Nm',
            topSpeed: '230 km/h',
            acceleration: '5.4 s (0-100 km/h)',
            fuelConsumption: '0.8 l/100km',
            electricRange: '65 km',
            co2Emissions: '18 g/km',
            drivetrain: 'AWD',
            seats: '7',
            doors: '5',
            weight: '2334 kg'
        },
        history: {
            owners: 1,
            accidents: 0,
            serviceRecords: 3,
            lastService: '2024-01-15',
            registrationDate: '2023-03-15',
            nextInspection: '2025-03-15'
        },
        financing: {
            monthlyPayment: 8990,
            downPayment: 169800,
            loanTerm: 84,
            interestRate: 3.95
        }
    };

    const displayCar = car || sampleCar;

    const sampleSeller = seller || {
        name: 'Erik Andersson',
        title: 'Certifierad bilsäljare',
        avatar: null,
        rating: 4.9,
        reviews: 127,
        phone: '08-123 456 78',
        email: 'erik@dinbildeal.se',
        dealership: 'Din Bil Deal Stockholm'
    };

    return (
        <MarketingLayout>
            <Head title={`${displayCar.make} ${displayCar.model} ${displayCar.year} - Din Bil Deal`} />
            
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-primary">Hem</Link>
                    <span>/</span>
                    <Link href="/cars" className="hover:text-primary">Bilar till salu</Link>
                    <span>/</span>
                    <span className="text-foreground">
                        {displayCar.make} {displayCar.model}
                    </span>
                </div>

                {/* Back Button */}
                <Button variant="ghost" className="mb-6 -ml-4" onClick={() => router.visit('/cars')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Tillbaka till sökresultat
                </Button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold">
                                            {displayCar.make} {displayCar.model}
                                        </h1>
                                        {displayCar.featured && (
                                            <Badge>Utvalda</Badge>
                                        )}
                                    </div>
                                    <p className="text-lg text-muted-foreground">
                                        {displayCar.variant} • {displayCar.year} • {displayCar.mileage.toLocaleString()} mil
                                    </p>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {displayCar.location}
                                </div>
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 mr-1 fill-current text-yellow-500" />
                                    {displayCar.rating} betyg
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div>
                            <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                                {/* Main image placeholder */}
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                    <Car className="h-24 w-24 text-primary/40" />
                                </div>
                            </div>
                            
                            {/* Thumbnail navigation */}
                            <div className="grid grid-cols-4 gap-2">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div 
                                        key={index}
                                        className={cn(
                                            "aspect-video bg-muted rounded cursor-pointer border-2 overflow-hidden",
                                            selectedImage === index ? "border-primary" : "border-transparent"
                                        )}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                            <Car className="h-8 w-8 text-primary/40" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">Översikt</TabsTrigger>
                                <TabsTrigger value="specs">Specifikationer</TabsTrigger>
                                <TabsTrigger value="history">Historik</TabsTrigger>
                                <TabsTrigger value="financing">Finansiering</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="overview" className="mt-6">
                                <div className="space-y-6">
                                    {/* Description */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Beskrivning</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {displayCar.description}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Key Features */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Utrustning och funktioner</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {displayCar.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center">
                                                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="specs" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tekniska specifikationer</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold flex items-center">
                                                    <Zap className="h-4 w-4 mr-2" />
                                                    Motor och prestanda
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Motor:</span>
                                                        <span>{displayCar.specifications.engine}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Effekt:</span>
                                                        <span>{displayCar.specifications.power}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Vridmoment:</span>
                                                        <span>{displayCar.specifications.torque}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Toppfart:</span>
                                                        <span>{displayCar.specifications.topSpeed}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Acceleration:</span>
                                                        <span>{displayCar.specifications.acceleration}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <h4 className="font-semibold flex items-center">
                                                    <Car className="h-4 w-4 mr-2" />
                                                    Allmänt
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Drivlina:</span>
                                                        <span>{displayCar.specifications.drivetrain}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Antal säten:</span>
                                                        <span>{displayCar.specifications.seats}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Antal dörrar:</span>
                                                        <span>{displayCar.specifications.doors}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Vikt:</span>
                                                        <span>{displayCar.specifications.weight}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">CO₂-utsläpp:</span>
                                                        <span>{displayCar.specifications.co2Emissions}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="history" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Bilens historik</CardTitle>
                                        <CardDescription>
                                            Fullständig historik och dokumentation
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">Antal ägare:</span>
                                                        <div className="flex items-center">
                                                            <Users className="h-4 w-4 mr-1 text-green-600" />
                                                            <span>{displayCar.history.owners}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">Rapporterade skador:</span>
                                                        <div className="flex items-center">
                                                            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                                            <span>{displayCar.history.accidents}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">Servicehistorik:</span>
                                                        <div className="flex items-center">
                                                            <FileText className="h-4 w-4 mr-1 text-green-600" />
                                                            <span>{displayCar.history.serviceRecords} st</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">Senaste service:</span>
                                                        <span>{displayCar.history.lastService}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">Registrerad:</span>
                                                        <span>{displayCar.history.registrationDate}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">Nästa besiktning:</span>
                                                        <span>{displayCar.history.nextInspection}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            <TabsContent value="financing" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Finansieringsalternativ</CardTitle>
                                        <CardDescription>
                                            Beräkna din månadskostnad
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div className="p-4 bg-muted/50 rounded-lg">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Månadskostnad från</div>
                                                        <div className="text-2xl font-bold text-primary">
                                                            {displayCar.financing.monthlyPayment.toLocaleString()} kr/mån
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-muted-foreground">Kontantinsats</div>
                                                        <div className="text-xl font-semibold">
                                                            {displayCar.financing.downPayment.toLocaleString()} kr
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Löptid:</span>
                                                    <span>{displayCar.financing.loanTerm} månader</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Ränta:</span>
                                                    <span>{displayCar.financing.interestRate}%</span>
                                                </div>
                                            </div>
                                            
                                            <Button className="w-full">
                                                <Calculator className="mr-2 h-4 w-4" />
                                                Beräkna ditt lån
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <div className="text-3xl font-bold mb-2">
                                        {displayCar.price.toLocaleString()} kr
                                    </div>
                                    {displayCar.originalPrice > displayCar.price && (
                                        <div className="text-sm text-muted-foreground line-through">
                                            {displayCar.originalPrice.toLocaleString()} kr
                                        </div>
                                    )}
                                    <div className="text-sm text-muted-foreground">
                                        från {displayCar.financing.monthlyPayment.toLocaleString()} kr/mån
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <Button className="w-full" size="lg">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Ring säljare
                                    </Button>
                                    <Button variant="outline" className="w-full" size="lg">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Skicka meddelande
                                    </Button>
                                    
                                    {/* Booking Buttons */}
                                    <div className="space-y-2">
                                        <Button 
                                            variant="outline" 
                                            className="w-full"
                                            onClick={() => router.visit(`/customer/appointments/create/${displayCar.id}`)}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Boka provkörning
                                        </Button>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                className="text-xs"
                                                onClick={() => router.visit(`/customer/appointments/create/${displayCar.id}?type=viewing`)}
                                            >
                                                Boka visning
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                className="text-xs"
                                                onClick={() => router.visit(`/customer/appointments/create/${displayCar.id}?type=consultation`)}
                                            >
                                                Boka rådgivning
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Quick Facts */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Årsmodell:</span>
                                        <span>{displayCar.year}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Mätarställning:</span>
                                        <span>{displayCar.mileage.toLocaleString()} mil</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Bränsle:</span>
                                        <span>{displayCar.fuelType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Växellåda:</span>
                                        <span>{displayCar.transmission}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seller Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Din säljare</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-3 mb-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback>
                                            {sampleSeller.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">{sampleSeller.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {sampleSeller.title}
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Star className="h-3 w-3 fill-current text-yellow-500 mr-1" />
                                            {sampleSeller.rating} ({sampleSeller.reviews} recensioner)
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-sm text-muted-foreground mb-4">
                                    {sampleSeller.dealership}
                                </div>
                                
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <Phone className="mr-2 h-4 w-4" />
                                        {sampleSeller.phone}
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Skicka e-post
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Guarantee Card */}
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <Shield className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm">12 månaders garanti</div>
                                        <div className="text-xs text-muted-foreground">
                                            Ingår i priset
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