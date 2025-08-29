import { Head, Link, useForm } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
    Target,
    ChevronRight,
    ChevronLeft,
    CheckCircle,
    Car,
    Users,
    MapPin,
    Fuel,
    Package,
    Shield,
    Zap,
    Heart,
    DollarSign,
    Calendar
} from 'lucide-react';
import { useState } from 'react';

export default function NeedsAnalysis() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const questions = [
        {
            id: 'budget',
            icon: DollarSign,
            title: 'Vad är din budget?',
            subtitle: 'Välj det prisintervall som passar dig bäst',
            type: 'single',
            options: [
                { value: '0-100000', label: 'Under 100 000 kr', description: 'Bra begagnade bilar' },
                { value: '100000-250000', label: '100 000 - 250 000 kr', description: 'Nyare begagnade bilar' },
                { value: '250000-400000', label: '250 000 - 400 000 kr', description: 'Premium begagnade eller nya bilar' },
                { value: '400000-600000', label: '400 000 - 600 000 kr', description: 'Nya bilar med bra utrustning' },
                { value: '600000+', label: 'Över 600 000 kr', description: 'Premium och lyxbilar' }
            ]
        },
        {
            id: 'usage',
            icon: MapPin,
            title: 'Hur kommer du främst använda bilen?',
            subtitle: 'Välj det alternativ som bäst beskriver din körning',
            type: 'single',
            options: [
                { value: 'city', label: 'Stadskörning', description: 'Korta resor, parkering i trånga utrymmen' },
                { value: 'commute', label: 'Pendling', description: 'Daglig körning till och från jobbet' },
                { value: 'highway', label: 'Långkörning', description: 'Mycket motorvägskörning' },
                { value: 'mixed', label: 'Blandat', description: 'Lite av varje' },
                { value: 'recreation', label: 'Fritid och semester', description: 'Helger och semesterresor' }
            ]
        },
        {
            id: 'family',
            icon: Users,
            title: 'Hur stor är din familj/hushåll?',
            subtitle: 'Detta hjälper oss rekommendera rätt storlek',
            type: 'single',
            options: [
                { value: '1', label: 'Ensamhushåll', description: 'Mest för egen körning' },
                { value: '2', label: 'Par utan barn', description: 'Två vuxna' },
                { value: '3-4', label: 'Småbarnsfamilj', description: '2 vuxna + 1-2 barn' },
                { value: '5+', label: 'Stor familj', description: '2 vuxna + 3+ barn' },
                { value: 'varies', label: 'Varierar', description: 'Behöver flexibilitet' }
            ]
        },
        {
            id: 'fuel',
            icon: Fuel,
            title: 'Vilken drivlina föredrar du?',
            subtitle: 'Tänk på körsträcka och laddningsmöjligheter',
            type: 'single',
            options: [
                { value: 'petrol', label: 'Bensin', description: 'Traditionell, brett utbud' },
                { value: 'diesel', label: 'Diesel', description: 'Bra för långkörning' },
                { value: 'hybrid', label: 'Hybrid', description: 'Kombination el och bensin/diesel' },
                { value: 'plugin', label: 'Laddhybrid', description: 'Eldrift för kortare sträckor' },
                { value: 'electric', label: 'Elbil', description: '100% elektrisk' },
                { value: 'any', label: 'Spelar ingen roll', description: 'Öppen för alla alternativ' }
            ]
        },
        {
            id: 'size',
            icon: Car,
            title: 'Vilken bilstorlek passar dig?',
            subtitle: 'Tänk på parkering och körkomfort',
            type: 'single',
            options: [
                { value: 'small', label: 'Liten bil', description: 'Stadsvänlig, lätt att parkera' },
                { value: 'compact', label: 'Kompakt', description: 'Bra balans storlek/praktisk' },
                { value: 'midsize', label: 'Mellanstorlek', description: 'Rymlig för familjen' },
                { value: 'large', label: 'Stor bil', description: 'Maximal komfort och utrymme' },
                { value: 'suv', label: 'SUV', description: 'Högre körställning, robust' }
            ]
        },
        {
            id: 'features',
            icon: Package,
            title: 'Vilka funktioner är viktiga för dig?',
            subtitle: 'Välj upp till 3 alternativ',
            type: 'multiple',
            maxSelections: 3,
            options: [
                { value: 'safety', label: 'Säkerhet', description: 'Avancerade säkerhetssystem' },
                { value: 'economy', label: 'Bränsleekonomi', description: 'Låg förbrukning' },
                { value: 'performance', label: 'Prestanda', description: 'Kraft och körglädje' },
                { value: 'comfort', label: 'Komfort', description: 'Bekväm körupplevelse' },
                { value: 'technology', label: 'Teknik', description: 'Modern infotainment' },
                { value: 'space', label: 'Lastutrymme', description: 'Stort bagageutrymme' },
                { value: 'towing', label: 'Dragkrok', description: 'Möjlighet att dra släp' },
                { value: 'awd', label: 'Fyrhjulsdrift', description: 'Bättre grepp' }
            ]
        },
        {
            id: 'brand',
            icon: Award,
            title: 'Har du några märkespreferenser?',
            subtitle: 'Välj de märken du föredrar (valfritt)',
            type: 'multiple',
            maxSelections: 5,
            options: [
                { value: 'volvo', label: 'Volvo' },
                { value: 'volkswagen', label: 'Volkswagen' },
                { value: 'bmw', label: 'BMW' },
                { value: 'mercedes', label: 'Mercedes-Benz' },
                { value: 'audi', label: 'Audi' },
                { value: 'toyota', label: 'Toyota' },
                { value: 'tesla', label: 'Tesla' },
                { value: 'kia', label: 'Kia' },
                { value: 'hyundai', label: 'Hyundai' },
                { value: 'peugeot', label: 'Peugeot' },
                { value: 'ford', label: 'Ford' },
                { value: 'any', label: 'Öppen för alla märken' }
            ]
        },
        {
            id: 'timeline',
            icon: Calendar,
            title: 'När planerar du att köpa?',
            subtitle: 'Detta hjälper oss prioritera våra rekommendationer',
            type: 'single',
            options: [
                { value: 'immediate', label: 'Omgående', description: 'Inom 1 vecka' },
                { value: '1month', label: 'Inom en månad', description: '2-4 veckor' },
                { value: '3months', label: 'Inom 3 månader', description: '1-3 månader' },
                { value: '6months', label: 'Inom 6 månader', description: '3-6 månader' },
                { value: 'researching', label: 'Undersöker marknaden', description: 'Ingen brådska' }
            ]
        }
    ];

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    const handleAnswer = (value) => {
        if (currentQuestion.type === 'single') {
            setAnswers({ ...answers, [currentQuestion.id]: value });
        } else {
            const current = answers[currentQuestion.id] || [];
            if (current.includes(value)) {
                setAnswers({
                    ...answers,
                    [currentQuestion.id]: current.filter(v => v !== value)
                });
            } else if (!currentQuestion.maxSelections || current.length < currentQuestion.maxSelections) {
                setAnswers({
                    ...answers,
                    [currentQuestion.id]: [...current, value]
                });
            }
        }
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        // Here you would normally submit the answers to the backend
        setShowResults(true);
    };

    const canProceed = () => {
        const answer = answers[currentQuestion.id];
        if (currentQuestion.type === 'single') {
            return answer && answer.length > 0;
        } else {
            return answer && answer.length > 0;
        }
    };

    if (showResults) {
        return (
            <MarketingLayout>
                <Head title="Behovsanalys - Resultat" />
                
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto">
                            <Card>
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="h-8 w-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">Tack för dina svar!</CardTitle>
                                    <CardDescription className="text-lg">
                                        Vi har analyserat dina behov och hittat perfekta bilar för dig
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="bg-primary/5 p-6 rounded-lg">
                                        <h3 className="font-semibold mb-4">Din bilprofil:</h3>
                                        <div className="grid gap-3">
                                            <div className="flex items-center">
                                                <DollarSign className="mr-2 h-4 w-4 text-primary" />
                                                <span className="text-sm">Budget: {answers.budget}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="mr-2 h-4 w-4 text-primary" />
                                                <span className="text-sm">Användning: {answers.usage}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Fuel className="mr-2 h-4 w-4 text-primary" />
                                                <span className="text-sm">Drivlina: {answers.fuel}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Car className="mr-2 h-4 w-4 text-primary" />
                                                <span className="text-sm">Storlek: {answers.size}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-4">Vad händer nu?</h3>
                                        <ol className="space-y-3">
                                            <li className="flex items-start">
                                                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                                    1
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    Vi matchar dina svar mot vårt bilutbud
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                                    2
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    Du får personliga rekommendationer via e-post
                                                </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                                    3
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    En säljare kontaktar dig för att diskutera alternativ
                                                </span>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Lämna dina kontaktuppgifter</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <Label htmlFor="name">Namn *</Label>
                                                <Input id="name" placeholder="För- och efternamn" />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">E-post *</Label>
                                                <Input id="email" type="email" placeholder="din@email.se" />
                                            </div>
                                            <div>
                                                <Label htmlFor="phone">Telefon *</Label>
                                                <Input id="phone" type="tel" placeholder="07X-XXX XX XX" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button size="lg" className="flex-1">
                                            Få personliga rekommendationer
                                        </Button>
                                        <Button size="lg" variant="outline" asChild>
                                            <Link href="/cars">
                                                Bläddra bland bilar
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </MarketingLayout>
        );
    }

    return (
        <MarketingLayout>
            <Head title="Behovsanalys - Din Bil Deal" />
            
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                            Hitta din perfekta bil
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Svara på några enkla frågor så hjälper vi dig hitta bilar som passar 
                            just dina behov och önskemål.
                        </p>
                    </div>
                </div>
            </section>

            {/* Progress Bar */}
            <div className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">
                                Fråga {currentStep + 1} av {questions.length}
                            </span>
                            <span className="text-sm font-medium">
                                {Math.round(progress)}% klart
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                </div>
            </div>

            {/* Question Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <currentQuestion.icon className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
                                <CardDescription className="text-lg">
                                    {currentQuestion.subtitle}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {currentQuestion.type === 'single' ? (
                                        <RadioGroup
                                            value={answers[currentQuestion.id] || ''}
                                            onValueChange={(value) => handleAnswer(value)}
                                        >
                                            {currentQuestion.options.map((option) => (
                                                <label
                                                    key={option.value}
                                                    htmlFor={option.value}
                                                    className="flex items-start space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                                                >
                                                    <RadioGroupItem value={option.value} id={option.value} />
                                                    <div className="flex-1">
                                                        <div className="font-medium">{option.label}</div>
                                                        {option.description && (
                                                            <div className="text-sm text-muted-foreground mt-1">
                                                                {option.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    ) : (
                                        <div className="space-y-3">
                                            {currentQuestion.maxSelections && (
                                                <p className="text-sm text-muted-foreground text-center">
                                                    Välj upp till {currentQuestion.maxSelections} alternativ
                                                    {answers[currentQuestion.id] && (
                                                        <span className="ml-2 font-medium">
                                                            ({answers[currentQuestion.id].length} valda)
                                                        </span>
                                                    )}
                                                </p>
                                            )}
                                            {currentQuestion.options.map((option) => {
                                                const isSelected = answers[currentQuestion.id]?.includes(option.value);
                                                const isDisabled = !isSelected && 
                                                    currentQuestion.maxSelections && 
                                                    answers[currentQuestion.id]?.length >= currentQuestion.maxSelections;
                                                
                                                return (
                                                    <label
                                                        key={option.value}
                                                        className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                                                            isSelected 
                                                                ? 'bg-primary/10 border-primary' 
                                                                : isDisabled 
                                                                    ? 'opacity-50 cursor-not-allowed' 
                                                                    : 'hover:bg-accent'
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            disabled={isDisabled}
                                                            onChange={() => !isDisabled && handleAnswer(option.value)}
                                                            className="mt-1"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium">{option.label}</div>
                                                            {option.description && (
                                                                <div className="text-sm text-muted-foreground mt-1">
                                                                    {option.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 mt-8">
                                    {currentStep > 0 && (
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={handleBack}
                                            className="flex-1"
                                        >
                                            <ChevronLeft className="mr-2 h-4 w-4" />
                                            Tillbaka
                                        </Button>
                                    )}
                                    <Button
                                        size="lg"
                                        onClick={handleNext}
                                        disabled={!canProceed()}
                                        className="flex-1"
                                    >
                                        {currentStep === questions.length - 1 ? 'Få rekommendationer' : 'Nästa'}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skip Option */}
                        <div className="text-center mt-6">
                            <Button variant="ghost" asChild>
                                <Link href="/cars">
                                    Hoppa över och bläddra bland alla bilar
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}