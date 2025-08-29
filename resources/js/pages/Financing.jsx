import { Head, Link, useForm } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Calculator,
    CreditCard,
    Shield,
    TrendingUp,
    Users,
    Clock,
    CheckCircle,
    ArrowRight,
    Percent,
    DollarSign,
    FileText,
    Award
} from 'lucide-react';
import { useState } from 'react';

export default function Financing() {
    const [loanAmount, setLoanAmount] = useState([300000]);
    const [loanTerm, setLoanTerm] = useState([60]);
    const [downPayment, setDownPayment] = useState([60000]);
    const interestRate = 3.95;

    const calculateMonthlyPayment = () => {
        const principal = loanAmount[0] - downPayment[0];
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTerm[0];
        
        if (principal <= 0) return 0;
        
        const monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
            (Math.pow(1 + monthlyRate, numPayments) - 1);
        
        return Math.round(monthlyPayment);
    };

    const totalCost = Math.round(calculateMonthlyPayment() * loanTerm[0]);
    const totalInterest = totalCost - (loanAmount[0] - downPayment[0]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        personal_number: '',
        employment: '',
        income: '',
        loan_amount: loanAmount[0],
        down_payment: downPayment[0],
        loan_term: loanTerm[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setData({
            ...data,
            loan_amount: loanAmount[0],
            down_payment: downPayment[0],
            loan_term: loanTerm[0]
        });
        post('/financing/apply');
    };

    const partners = [
        { name: 'Santander', rate: '3.95%', logo: '🏦' },
        { name: 'Handelsbanken', rate: '4.25%', logo: '🏛️' },
        { name: 'Swedbank', rate: '4.15%', logo: '🏢' },
        { name: 'Nordea', rate: '4.35%', logo: '🏪' }
    ];

    const benefits = [
        {
            icon: Percent,
            title: 'Låga räntor',
            description: 'Från 3.95% med våra bankpartners'
        },
        {
            icon: Clock,
            title: 'Snabb process',
            description: 'Beslut inom 24 timmar'
        },
        {
            icon: Shield,
            title: 'Ingen bindningstid',
            description: 'Betala av när du vill utan extra kostnad'
        },
        {
            icon: Users,
            title: 'Personlig rådgivning',
            description: 'Våra experter hjälper dig hela vägen'
        }
    ];

    return (
        <MarketingLayout>
            <Head title="Finansiering - Din Bil Deal" />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Billån med marknadens bästa villkor
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Vi hjälper dig hitta den bästa finansieringen för din bil. 
                            Jämför lån från Sveriges ledande banker och finansbolag.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="text-lg" onClick={() => document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' })}>
                                Beräkna ditt lån
                                <Calculator className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="#apply">Ansök direkt</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Fördelar med vår finansiering</h2>
                        <p className="text-xl text-muted-foreground">
                            Vi gör det enkelt att finansiera din bil
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

            {/* Loan Calculator */}
            <section id="calculator" className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Lånekalkylator</h2>
                            <p className="text-xl text-muted-foreground">
                                Beräkna din månadskostnad och se vad lånet kostar totalt
                            </p>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Calculator Controls */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Anpassa ditt lån</CardTitle>
                                    <CardDescription>
                                        Justera parametrarna för att se hur det påverkar din månadskostnad
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <Label>Bilens pris</Label>
                                            <span className="font-semibold">{loanAmount[0].toLocaleString('sv-SE')} kr</span>
                                        </div>
                                        <Slider
                                            value={loanAmount}
                                            onValueChange={setLoanAmount}
                                            min={50000}
                                            max={1000000}
                                            step={10000}
                                            className="mb-1"
                                        />
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>50 000 kr</span>
                                            <span>1 000 000 kr</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <Label>Kontantinsats</Label>
                                            <span className="font-semibold">{downPayment[0].toLocaleString('sv-SE')} kr</span>
                                        </div>
                                        <Slider
                                            value={downPayment}
                                            onValueChange={setDownPayment}
                                            min={0}
                                            max={loanAmount[0] * 0.5}
                                            step={5000}
                                            className="mb-1"
                                        />
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>0 kr</span>
                                            <span>{Math.round(loanAmount[0] * 0.5).toLocaleString('sv-SE')} kr</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <Label>Lånetid</Label>
                                            <span className="font-semibold">{loanTerm[0]} månader</span>
                                        </div>
                                        <Slider
                                            value={loanTerm}
                                            onValueChange={setLoanTerm}
                                            min={12}
                                            max={120}
                                            step={12}
                                            className="mb-1"
                                        />
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>12 mån</span>
                                            <span>120 mån</span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Ränta (exempel)</span>
                                            <span className="font-semibold">{interestRate}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            {/* Results */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ditt lån</CardTitle>
                                    <CardDescription>
                                        Baserat på dina val
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-6 bg-primary/5 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-1">Månadskostnad</p>
                                            <p className="text-3xl font-bold text-primary">
                                                {calculateMonthlyPayment().toLocaleString('sv-SE')} kr/mån
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Lånebelopp</span>
                                                <span className="font-semibold">
                                                    {(loanAmount[0] - downPayment[0]).toLocaleString('sv-SE')} kr
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Total kostnad</span>
                                                <span className="font-semibold">
                                                    {totalCost.toLocaleString('sv-SE')} kr
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Total ränta</span>
                                                <span className="font-semibold">
                                                    {totalInterest.toLocaleString('sv-SE')} kr
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Effektiv ränta</span>
                                                <span className="font-semibold">{interestRate}%</span>
                                            </div>
                                        </div>
                                        
                                        <Button className="w-full" size="lg" onClick={() => document.getElementById('apply').scrollIntoView({ behavior: 'smooth' })}>
                                            Ansök om detta lån
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                        
                                        <p className="text-xs text-muted-foreground text-center">
                                            * Räntan är ett exempel och kan variera beroende på din kreditvärdighet
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Våra finansieringspartners</h2>
                        <p className="text-xl text-muted-foreground">
                            Vi samarbetar med Sveriges ledande banker och finansbolag
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {partners.map((partner, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-4xl mb-4">{partner.logo}</div>
                                    <h3 className="font-semibold text-lg mb-2">{partner.name}</h3>
                                    <p className="text-sm text-muted-foreground">Från {partner.rate}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section id="apply" className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-2xl">Ansök om billån</CardTitle>
                                <CardDescription>
                                    Fyll i formuläret så återkommer vi med ett lånebesked inom 24 timmar
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Personal Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Personuppgifter</h3>
                                        
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
                                        
                                        <div>
                                            <Label htmlFor="personal_number">Personnummer *</Label>
                                            <Input
                                                id="personal_number"
                                                placeholder="ÅÅÅÅMMDD-XXXX"
                                                value={data.personal_number}
                                                onChange={e => setData('personal_number', e.target.value)}
                                            />
                                            {errors.personal_number && <p className="text-sm text-destructive mt-1">{errors.personal_number}</p>}
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

                                    {/* Employment Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Anställning och ekonomi</h3>
                                        
                                        <div>
                                            <Label htmlFor="employment">Anställningsform *</Label>
                                            <Select value={data.employment} onValueChange={value => setData('employment', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Välj anställningsform" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="permanent">Tillsvidareanställd</SelectItem>
                                                    <SelectItem value="temporary">Visstidsanställd</SelectItem>
                                                    <SelectItem value="self-employed">Egen företagare</SelectItem>
                                                    <SelectItem value="retired">Pensionär</SelectItem>
                                                    <SelectItem value="student">Student</SelectItem>
                                                    <SelectItem value="other">Annat</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.employment && <p className="text-sm text-destructive mt-1">{errors.employment}</p>}
                                        </div>
                                        
                                        <div>
                                            <Label htmlFor="income">Årsinkomst före skatt (kr) *</Label>
                                            <Input
                                                id="income"
                                                type="number"
                                                placeholder="t.ex. 350000"
                                                value={data.income}
                                                onChange={e => setData('income', e.target.value)}
                                            />
                                            {errors.income && <p className="text-sm text-destructive mt-1">{errors.income}</p>}
                                        </div>
                                    </div>

                                    {/* Loan Summary */}
                                    <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                                        <h3 className="font-semibold mb-3">Lånesammanfattning</h3>
                                        <div className="flex justify-between text-sm">
                                            <span>Bilens pris:</span>
                                            <span className="font-semibold">{loanAmount[0].toLocaleString('sv-SE')} kr</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Kontantinsats:</span>
                                            <span className="font-semibold">{downPayment[0].toLocaleString('sv-SE')} kr</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Lånebelopp:</span>
                                            <span className="font-semibold">{(loanAmount[0] - downPayment[0]).toLocaleString('sv-SE')} kr</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Lånetid:</span>
                                            <span className="font-semibold">{loanTerm[0]} månader</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 border-t">
                                            <span>Beräknad månadskostnad:</span>
                                            <span className="font-semibold text-primary">
                                                {calculateMonthlyPayment().toLocaleString('sv-SE')} kr/mån
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm flex items-start">
                                            <CheckCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span>
                                                Genom att skicka in ansökan godkänner du att vi gör en kreditupplysning 
                                                och delar din information med våra finansieringspartners. 
                                                Ansökan är kostnadsfri och inte bindande.
                                            </span>
                                        </p>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full" disabled={processing}>
                                        {processing ? 'Skickar ansökan...' : 'Skicka låneansökan'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Vanliga frågor</h2>
                        
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Vad krävs för att få billån?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Du behöver vara minst 18 år, ha en fast inkomst och ingen 
                                        betalningsanmärkning. Vi gör alltid en individuell bedömning 
                                        baserat på din ekonomiska situation.
                                    </p>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Hur lång tid tar det att få besked?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Du får normalt ett preliminärt besked direkt och ett slutgiltigt 
                                        lånelöfte inom 24 timmar efter att vi fått in alla handlingar.
                                    </p>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Kan jag betala av lånet i förtid?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Ja, du kan när som helst betala av hela eller delar av lånet 
                                        utan extra kostnad. Vi har inga bindningstider eller 
                                        uppsägningsavgifter.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}