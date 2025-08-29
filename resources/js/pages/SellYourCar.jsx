import { Head, Link, useForm } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Car, 
    CheckCircle, 
    Clock, 
    DollarSign, 
    Shield,
    Phone,
    Mail,
    ArrowRight,
    Calculator,
    FileCheck,
    Users,
    TrendingUp
} from 'lucide-react';

export default function SellYourCar() {
    const { data, setData, post, processing, errors } = useForm({
        registration_number: '',
        name: '',
        email: '',
        phone: '',
        make: '',
        model: '',
        year: '',
        mileage: '',
        expected_price: '',
        description: '',
        contact_preference: 'phone'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/sell/submit');
    };

    const steps = [
        {
            icon: FileCheck,
            title: 'Registrera din bil',
            description: 'Ange registreringsnummer eller biluppgifter'
        },
        {
            icon: Calculator,
            title: 'Få värdering',
            description: 'Vi värderar din bil baserat på marknadsdata'
        },
        {
            icon: Users,
            title: 'Möt köpare',
            description: 'Vi matchar dig med intresserade köpare'
        },
        {
            icon: DollarSign,
            title: 'Slutför affären',
            description: 'Vi hjälper dig genom hela försäljningsprocessen'
        }
    ];

    const benefits = [
        {
            icon: TrendingUp,
            title: 'Bästa priset',
            description: 'Vi hjälper dig få marknadens bästa pris för din bil'
        },
        {
            icon: Clock,
            title: 'Snabb försäljning',
            description: 'Sälj din bil inom 7 dagar med vår hjälp'
        },
        {
            icon: Shield,
            title: 'Säker affär',
            description: 'Alla affärer genomförs säkert med vår garanti'
        },
        {
            icon: Users,
            title: 'Tusentals köpare',
            description: 'Tillgång till vårt nätverk av verifierade köpare'
        }
    ];

    return (
        <MarketingLayout>
            <Head title="Sälj din bil - Din Bil Deal" />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Sälj din bil enkelt och säkert
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Vi hjälper dig att få bästa möjliga pris för din bil. 
                            Gratis värdering och endast 1% provision vid försäljning.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="text-lg" onClick={() => document.getElementById('sell-form').scrollIntoView({ behavior: 'smooth' })}>
                                Börja sälja nu
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/valuation">Få gratis värdering</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Så fungerar det</h2>
                        <p className="text-xl text-muted-foreground">
                            Fyra enkla steg till en lyckad bilförsäljning
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                                        <step.icon className="h-8 w-8 text-primary" />
                                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-[60%] w-full">
                                        <ArrowRight className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Varför sälja genom oss?</h2>
                        <p className="text-xl text-muted-foreground">
                            Fördelar som gör skillnad för dig som säljare
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <Card key={index} className="text-center">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <benefit.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sell Form */}
            <section id="sell-form" className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Registrera din bil för försäljning</CardTitle>
                                <CardDescription>
                                    Fyll i formuläret så kontaktar vi dig inom 24 timmar med en värdering
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Registration Number Section */}
                                    <div className="space-y-4 p-4 bg-primary/5 rounded-lg">
                                        <h3 className="font-semibold flex items-center">
                                            <Car className="mr-2 h-5 w-5 text-primary" />
                                            Snabbregistrering med registreringsnummer
                                        </h3>
                                        <div>
                                            <Label htmlFor="registration_number">
                                                Registreringsnummer (valfritt)
                                            </Label>
                                            <Input
                                                id="registration_number"
                                                placeholder="ABC 123"
                                                value={data.registration_number}
                                                onChange={e => setData('registration_number', e.target.value)}
                                                className="uppercase"
                                            />
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Vi hämtar automatiskt bilens uppgifter från Transportstyrelsen
                                            </p>
                                        </div>
                                    </div>

                                    {/* Car Details */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Biluppgifter</h3>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="make">Märke *</Label>
                                                <Select value={data.make} onValueChange={value => setData('make', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Välj märke" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="volvo">Volvo</SelectItem>
                                                        <SelectItem value="bmw">BMW</SelectItem>
                                                        <SelectItem value="audi">Audi</SelectItem>
                                                        <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                                                        <SelectItem value="volkswagen">Volkswagen</SelectItem>
                                                        <SelectItem value="toyota">Toyota</SelectItem>
                                                        <SelectItem value="tesla">Tesla</SelectItem>
                                                        <SelectItem value="other">Annat</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.make && <p className="text-sm text-destructive mt-1">{errors.make}</p>}
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="model">Modell *</Label>
                                                <Input
                                                    id="model"
                                                    placeholder="t.ex. XC60"
                                                    value={data.model}
                                                    onChange={e => setData('model', e.target.value)}
                                                />
                                                {errors.model && <p className="text-sm text-destructive mt-1">{errors.model}</p>}
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="year">Årsmodell *</Label>
                                                <Select value={data.year} onValueChange={value => setData('year', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Välj år" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[...Array(15)].map((_, i) => {
                                                            const year = new Date().getFullYear() - i;
                                                            return (
                                                                <SelectItem key={year} value={year.toString()}>
                                                                    {year}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                                {errors.year && <p className="text-sm text-destructive mt-1">{errors.year}</p>}
                                            </div>
                                            
                                            <div>
                                                <Label htmlFor="mileage">Miltal (km) *</Label>
                                                <Input
                                                    id="mileage"
                                                    type="number"
                                                    placeholder="t.ex. 45000"
                                                    value={data.mileage}
                                                    onChange={e => setData('mileage', e.target.value)}
                                                />
                                                {errors.mileage && <p className="text-sm text-destructive mt-1">{errors.mileage}</p>}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="expected_price">Önskat pris (SEK)</Label>
                                            <Input
                                                id="expected_price"
                                                type="number"
                                                placeholder="t.ex. 250000"
                                                value={data.expected_price}
                                                onChange={e => setData('expected_price', e.target.value)}
                                            />
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Lämna tomt för att få vår rekommendation
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="description">Beskriv din bil</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Berätta om bilens skick, utrustning, historik etc."
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                rows={4}
                                            />
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
                                        
                                        <div>
                                            <Label>Föredragen kontaktmetod</Label>
                                            <div className="flex gap-4 mt-2">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="contact_preference"
                                                        value="phone"
                                                        checked={data.contact_preference === 'phone'}
                                                        onChange={e => setData('contact_preference', e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    <Phone className="mr-1 h-4 w-4" />
                                                    Telefon
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="contact_preference"
                                                        value="email"
                                                        checked={data.contact_preference === 'email'}
                                                        onChange={e => setData('contact_preference', e.target.value)}
                                                        className="mr-2"
                                                    />
                                                    <Mail className="mr-1 h-4 w-4" />
                                                    E-post
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-primary/5 p-4 rounded-lg">
                                        <p className="text-sm flex items-start">
                                            <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span>
                                                Genom att skicka in formuläret godkänner du våra villkor och 
                                                att vi kontaktar dig angående försäljningen av din bil. 
                                                Ingen avgift tas ut förrän bilen är såld.
                                            </span>
                                        </p>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full" disabled={processing}>
                                        {processing ? 'Skickar...' : 'Skicka in för värdering'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-8">
                            Över 10 000 nöjda säljare
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">10k+</div>
                                <p className="text-muted-foreground">Sålda bilar</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">7 dagar</div>
                                <p className="text-muted-foreground">Genomsnittlig försäljningstid</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                                <p className="text-muted-foreground">Nöjda kunder</p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">1%</div>
                                <p className="text-muted-foreground">Provision</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}