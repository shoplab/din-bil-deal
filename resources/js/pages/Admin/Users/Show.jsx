import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
    User,
    ArrowLeft,
    Edit,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    ShieldCheck,
    Heart,
    Car,
    MessageCircle,
    CalendarDays,
    TrendingUp,
    Award,
    Target
} from 'lucide-react';

export default function Show({ user }) {
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'customer': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Admin';
            case 'customer': return 'Kund';
            default: return role;
        }
    };

    const getContactMethodLabel = (method) => {
        switch (method) {
            case 'email': return 'E-post';
            case 'phone': return 'Telefon';
            case 'sms': return 'SMS';
            default: return method;
        }
    };

    // Get stats based on user role
    const renderStats = () => {
        if (user.role === 'customer') {
            return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg">
                            <Heart className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold">{user.stats.saved_cars_count || 0}</div>
                        <div className="text-sm text-muted-foreground">Sparade bilar</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg">
                            <MessageCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold">{user.stats.leads_count || 0}</div>
                        <div className="text-sm text-muted-foreground">Leads</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg">
                            <CalendarDays className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold">{user.stats.appointments_count || 0}</div>
                        <div className="text-sm text-muted-foreground">Bokningar</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-lg">
                            <Target className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="text-2xl font-bold">{user.stats.active_leads_count || 0}</div>
                        <div className="text-sm text-muted-foreground">Aktiva leads</div>
                    </div>
                </div>
            );
        } else if (user.role === 'admin') {
            return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg">
                            <Car className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold">{user.stats.cars_created || 0}</div>
                        <div className="text-sm text-muted-foreground">Bilar skapade</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold">{user.stats.deals_assigned || 0}</div>
                        <div className="text-sm text-muted-foreground">Tilldelade affärer</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg">
                            <Award className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold">{user.stats.deals_won || 0}</div>
                        <div className="text-sm text-muted-foreground">Vunna affärer</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-orange-100 rounded-lg">
                            <Target className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="text-2xl font-bold">{user.stats.deals_active || 0}</div>
                        <div className="text-sm text-muted-foreground">Aktiva affärer</div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <AdminLayout>
            <Head title={`Användare: ${user.name}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link href={route('admin.users.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                                <div className="flex items-center space-x-2">
                                    <Badge className={getRoleBadgeColor(user.role)}>
                                        {getRoleLabel(user.role)}
                                    </Badge>
                                    {user.email_verified_at ? (
                                        <Badge variant="success">
                                            <ShieldCheck className="mr-1 h-3 w-3" />
                                            Verifierad
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">
                                            <Shield className="mr-1 h-3 w-3" />
                                            Ej verifierad
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link href={route('admin.users.edit', user.id)}>
                        <Button>
                            <Edit className="mr-2 h-4 w-4" />
                            Redigera
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                {user.stats && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistik</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderStats()}
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="mr-2 h-5 w-5" />
                                Grundinformation
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <div className="font-medium">{user.email}</div>
                                    <div className="text-sm text-muted-foreground">E-postadress</div>
                                </div>
                            </div>

                            {user.phone && (
                                <div className="flex items-center space-x-3">
                                    <Phone className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">{user.phone}</div>
                                        <div className="text-sm text-muted-foreground">Telefonnummer</div>
                                    </div>
                                </div>
                            )}

                            {user.full_address && (
                                <div className="flex items-center space-x-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">{user.full_address}</div>
                                        <div className="text-sm text-muted-foreground">Adress</div>
                                    </div>
                                </div>
                            )}

                            {user.date_of_birth && (
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {new Date(user.date_of_birth).toLocaleDateString('sv-SE')}
                                            {user.age && ` (${user.age} år)`}
                                        </div>
                                        <div className="text-sm text-muted-foreground">Födelsedatum</div>
                                    </div>
                                </div>
                            )}

                            <Separator />

                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-2">Roll</div>
                                <Badge className={getRoleBadgeColor(user.role)}>
                                    {getRoleLabel(user.role)}
                                </Badge>
                            </div>

                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-2">E-postverifiering</div>
                                {user.email_verified_at ? (
                                    <div className="flex items-center space-x-2">
                                        <ShieldCheck className="h-4 w-4 text-green-600" />
                                        <span className="text-sm">
                                            Verifierad {new Date(user.email_verified_at).toLocaleDateString('sv-SE')}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Shield className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-muted-foreground">Ej verifierad</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Specific Information */}
                    {user.role === 'customer' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Kundinformation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {user.preferred_contact_method && (
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">
                                            Föredragen kontaktmetod
                                        </div>
                                        <div className="font-medium">
                                            {getContactMethodLabel(user.preferred_contact_method)}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">
                                        Marknadsföring
                                    </div>
                                    <Badge variant={user.marketing_consent ? "success" : "secondary"}>
                                        {user.marketing_consent ? 'Godkänt' : 'Ej godkänt'}
                                    </Badge>
                                </div>

                                {user.customer_notes && (
                                    <div>
                                        <div className="text-sm font-medium text-muted-foreground mb-1">
                                            Anteckningar
                                        </div>
                                        <div className="text-sm bg-muted p-3 rounded-md">
                                            {user.customer_notes}
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-2">Kund sedan</div>
                                    <div className="font-medium">
                                        {new Date(user.created_at).toLocaleDateString('sv-SE', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Admin Specific Information */}
                    {user.role === 'admin' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Admin-information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-2">Admin sedan</div>
                                    <div className="font-medium">
                                        {new Date(user.created_at).toLocaleDateString('sv-SE', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-2">Senast uppdaterad</div>
                                    <div className="font-medium">
                                        {new Date(user.updated_at).toLocaleDateString('sv-SE', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}