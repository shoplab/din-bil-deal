import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    LayoutDashboard,
    Car,
    Users,
    Phone,
    BarChart3,
    Settings,
    Menu,
    X,
    Bell,
    Search,
    LogOut,
    ChevronDown,
    UserCircle,
    Target,
    TrendingUp,
    FileText,
    Mail,
    Calendar,
    CreditCard,
    ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';

const navigation = [
    {
        name: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        current: false,
    },
    {
        name: 'Fordon',
        icon: Car,
        current: false,
        children: [
            { name: 'Alla fordon', href: '/admin/cars' },
            { name: 'Lägg till fordon', href: '/admin/cars/create' },
            { name: 'Utvalda fordon', href: '/admin/cars?featured=1' },
        ],
    },
    {
        name: 'Leads',
        icon: Users,
        current: false,
        children: [
            { name: 'Alla leads', href: '/admin/leads' },
            { name: 'Nya leads', href: '/admin/leads?status=new' },
            { name: 'Kvalificerade', href: '/admin/leads?status=qualified' },
            { name: 'Kontaktade', href: '/admin/leads?status=contacted' },
        ],
    },
    {
        name: 'Affärer',
        icon: Target,
        current: false,
        children: [
            { name: 'Pipeline', href: '/admin/deals' },
            { name: 'Kanban-vy', href: '/admin/deals/pipeline/kanban' },
            { name: 'Tabellvy', href: '/admin/deals/pipeline/table' },
            { name: 'Skapa affär', href: '/admin/deals/create' },
        ],
    },
    {
        name: 'Analys',
        icon: BarChart3,
        current: false,
        children: [
            { name: 'Översikt', href: '/admin/analytics' },
            { name: 'Försäljning', href: '/admin/analytics/sales' },
            { name: 'Leads', href: '/admin/analytics/leads' },
            { name: 'Lager', href: '/admin/analytics/inventory' },
        ],
    },
    {
        name: 'Formulär',
        icon: ClipboardList,
        current: false,
        children: [
            { name: 'Alla formulär', href: '/admin/forms' },
            { name: 'Skapa formulär', href: '/admin/forms/create' },
        ],
    },
    {
        name: 'Inställningar',
        href: '/admin/settings',
        icon: Settings,
        current: false,
    },
];

export default function AdminLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);
    const { auth, notifications = [] } = usePage().props;
    const user = auth?.user;

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={cn(
                "fixed inset-0 z-50 lg:hidden",
                sidebarOpen ? "block" : "hidden"
            )}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
                    <div className="flex h-16 items-center justify-between px-4">
                        <Link href="/admin" className="flex items-center">
                            <img
                                src="/img/dinbildeal.svg"
                                alt="Din Bil Deal"
                                className="h-10 w-auto"
                            />
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                    <nav className="flex-1 space-y-1 px-4 py-6">
                        {navigation.map((item, index) => (
                            <div key={item.name}>
                                {item.children ? (
                                    <div>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start"
                                            onClick={() => toggleSubmenu(index)}
                                        >
                                            <item.icon className="mr-3 h-5 w-5" />
                                            {item.name}
                                            <ChevronDown className={cn(
                                                "ml-auto h-4 w-4 transition-transform",
                                                openSubmenu === index && "rotate-180"
                                            )} />
                                        </Button>
                                        {openSubmenu === index && (
                                            <div className="ml-6 mt-2 space-y-1">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link href={item.href}>
                                        <Button variant="ghost" className="w-full justify-start">
                                            <item.icon className="mr-3 h-5 w-5" />
                                            {item.name}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <Link href="/admin" className="flex items-center">
                            <img
                                src="/img/dinbildeal.svg"
                                alt="Din Bil Deal"
                                className="h-10 w-auto"
                            />
                        </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul className="-mx-2 space-y-1">
                                    {navigation.map((item, index) => (
                                        <li key={item.name}>
                                            {item.children ? (
                                                <div>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                        onClick={() => toggleSubmenu(index)}
                                                    >
                                                        <item.icon className="mr-3 h-5 w-5" />
                                                        {item.name}
                                                        <ChevronDown className={cn(
                                                            "ml-auto h-4 w-4 transition-transform",
                                                            openSubmenu === index && "rotate-180"
                                                        )} />
                                                    </Button>
                                                    {openSubmenu === index && (
                                                        <div className="ml-6 mt-2 space-y-1">
                                                            {item.children.map((child) => (
                                                                <Link
                                                                    key={child.name}
                                                                    href={child.href}
                                                                    className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                                                                >
                                                                    {child.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <Link href={item.href}>
                                                    <Button variant="ghost" className="w-full justify-start">
                                                        <item.icon className="mr-3 h-5 w-5" />
                                                        {item.name}
                                                    </Button>
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-72">
                {/* Top bar */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>

                    {/* Separator */}
                    <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="relative flex flex-1">
                            {/* Search could go here */}
                        </div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* Notifications */}
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="h-5 w-5" />
                                {notifications.length > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                                        {notifications.length}
                                    </Badge>
                                )}
                            </Button>

                            {/* Separator */}
                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                            {/* Profile dropdown */}
                            <div className="flex items-center gap-x-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {user?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden lg:flex lg:flex-col lg:items-start">
                                    <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                                    <span className="text-xs text-gray-600 capitalize">{user?.role}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {/* {title && (
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                    {title}
                                </h1>
                            </div>
                        )} */}
                        {children}
                    </div>
                </main>
            </div>
            <Toaster position="top-center" />
        </div>
    );
}
