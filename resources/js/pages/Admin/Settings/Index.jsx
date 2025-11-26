import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Settings,
    Users,
    Shield,
    Lock,
    Globe,
    Mail,
    ChevronRight,
} from 'lucide-react';

const settingsItems = [
    {
        title: 'Användare',
        description: 'Hantera administratörer, chefer och säljare',
        icon: Users,
        href: 'admin.settings.users',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    {
        title: 'Roller',
        description: 'Skapa och hantera användarroller',
        icon: Shield,
        href: 'admin.settings.roles',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
    },
    {
        title: 'Behörigheter',
        description: 'Konfigurera åtkomst för olika roller',
        icon: Lock,
        href: 'admin.settings.permissions',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
    },
    {
        title: 'Allmänt',
        description: 'Tidszon och grundläggande inställningar',
        icon: Globe,
        href: 'admin.settings.general',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
    },
    {
        title: 'E-postmallar',
        description: 'Anpassa systemets e-postmeddelanden',
        icon: Mail,
        href: 'admin.settings.templates',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
    },
];

export default function Index() {
    return (
        <AdminLayout>
            <Head title="Inställningar" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inställningar</h1>
                    <p className="text-muted-foreground">
                        Hantera systemkonfiguration och användaråtkomst
                    </p>
                </div>

                {/* Settings Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {settingsItems.map((item) => (
                        <Link key={item.href} href={route(item.href)}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className={`p-3 rounded-lg ${item.bgColor}`}>
                                        <item.icon className={`h-6 w-6 ${item.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center justify-between">
                                            {item.title}
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Quick Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Settings className="mr-2 h-5 w-5" />
                            Systemöversikt
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">5</div>
                                <div className="text-sm text-muted-foreground">Systemroller</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">30+</div>
                                <div className="text-sm text-muted-foreground">Behörigheter</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">9</div>
                                <div className="text-sm text-muted-foreground">E-postmallar</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
