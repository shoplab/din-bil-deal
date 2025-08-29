import { Head, Link } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CarCard from '@/components/CarCard';
import { 
    Search, 
    Car, 
    Shield, 
    Award, 
    Users, 
    ArrowRight,
    CheckCircle
} from 'lucide-react';

export default function MarketingHome({ cars = [], featuredCars = [] }) {
    return (
        <MarketingLayout>
            <Head title="Hem - Din Bil Deal" />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                                Hitta din
                                <span className="text-primary block">
                                    drömbil idag
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                Sveriges mest pålitliga plattform för bilköp och bilförsäljning. 
                                Över 10,000 verifierade bilar från seriösa säljare.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" asChild>
                                    <Link href="/cars">
                                        Bläddra bland bilar
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/sell">Sälj din bil</Link>
                                </Button>
                            </div>
                        </div>
                        
                        {/* Car Search Widget */}
                        <div className="lg:justify-self-end w-full max-w-md">
                            <Card className="shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Search className="mr-2 h-5 w-5 text-primary" />
                                        Sök din bil
                                    </CardTitle>
                                    <CardDescription>
                                        Hitta den perfekta bilen för dig
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Märke</label>
                                        <Select>
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
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Pris från</label>
                                            <Input type="number" placeholder="50,000" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Pris till</label>
                                            <Input type="number" placeholder="500,000" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Årsmodell</label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Välj år" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2024">2024</SelectItem>
                                                <SelectItem value="2023">2023</SelectItem>
                                                <SelectItem value="2022">2022</SelectItem>
                                                <SelectItem value="2021">2021</SelectItem>
                                                <SelectItem value="2020">2020 eller äldre</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <Button className="w-full" size="lg">
                                        <Search className="mr-2 h-4 w-4" />
                                        Sök bilar
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Varför välja Din Bil Deal?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Vi gör bilköp och bilförsäljning enkelt, säkert och transparent
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Verifierade bilar</h3>
                            <p className="text-muted-foreground">
                                Alla bilar genomgår noggrann kontroll och verifiering innan publicering
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Bästa pris</h3>
                            <p className="text-muted-foreground">
                                Vi garanterar marknadens bästa priser genom vårt nätverk av återförsäljare
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Experthjälp</h3>
                            <p className="text-muted-foreground">
                                Våra bilexperter hjälper dig genom hela köp- eller säljprocessen
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Garanti</h3>
                            <p className="text-muted-foreground">
                                12 månaders garanti på alla bilar och full transparens i alla affärer
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Cars Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Utvalda bilar
                            </h2>
                            <p className="text-xl text-muted-foreground">
                                Handplockade bilar med bästa pris och kvalitet
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/cars">
                                Se alla bilar
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCars.length > 0 ? featuredCars.map((car) => (
                            <CarCard
                                key={car.id}
                                car={car}
                                onCardClick={() => window.location.href = `/cars/${car.id}`}
                                showFavoriteButton={false}
                            />
                        )) : (
                            // Fallback sample cars if no featured cars available
                            Array.from({ length: 6 }).map((_, index) => {
                                const sampleCar = {
                                    id: index,
                                    make: 'Volvo',
                                    model: 'XC90',
                                    variant: 'T8 AWD',
                                    year: 2023,
                                    price: 849000,
                                    mileage: 25000,
                                    fuel_type: 'Hybrid',
                                    transmission: 'Automat',
                                    location: 'Stockholm',
                                    featured: true,
                                    rating: 4.8,
                                    description: 'Välvårdad bil med fullständig servicehistorik.',
                                    images: []
                                };
                                return (
                                    <CarCard
                                        key={index}
                                        car={sampleCar}
                                        showFavoriteButton={false}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* Needs Analysis CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-4">
                                    Osäker på vilken bil som passar dig?
                                </h2>
                                <p className="text-lg text-muted-foreground mb-6">
                                    Vår behovsanalys hjälper dig hitta den perfekta bilen baserat på dina 
                                    behov, budget och livsstil. Svara på några enkla frågor och få 
                                    personliga rekommendationer.
                                </p>
                                <Button size="lg" asChild>
                                    <Link href="/needs-analysis">
                                        Starta behovsanalys
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                    <span>Personliga rekommendationer</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                    <span>Baserat på din budget och behov</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                    <span>Tar endast 5 minuter</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                                    <span>Helt kostnadsfritt</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Car Deal Registration CTA Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Hittat en bil du vill köpa?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Låt oss hjälpa dig med hela köpprocessen. Vi förhandlar pris, kontrollerar 
                            bilens skick och säkerställer en trygg affär.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Car className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Registrera bilaffär</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    Ange bilens registreringsnummer så tar vi hand om resten
                                </p>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/car-deal">Registrera bil</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Vi förhandlar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    Våra experter förhandlar för att få bästa möjliga pris
                                </p>
                                <p className="text-sm font-semibold text-primary">Spara upp till 20%</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="text-center">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Trygg affär</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-4">
                                    Vi säkerställer att allt går rätt till med endast 1% provision
                                </p>
                                <p className="text-sm font-semibold text-primary">Betala när affären är klar</p>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="text-center mt-8">
                        <Button size="lg" asChild>
                            <Link href="/car-deal">
                                Registrera din bilaffär
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        Redo att hitta din nästa bil?
                    </h2>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Gå med tusentals nöjda kunder som har hittat sin drömbil genom Din Bil Deal
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/cars">
                                Börja leta nu
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                            <Link href="/sell">Sälj din bil</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}