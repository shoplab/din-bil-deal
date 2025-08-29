import { Head, Link } from '@inertiajs/react';
import MarketingLayout from '@/layouts/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Users,
    Target,
    Award,
    Shield,
    TrendingUp,
    Heart,
    MapPin,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    Star
} from 'lucide-react';

export default function AboutUs() {
    const values = [
        {
            icon: Shield,
            title: 'Trygghet',
            description: 'Vi garanterar säkra affärer och skyddar både köpare och säljare genom hela processen.'
        },
        {
            icon: Heart,
            title: 'Kundservice',
            description: 'Vi sätter alltid kunden först och arbetar för att överträffa förväntningar.'
        },
        {
            icon: Award,
            title: 'Kvalitet',
            description: 'Alla bilar genomgår noggrann kontroll och vi arbetar endast med verifierade partners.'
        },
        {
            icon: TrendingUp,
            title: 'Innovation',
            description: 'Vi utvecklar ständigt vår plattform för att göra bilhandel enklare och smidigare.'
        }
    ];

    const stats = [
        { number: '10,000+', label: 'Nöjda kunder' },
        { number: '15,000+', label: 'Sålda bilar' },
        { number: '98%', label: 'Kundnöjdhet' },
        { number: '7 dagar', label: 'Genomsnittlig försäljningstid' }
    ];

    const team = [
        {
            name: 'Erik Andersson',
            role: 'VD & Grundare',
            description: '20 års erfarenhet inom bilbranschen',
            image: '👨‍💼'
        },
        {
            name: 'Anna Lindqvist',
            role: 'Försäljningschef',
            description: 'Expert på kundbemötande och försäljning',
            image: '👩‍💼'
        },
        {
            name: 'Magnus Karlsson',
            role: 'Teknisk chef',
            description: 'Ansvarig för plattform och innovation',
            image: '👨‍💻'
        },
        {
            name: 'Sofia Bergström',
            role: 'Marknadschef',
            description: 'Driver vår marknadsföring och tillväxt',
            image: '👩‍💻'
        }
    ];

    return (
        <MarketingLayout>
            <Head title="Om oss - Din Bil Deal" />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Din pålitliga partner för bilaffärer
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Sedan 2015 har vi hjälpt tusentals svenskar att köpa och sälja bilar 
                            på ett säkert, enkelt och lönsamt sätt.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Vårt uppdrag</h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Din Bil Deal grundades med en enkel vision: att revolutionera 
                                bilhandeln i Sverige genom att göra den transparent, säker och 
                                tillgänglig för alla.
                            </p>
                            <p className="text-lg text-muted-foreground mb-6">
                                Vi tror att bilköp och bilförsäljning inte behöver vara komplicerat. 
                                Genom vår plattform kopplar vi samman köpare och säljare, 
                                tillhandahåller expertråd och säkerställer att varje affär 
                                genomförs på bästa möjliga sätt.
                            </p>
                            <p className="text-lg text-muted-foreground mb-8">
                                Med endast 1% provision och vårt omfattande nätverk av partners 
                                kan vi erbjuda marknadens bästa villkor för både köpare och säljare.
                            </p>
                            <Button size="lg" asChild>
                                <Link href="/contact">
                                    Kontakta oss
                                </Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, index) => (
                                <Card key={index} className="text-center">
                                    <CardContent className="pt-6">
                                        <div className="text-3xl font-bold text-primary mb-2">
                                            {stat.number}
                                        </div>
                                        <p className="text-muted-foreground">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Våra värderingar</h2>
                        <p className="text-xl text-muted-foreground">
                            Dessa principer vägleder oss i allt vi gör
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                        <value.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{value.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Möt vårt team</h2>
                        <p className="text-xl text-muted-foreground">
                            Experter som arbetar för din bästa bilaffär
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="pt-6">
                                    <div className="text-6xl mb-4">{member.image}</div>
                                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                                    <p className="text-sm text-primary mb-2">{member.role}</p>
                                    <p className="text-sm text-muted-foreground">{member.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Vår historia</h2>
                        
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                                        2015
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Starten</h3>
                                    <p className="text-muted-foreground">
                                        Din Bil Deal grundades i Stockholm med målet att förenkla bilhandeln 
                                        för privatpersoner. Vi började med en enkel webbplats och tre anställda.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                                        2018
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Expansion</h3>
                                    <p className="text-muted-foreground">
                                        Vi expanderade till Göteborg och Malmö, lanserade vår app och 
                                        passerade 5,000 genomförda bilaffärer.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                                        2020
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Digital transformation</h3>
                                    <p className="text-muted-foreground">
                                        Under pandemin utvecklade vi helt digitala lösningar för bilvisning 
                                        och köpprocessen, vilket gjorde oss till marknadsledande inom digital bilhandel.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                                        2024
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Idag</h3>
                                    <p className="text-muted-foreground">
                                        Med över 10,000 nöjda kunder och 50+ anställda är vi Sveriges 
                                        mest pålitliga plattform för bilhandel. Vi fortsätter att innovera 
                                        och utveckla nya tjänster för att göra bilaffärer ännu enklare.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Våra partners</h2>
                        <p className="text-xl text-muted-foreground">
                            Vi samarbetar med Sveriges ledande företag inom bilbranschen
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        <Card className="flex items-center justify-center h-24">
                            <CardContent className="text-center p-4">
                                <span className="text-xl font-semibold text-muted-foreground">Santander</span>
                            </CardContent>
                        </Card>
                        <Card className="flex items-center justify-center h-24">
                            <CardContent className="text-center p-4">
                                <span className="text-xl font-semibold text-muted-foreground">If Försäkring</span>
                            </CardContent>
                        </Card>
                        <Card className="flex items-center justify-center h-24">
                            <CardContent className="text-center p-4">
                                <span className="text-xl font-semibold text-muted-foreground">Bilprovningen</span>
                            </CardContent>
                        </Card>
                        <Card className="flex items-center justify-center h-24">
                            <CardContent className="text-center p-4">
                                <span className="text-xl font-semibold text-muted-foreground">Carfax</span>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6">
                            Redo att börja din bilresa med oss?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Oavsett om du vill köpa eller sälja, vi är här för att hjälpa dig 
                            genom hela processen.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/cars">
                                    Bläddra bland bilar
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                                <Link href="/sell">
                                    Sälj din bil
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Location */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Besök oss</h2>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <MapPin className="mr-2 h-5 w-5 text-primary" />
                                        Huvudkontor Stockholm
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-muted-foreground">
                                        Kungsgatan 10<br />
                                        111 43 Stockholm
                                    </p>
                                    <div className="space-y-2">
                                        <p className="flex items-center text-sm">
                                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                            08-123 456 78
                                        </p>
                                        <p className="flex items-center text-sm">
                                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                            info@dinbildeal.se
                                        </p>
                                        <p className="flex items-center text-sm">
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            Mån-Fre 09:00-18:00, Lör 10:00-15:00
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <MapPin className="mr-2 h-5 w-5 text-primary" />
                                        Kontor Göteborg
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-muted-foreground">
                                        Avenyn 21<br />
                                        411 36 Göteborg
                                    </p>
                                    <div className="space-y-2">
                                        <p className="flex items-center text-sm">
                                            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                                            031-123 456 78
                                        </p>
                                        <p className="flex items-center text-sm">
                                            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                            goteborg@dinbildeal.se
                                        </p>
                                        <p className="flex items-center text-sm">
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            Mån-Fre 09:00-17:00
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </MarketingLayout>
    );
}