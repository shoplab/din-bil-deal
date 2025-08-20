import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
    Car, 
    Heart, 
    Calendar, 
    MessageSquare, 
    User, 
    Settings, 
    LogOut, 
    Menu,
    Home,
    Bell
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/customer/dashboard', icon: Home, current: true },
    { name: 'Sparade bilar', href: '/customer/saved-cars', icon: Heart, current: false },
    { name: 'Mina förfrågningar', href: '/customer/inquiries', icon: MessageSquare, current: false },
    { name: 'Bokade tider', href: '/customer/appointments', icon: Calendar, current: false },
    { name: 'Profil', href: '/customer/profile', icon: User, current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function CustomerLayout({ title, children }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post('/customer/logout');
    };

    const getUserInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <header className="bg-white shadow-sm border-b">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Left: Logo + Mobile Menu */}
                        <div className="flex items-center space-x-4">
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="sm" className="md:hidden">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-72">
                                    <div className="flex flex-col h-full">
                                        {/* Logo */}
                                        <div className="flex items-center space-x-2 pb-6">
                                            <Car className="h-8 w-8 text-blue-600" />
                                            <span className="text-xl font-bold text-gray-900">Din Bil Deal</span>
                                        </div>
                                        
                                        {/* Navigation */}
                                        <nav className="flex-1">
                                            <ul className="space-y-1">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <Link
                                                            href={item.href}
                                                            className={classNames(
                                                                window.location.pathname === item.href
                                                                    ? 'bg-blue-50 text-blue-600'
                                                                    : 'text-gray-700 hover:bg-gray-50',
                                                                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
                                                            )}
                                                        >
                                                            <item.icon 
                                                                className={classNames(
                                                                    window.location.pathname === item.href
                                                                        ? 'text-blue-600'
                                                                        : 'text-gray-400 group-hover:text-gray-500',
                                                                    'mr-3 h-5 w-5'
                                                                )}
                                                            />
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            
                            {/* Logo */}
                            <Link href="/" className="flex items-center space-x-2">
                                <Car className="h-8 w-8 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900 hidden sm:block">Din Bil Deal</span>
                            </Link>
                        </div>

                        {/* Center: Page Title */}
                        {title && (
                            <div className="hidden md:block">
                                <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                            </div>
                        )}

                        {/* Right: User Menu */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="h-5 w-5 text-gray-500" />
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                            </Button>

                            {/* User Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback className="bg-blue-600 text-white">
                                                {getUserInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="hidden md:block text-sm font-medium text-gray-700">
                                            {user.name}
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel>Mitt konto</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route('customer.profile.edit')} className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profil</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/customer/settings" className="flex items-center">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Inställningar</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        onClick={handleLogout}
                                        className="text-red-600 focus:text-red-600"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logga ut</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-16 md:border-r md:border-gray-200 md:bg-white">
                        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
                            <nav className="flex-1 px-3 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            window.location.pathname === item.href
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-700 hover:bg-gray-50',
                                            'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors'
                                        )}
                                    >
                                        <item.icon 
                                            className={classNames(
                                                window.location.pathname === item.href
                                                    ? 'text-blue-600'
                                                    : 'text-gray-400 group-hover:text-gray-500',
                                                'mr-3 h-5 w-5'
                                            )}
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 md:ml-64">
                        <div className="py-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}