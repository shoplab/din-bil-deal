import { Head, useForm } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
    Calculator,
    Car,
    TrendingUp,
    CheckCircle,
    FileText,
    Clock,
    Shield,
    Search
} from 'lucide-react';
import { useState } from 'react';

export default function Valuation() {
    const [valuationResult, setValuationResult] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        registration_number: '',
        make: '',
        model: '',
        year: '',
        mileage: '',
        condition: '',
        service_history: '',
        owners: '',
        description: '',
        name: '',
        email: '',
        phone: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate valuation calculation
        const baseValue = 250000;
        const mileageAdjustment = data.mileage ? (100000 - parseInt(data.mileage)) * 0.5 : 0;
        const conditionMultiplier = data.condition === 'excellent' ? 1.1 : data.condition === 'good' ? 1 : 0.9;
        const estimatedValue = Math.round((baseValue + mileageAdjustment) * conditionMultiplier);
        
        setValuationResult({
            low: Math.round(estimatedValue * 0.9),
            mid: estimatedValue,
            high: Math.round(estimatedValue * 1.1)
        });
    };

    return (
        <MarketingLayout>
            <Head title="Bilvärdering - Din Bil Deal" />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Gratis bilvärdering online
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Få en professionell värdering av din bil på några minuter. 
                            Baserat på aktuell marknadsdata och över 10 000 genomförda affärer.
                        </p>
                    </div>
                </div>
            </section>

            {/* Valuation Form */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl">Värdera din bil</CardTitle>
                                        <CardDescription>
                                            Fyll i bilens uppgifter för att få en värdering
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Quick Search */}
                                            <div className="p-4 bg-primary/5 rounded-lg">
                                                <Label htmlFor="registration">
                                                    <Car className="inline mr-2 h-4 w-4" />
                                                    Registreringsnummer (för snabb värdering)
                                                </Label>
                                                <div className="flex gap-2 mt-2">
                                                    <Input
                                                        id="registration"
                                                        placeholder="ABC 123"
                                                        value={data.registration_number}
                                                        onChange={e => setData('registration_number', e.target.value.toUpperCase())}
                                                        className="uppercase"
                                                    />
                                                    <Button type="button" variant="outline">
                                                        <Search className="h-4 w-4" />
                                                    </Button>
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
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    
                                                    <div>
                                                        <Label htmlFor="model">Modell *</Label>
                                                        <Input
                                                            id="model"
                                                            placeholder="t.ex. XC60"
                                                            value={data.model}
                                                            onChange={e => setData('model', e.target.value)}
                                                        />
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
                                                    </div>
                                                </div>
                                                
                                                <div>
                                                    <Label htmlFor="condition">Skick *</Label>
                                                    <Select value={data.condition} onValueChange={value => setData('condition', value)}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Välj skick" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="excellent">Utmärkt - Som ny</SelectItem>
                                                            <SelectItem value="good">Bra - Normalt slitage</SelectItem>
                                                            <SelectItem value="fair">Okej - Vissa brister</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="service">Servicehistorik</Label>
                                                        <Select value={data.service_history} onValueChange={value => setData('service_history', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Välj" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="complete">Fullständig</SelectItem>
                                                                <SelectItem value="partial">Delvis</SelectItem>
                                                                <SelectItem value="none">Saknas</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    
                                                    <div>
                                                        <Label htmlFor="owners">Antal ägare</Label>
                                                        <Select value={data.owners} onValueChange={value => setData('owners', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Välj" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="1">1 ägare</SelectItem>
                                                                <SelectItem value="2">2 ägare</SelectItem>
                                                                <SelectItem value="3">3+ ägare</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contact for detailed valuation */}
                                            <div className="space-y-4">
                                                <h3 className="font-semibold">Få detaljerad värdering (valfritt)</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Lämna dina kontaktuppgifter för att få en mer detaljerad värdering från våra experter
                                                </p>
                                                
                                                <div>
                                                    <Label htmlFor="name">Namn</Label>
                                                    <Input
                                                        id="name"
                                                        placeholder="För- och efternamn"
                                                        value={data.name}
                                                        onChange={e => setData('name', e.target.value)}
                                                    />
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="email">E-post</Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            placeholder="din@email.se"
                                                            value={data.email}
                                                            onChange={e => setData('email', e.target.value)}
                                                        />
                                                    </div>
                                                    
                                                    <div>
                                                        <Label htmlFor="phone">Telefon</Label>
                                                        <Input
                                                            id="phone"
                                                            type="tel"
                                                            placeholder="07X-XXX XX XX"
                                                            value={data.phone}
                                                            onChange={e => setData('phone', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <Button type="submit" size="lg" className="w-full" disabled={processing}>
                                                {processing ? 'Beräknar...' : 'Få värdering'}
                                            </Button>
                                        </form>

                                        {/* Valuation Result */}
                                        {valuationResult && (
                                            <div className="mt-8 p-6 bg-primary/5 rounded-lg">
                                                <h3 className="text-xl font-semibold mb-4">Din bilvärdering</h3>
                                                <div className="grid grid-cols-3 gap-4 text-center">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-1">Låg</p>
                                                        <p className="text-xl font-bold">
                                                            {valuationResult.low.toLocaleString('sv-SE')} kr
                                                        </p>
                                                    </div>
                                                    <div className="bg-primary/10 rounded-lg p-3">
                                                        <p className="text-sm text-muted-foreground mb-1">Marknadsvärde</p>
                                                        <p className="text-2xl font-bold text-primary">
                                                            {valuationResult.mid.toLocaleString('sv-SE')} kr
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-1">Hög</p>
                                                        <p className="text-xl font-bold">
                                                            {valuationResult.high.toLocaleString('sv-SE')} kr
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-4">
                                                    *Värderingen baseras på marknadsdata och är endast en uppskattning. 
                                                    För exakt värdering rekommenderar vi en fysisk besiktning.
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Vad ingår?</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-sm">Marknadsanalys</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Baserat på aktuella försäljningar
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-sm">Prisintervall</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Låg, medel och hög värdering
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-medium text-sm">Säljrekommendationer</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Tips för bästa försäljningspris
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Varför värdera?</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-start">
                                            <TrendingUp className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                Få rätt pris vid försäljning
                                            </p>
                                        </div>
                                        <div className="flex items-start">
                                            <Shield className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                Undvik att sälja för billigt
                                            </p>
                                        </div>
                                        <div className="flex items-start">
                                            <Clock className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                Spara tid vid förhandling
                                            </p>
                                        </div>
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