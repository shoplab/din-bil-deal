import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Car, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MarketingLayout from '@/layouts/MarketingLayout';

export default function CustomerRegister() {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        date_of_birth: '',
        address: '',
        city: '',
        postal_code: '',
        preferred_contact_method: 'email',
        marketing_consent: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/customer/register');
    };

    const handleContactMethodChange = (value) => {
        setData('preferred_contact_method', value);
    };

    const handleMarketingConsentChange = (checked) => {
        setData('marketing_consent', checked);
    };

    return (
        <MarketingLayout>
            <Head title="Skapa kund konto" />
            
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center">
                            <Car className="h-12 w-12 text-blue-600" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Skapa ditt konto
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Få tillgång till ditt personliga bilköp
                        </p>
                    </div>

                    {/* Registration Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kontouppgifter</CardTitle>
                            <CardDescription>
                                Fyll i dina uppgifter för att skapa ett konto
                            </CardDescription>
                        </CardHeader>
                        
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                {/* Success Message */}
                                {recentlySuccessful && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-800">
                                            Kontot har skapats framgångsrikt! Du omdirigeras snart...
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Fullständigt namn *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                        placeholder="Ange ditt fullständiga namn"
                                        autoFocus
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-sm">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-postadress *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                        placeholder="din@email.se"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-600 text-sm">{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefonnummer</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className={errors.phone ? 'border-red-500' : ''}
                                        placeholder="070-123 45 67"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-600 text-sm">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Lösenord *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                        placeholder="Minst 8 tecken"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-red-600 text-sm">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Bekräfta lösenord *</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={errors.password_confirmation ? 'border-red-500' : ''}
                                        placeholder="Bekräfta ditt lösenord"
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-red-600 text-sm">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Optional Personal Details */}
                                <div className="pt-4 border-t">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Personliga uppgifter (valfritt)</h4>
                                    
                                    {/* Date of Birth */}
                                    <div className="space-y-2 mb-4">
                                        <Label htmlFor="date_of_birth">Födelsedatum</Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) => setData('date_of_birth', e.target.value)}
                                            className={errors.date_of_birth ? 'border-red-500' : ''}
                                        />
                                        {errors.date_of_birth && (
                                            <p className="text-red-600 text-sm">{errors.date_of_birth}</p>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2 mb-4">
                                        <Label htmlFor="address">Adress</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className={errors.address ? 'border-red-500' : ''}
                                            placeholder="Gatuadress"
                                        />
                                        {errors.address && (
                                            <p className="text-red-600 text-sm">{errors.address}</p>
                                        )}
                                    </div>

                                    {/* City and Postal Code */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="postal_code">Postnummer</Label>
                                            <Input
                                                id="postal_code"
                                                type="text"
                                                value={data.postal_code}
                                                onChange={(e) => setData('postal_code', e.target.value)}
                                                className={errors.postal_code ? 'border-red-500' : ''}
                                                placeholder="123 45"
                                            />
                                            {errors.postal_code && (
                                                <p className="text-red-600 text-sm">{errors.postal_code}</p>
                                            )}
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="city">Stad</Label>
                                            <Input
                                                id="city"
                                                type="text"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                className={errors.city ? 'border-red-500' : ''}
                                                placeholder="Stockholm"
                                            />
                                            {errors.city && (
                                                <p className="text-red-600 text-sm">{errors.city}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preferred Contact Method */}
                                    <div className="space-y-2 mb-4">
                                        <Label htmlFor="preferred_contact_method">Föredragen kontaktmetod</Label>
                                        <Select value={data.preferred_contact_method} onValueChange={handleContactMethodChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Välj kontaktmetod" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="email">E-post</SelectItem>
                                                <SelectItem value="phone">Telefon</SelectItem>
                                                <SelectItem value="sms">SMS</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.preferred_contact_method && (
                                            <p className="text-red-600 text-sm">{errors.preferred_contact_method}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Marketing Consent */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="marketing_consent"
                                        checked={data.marketing_consent}
                                        onCheckedChange={handleMarketingConsentChange}
                                    />
                                    <Label htmlFor="marketing_consent" className="text-sm">
                                        Jag vill få marknadsföringsinformation och erbjudanden via e-post
                                    </Label>
                                </div>

                                {/* General Error */}
                                {Object.keys(errors).length > 0 && !recentlySuccessful && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <AlertDescription className="text-red-800">
                                            Vänligen kontrollera fälten ovan och försök igen.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                            
                            <CardFooter className="flex flex-col space-y-4">
                                <Button 
                                    type="submit" 
                                    className="w-full" 
                                    size="lg"
                                    disabled={processing}
                                >
                                    {processing ? 'Skapar konto...' : 'Skapa konto'}
                                </Button>
                                
                                <p className="text-sm text-center text-gray-600">
                                    Har du redan ett konto?{' '}
                                    <Link 
                                        href="/customer/login" 
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Logga in här
                                    </Link>
                                </p>
                            </CardFooter>
                        </form>
                    </Card>
                    
                    {/* Terms */}
                    <p className="text-xs text-center text-gray-500">
                        Genom att skapa ett konto godkänner du våra{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500">Användarvillkor</a>
                        {' '}och{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-500">Integritetspolicy</a>
                    </p>
                </div>
            </div>
        </MarketingLayout>
    );
}