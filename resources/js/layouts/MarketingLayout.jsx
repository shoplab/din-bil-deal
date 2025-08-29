import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import {
    Menu,
    X,
    Car,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Sun,
    Moon,
    Monitor
} from 'lucide-react';

export default function MarketingLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { url } = usePage();
    const { appearance, updateAppearance } = useAppearance();

    const navigation = [
        { name: 'Hem', href: '/' },
        { name: 'Bilar till salu', href: '/cars' },
        { name: 'Sälj din bil', href: '/sell' },
        { name: 'Finansiering', href: '/financing' },
        { name: 'Om oss', href: '/about' },
        { name: 'Kontakt', href: '/contact' },
    ];

    const isActive = (href) => {
        if (href === '/' && url === '/') return true;
        if (href !== '/' && url.startsWith(href)) return true;
        return false;
    };

    const cycleAppearance = () => {
        const modes = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(appearance);
        const nextIndex = (currentIndex + 1) % modes.length;
        updateAppearance(modes[nextIndex]);
    };

    const getThemeIcon = () => {
        if (appearance === 'light') return Sun;
        if (appearance === 'dark') return Moon;
        return Monitor;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 flex h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Car className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold text-foreground">
                            Din Bil Deal
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="ml-8 hidden md:flex space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    isActive(item.href)
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="ml-auto hidden md:flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={cycleAppearance}
                            aria-label={`Switch to ${appearance === 'light' ? 'dark' : appearance === 'dark' ? 'system' : 'light'} theme`}
                        >
                            {(() => {
                                const Icon = getThemeIcon();
                                return <Icon className="h-5 w-5" />;
                            })()}
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/customer/login">Logga in</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Skapa konto</Link>
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="ml-auto md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Öppna huvudmeny</span>
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3 border-t">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                                        isActive(item.href)
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-primary hover:bg-accent"
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="mt-4 flex flex-col space-y-2 px-3">
                                <Button
                                    variant="ghost"
                                    className="justify-start"
                                    onClick={() => {
                                        cycleAppearance();
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    {(() => {
                                        const Icon = getThemeIcon();
                                        return (
                                            <>
                                                <Icon className="h-5 w-5 mr-2" />
                                                {appearance === 'light' ? 'Ljust tema' : appearance === 'dark' ? 'Mörkt tema' : 'Systemtema'}
                                            </>
                                        );
                                    })()}
                                </Button>
                                <Button variant="ghost" asChild className="justify-start">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        Logga in
                                    </Link>
                                </Button>
                                <Button asChild className="justify-start">
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                        Skapa konto
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/50">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="col-span-1">
                            <Link href="/" className="flex items-center space-x-2 mb-4">
                                <Car className="h-6 w-6 text-primary" />
                                <span className="text-lg font-bold">Din Bil Deal</span>
                            </Link>
                            <p className="text-sm text-muted-foreground mb-4">
                                Din pålitliga partner för bilköp och bilförsäljning i Sverige.
                                Vi hjälper dig hitta den perfekta bilen eller sälja din nuvarande bil
                                till bästa pris.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary">
                                    <Twitter className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-semibold mb-4">Snabblänkar</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/cars" className="text-muted-foreground hover:text-primary">
                                        Bilar till salu
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/sell" className="text-muted-foreground hover:text-primary">
                                        Sälj din bil
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/financing" className="text-muted-foreground hover:text-primary">
                                        Finansiering
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="text-muted-foreground hover:text-primary">
                                        Om oss
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="font-semibold mb-4">Tjänster</h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/valuation" className="text-muted-foreground hover:text-primary">
                                        Bilvärdering
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/inspection" className="text-muted-foreground hover:text-primary">
                                        Bilbesiktning
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/insurance" className="text-muted-foreground hover:text-primary">
                                        Bilförsäkring
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/warranty" className="text-muted-foreground hover:text-primary">
                                        Garanti
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="font-semibold mb-4">Kontakt</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">08-123 456 78</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">info@dinbildeal.se</span>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="text-muted-foreground">
                                        Storgatan 123<br />
                                        111 22 Stockholm
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom section */}
                    <div className="mt-8 pt-8 border-t">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} Din Bil Deal. Alla rättigheter förbehållna.
                            </p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <Link
                                    href="/privacy"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    Integritetspolicy
                                </Link>
                                <Link
                                    href="/terms"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    Villkor
                                </Link>
                                <Link
                                    href="/cookies"
                                    className="text-sm text-muted-foreground hover:text-primary"
                                >
                                    Cookies
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
