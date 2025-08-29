import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Create({ roles }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        role: 'customer',
        date_of_birth: '',
        address: '',
        city: '',
        postal_code: '',
        preferred_contact_method: 'email',
        marketing_consent: false,
        customer_notes: '',
        email_verified: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout>
            <Head title="Skapa användare" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link href={route('admin.users.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Skapa användare</h1>
                        <p className="text-muted-foreground">
                            Lägg till en ny användare i systemet
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <UserPlus className="mr-2 h-5 w-5" />
                            Användarinformation
                        </CardTitle>
                        <CardDescription>
                            Fyll i informationen för den nya användaren
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Namn *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        error={errors.name}
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">E-postadress *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        error={errors.email}
                                        required
                                    />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Lösenord *</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        error={errors.password}
                                        required
                                    />
                                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Bekräfta lösenord *</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        error={errors.password_confirmation}
                                        required
                                    />
                                    {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefonnummer</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        error={errors.phone}
                                    />
                                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">Roll *</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map(role => (
                                                <SelectItem key={role} value={role}>
                                                    {role === 'admin' ? 'Admin' : 'Kund'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                                </div>
                            </div>

                            {/* Personal Information */}
                            {data.role === 'customer' && (
                                <>
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-semibold mb-4">Personlig information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="date_of_birth">Födelsedatum</Label>
                                                <Input
                                                    id="date_of_birth"
                                                    type="date"
                                                    value={data.date_of_birth}
                                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                                    error={errors.date_of_birth}
                                                />
                                                {errors.date_of_birth && <p className="text-sm text-destructive">{errors.date_of_birth}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="preferred_contact_method">Föredragen kontaktmetod</Label>
                                                <Select 
                                                    value={data.preferred_contact_method} 
                                                    onValueChange={(value) => setData('preferred_contact_method', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="email">E-post</SelectItem>
                                                        <SelectItem value="phone">Telefon</SelectItem>
                                                        <SelectItem value="sms">SMS</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="address">Adress</Label>
                                                <Input
                                                    id="address"
                                                    type="text"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    error={errors.address}
                                                />
                                                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="city">Stad</Label>
                                                <Input
                                                    id="city"
                                                    type="text"
                                                    value={data.city}
                                                    onChange={(e) => setData('city', e.target.value)}
                                                    error={errors.city}
                                                />
                                                {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="postal_code">Postnummer</Label>
                                                <Input
                                                    id="postal_code"
                                                    type="text"
                                                    value={data.postal_code}
                                                    onChange={(e) => setData('postal_code', e.target.value)}
                                                    error={errors.postal_code}
                                                />
                                                {errors.postal_code && <p className="text-sm text-destructive">{errors.postal_code}</p>}
                                            </div>

                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="customer_notes">Anteckningar</Label>
                                                <Textarea
                                                    id="customer_notes"
                                                    value={data.customer_notes}
                                                    onChange={(e) => setData('customer_notes', e.target.value)}
                                                    error={errors.customer_notes}
                                                    rows={3}
                                                />
                                                {errors.customer_notes && <p className="text-sm text-destructive">{errors.customer_notes}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Consent */}
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-semibold mb-4">Samtycken</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="marketing_consent"
                                                    checked={data.marketing_consent}
                                                    onCheckedChange={(checked) => setData('marketing_consent', checked)}
                                                />
                                                <Label htmlFor="marketing_consent">
                                                    Godkänn marknadsföring via e-post
                                                </Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="email_verified"
                                                    checked={data.email_verified}
                                                    onCheckedChange={(checked) => setData('email_verified', checked)}
                                                />
                                                <Label htmlFor="email_verified">
                                                    Markera e-post som verifierad
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Admin specific fields */}
                            {data.role === 'admin' && (
                                <div className="border-t pt-6">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="email_verified"
                                            checked={data.email_verified}
                                            onCheckedChange={(checked) => setData('email_verified', checked)}
                                        />
                                        <Label htmlFor="email_verified">
                                            Markera e-post som verifierad
                                        </Label>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <Link href={route('admin.users.index')}>
                                    <Button type="button" variant="outline">
                                        Avbryt
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Skapar...' : 'Skapa användare'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}