import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Calendar,
    Shield,
    Bell,
    Save,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff
} from 'lucide-react';

export default function EditProfile({ user, flash }) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Profile information form
    const { data: profileData, setData: setProfileData, put: updateProfile, processing: profileProcessing, errors: profileErrors, reset: resetProfile } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
        preferred_contact_method: user.preferred_contact_method || 'email',
        marketing_consent: user.marketing_consent || false,
    });

    // Password change form
    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        updateProfile(route('customer.profile.update'), {
            onSuccess: () => {
                // Profile updated successfully
            }
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        updatePassword(route('customer.profile.password'), {
            onSuccess: () => {
                resetPassword();
                setShowCurrentPassword(false);
                setShowNewPassword(false);
                setShowConfirmPassword(false);
            }
        });
    };

    const contactMethods = [
        { value: 'email', label: 'E-post' },
        { value: 'phone', label: 'Telefon' },
        { value: 'sms', label: 'SMS' },
    ];

    return (
        <CustomerLayout title="Profil inställningar">
            <Head title="Profil inställningar" />

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Profil inställningar</h1>
                <p className="text-gray-600 mt-1">
                    Hantera dina personuppgifter och kontoinställningar
                </p>
            </div>

            {/* Success Messages */}
            {flash?.success && (
                <Alert className="mb-6">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personlig information
                            </CardTitle>
                            <CardDescription>
                                Uppdatera dina personuppgifter och kontaktinformation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Namn</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData('name', e.target.value)}
                                        className={profileErrors.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    {profileErrors.name && (
                                        <p className="text-sm text-red-600">{profileErrors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-postadress</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData('email', e.target.value)}
                                        className={profileErrors.email ? 'border-red-500' : ''}
                                        required
                                    />
                                    {profileErrors.email && (
                                        <p className="text-sm text-red-600">{profileErrors.email}</p>
                                    )}
                                    {!user.email_verified_at && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Din e-postadress är inte verifierad. 
                                                <Button variant="link" className="p-0 h-auto ml-1">
                                                    Skicka verifiering igen
                                                </Button>
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefonnummer</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData('phone', e.target.value)}
                                        placeholder="08-123 456 78"
                                        className={profileErrors.phone ? 'border-red-500' : ''}
                                    />
                                    {profileErrors.phone && (
                                        <p className="text-sm text-red-600">{profileErrors.phone}</p>
                                    )}
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_birth">Födelsedatum</Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={profileData.date_of_birth}
                                        onChange={(e) => setProfileData('date_of_birth', e.target.value)}
                                        className={profileErrors.date_of_birth ? 'border-red-500' : ''}
                                    />
                                    {profileErrors.date_of_birth && (
                                        <p className="text-sm text-red-600">{profileErrors.date_of_birth}</p>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="address">Adress</Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        value={profileData.address}
                                        onChange={(e) => setProfileData('address', e.target.value)}
                                        placeholder="Gatan 123"
                                        className={profileErrors.address ? 'border-red-500' : ''}
                                    />
                                    {profileErrors.address && (
                                        <p className="text-sm text-red-600">{profileErrors.address}</p>
                                    )}
                                </div>

                                {/* City and Postal Code */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="postal_code">Postnummer</Label>
                                        <Input
                                            id="postal_code"
                                            type="text"
                                            value={profileData.postal_code}
                                            onChange={(e) => setProfileData('postal_code', e.target.value)}
                                            placeholder="123 45"
                                            className={profileErrors.postal_code ? 'border-red-500' : ''}
                                        />
                                        {profileErrors.postal_code && (
                                            <p className="text-sm text-red-600">{profileErrors.postal_code}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Stad</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            value={profileData.city}
                                            onChange={(e) => setProfileData('city', e.target.value)}
                                            placeholder="Stockholm"
                                            className={profileErrors.city ? 'border-red-500' : ''}
                                        />
                                        {profileErrors.city && (
                                            <p className="text-sm text-red-600">{profileErrors.city}</p>
                                        )}
                                    </div>
                                </div>

                                <Button type="submit" disabled={profileProcessing} className="w-full">
                                    <Save className="h-4 w-4 mr-2" />
                                    {profileProcessing ? 'Sparar...' : 'Spara ändringar'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Contact Preferences */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Kontaktinställningar
                            </CardTitle>
                            <CardDescription>
                                Välj hur du vill att vi kontaktar dig
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Preferred Contact Method */}
                            <div className="space-y-2">
                                <Label>Föredragen kontaktmetod</Label>
                                <Select 
                                    value={profileData.preferred_contact_method} 
                                    onValueChange={(value) => setProfileData('preferred_contact_method', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Välj kontaktmetod" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {contactMethods.map((method) => (
                                            <SelectItem key={method.value} value={method.value}>
                                                {method.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Marketing Consent */}
                            <div className="flex items-start space-x-3 pt-2">
                                <Checkbox
                                    id="marketing_consent"
                                    checked={profileData.marketing_consent}
                                    onCheckedChange={(checked) => setProfileData('marketing_consent', checked)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="marketing_consent" className="text-sm font-medium leading-none">
                                        Marknadsföring och erbjudanden
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        Jag vill få information om nya bilar, specialerbjudanden och andra marknadsföringsmeddelanden.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Password Change */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Ändra lösenord
                            </CardTitle>
                            <CardDescription>
                                Uppdatera ditt lösenord för att hålla ditt konto säkert
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                {/* Current Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">Nuvarande lösenord</Label>
                                    <div className="relative">
                                        <Input
                                            id="current_password"
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={passwordData.current_password}
                                            onChange={(e) => setPasswordData('current_password', e.target.value)}
                                            className={passwordErrors.current_password ? 'border-red-500' : ''}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    {passwordErrors.current_password && (
                                        <p className="text-sm text-red-600">{passwordErrors.current_password}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Nytt lösenord</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={passwordData.password}
                                            onChange={(e) => setPasswordData('password', e.target.value)}
                                            className={passwordErrors.password ? 'border-red-500' : ''}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    {passwordErrors.password && (
                                        <p className="text-sm text-red-600">{passwordErrors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Bekräfta nytt lösenord</Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={passwordData.password_confirmation}
                                            onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                            className={passwordErrors.password_confirmation ? 'border-red-500' : ''}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    {passwordErrors.password_confirmation && (
                                        <p className="text-sm text-red-600">{passwordErrors.password_confirmation}</p>
                                    )}
                                </div>

                                <Alert>
                                    <Shield className="h-4 w-4" />
                                    <AlertDescription>
                                        Lösenordet måste innehålla minst 8 tecken och inkludera både stora och små bokstäver, siffror och specialtecken.
                                    </AlertDescription>
                                </Alert>

                                <Button type="submit" disabled={passwordProcessing}>
                                    <Shield className="h-4 w-4 mr-2" />
                                    {passwordProcessing ? 'Uppdaterar...' : 'Uppdatera lösenord'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Account Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontoinformation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <div className="font-medium">E-post</div>
                                        <div className="text-gray-600">{user.email}</div>
                                        {user.email_verified_at ? (
                                            <div className="flex items-center gap-1 text-green-600 text-xs">
                                                <CheckCircle className="h-3 w-3" />
                                                Verifierad
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-orange-600 text-xs">
                                                <AlertCircle className="h-3 w-3" />
                                                Ej verifierad
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {user.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <div className="font-medium">Telefon</div>
                                            <div className="text-gray-600">{user.phone}</div>
                                        </div>
                                    </div>
                                )}

                                {user.full_address && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <div className="font-medium">Adress</div>
                                            <div className="text-gray-600">{user.full_address}</div>
                                        </div>
                                    </div>
                                )}

                                {user.age && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <div>
                                            <div className="font-medium">Ålder</div>
                                            <div className="text-gray-600">{user.age} år</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <div className="text-sm text-gray-500">
                                <div className="font-medium mb-1">Medlem sedan</div>
                                <div>{new Date(user.created_at).toLocaleDateString('sv-SE', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Integritet & Säkerhet</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 text-sm">
                                <div>
                                    <div className="font-medium mb-1">Kontaktinställningar</div>
                                    <div className="text-gray-600">
                                        {contactMethods.find(m => m.value === user.preferred_contact_method)?.label || 'E-post'}
                                    </div>
                                </div>

                                <div>
                                    <div className="font-medium mb-1">Marknadsföring</div>
                                    <div className="text-gray-600">
                                        {user.marketing_consent ? 'Tillåtet' : 'Inte tillåtet'}
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="text-xs text-gray-500">
                                <p>
                                    Vi skyddar dina personuppgifter enligt GDPR. 
                                    Läs mer i vår{' '}
                                    <Button variant="link" className="p-0 h-auto text-xs">
                                        integritetspolicy
                                    </Button>
                                    .
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CustomerLayout>
    );
}