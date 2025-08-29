import { Head, useForm, Link } from '@inertiajs/react';
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
import { UserCog, ArrowLeft, Key } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ user, roles }) {
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'customer',
        date_of_birth: user.date_of_birth || '',
        address: user.address || '',
        city: user.city || '',
        postal_code: user.postal_code || '',
        preferred_contact_method: user.preferred_contact_method || 'email',
        marketing_consent: user.marketing_consent || false,
        customer_notes: user.customer_notes || '',
        email_verified: !!user.email_verified_at,
    });

    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', user.id));
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        passwordForm.post(route('admin.users.reset-password', user.id), {
            onSuccess: () => {
                passwordForm.reset();
                setShowPasswordReset(false);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title={`Redigera användare: ${user.name}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link href={route('admin.users.show', user.id)}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Redigera användare</h1>
                        <p className="text-muted-foreground">
                            Uppdatera information för {user.name}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <UserCog className="mr-2 h-5 w-5" />
                            Användarinformation
                        </CardTitle>
                        <CardDescription>
                            Uppdatera användarens information
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
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Email Verification */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Verifiering</h3>
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

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <Link href={route('admin.users.show', user.id)}>
                                    <Button type="button" variant="outline">
                                        Avbryt
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Sparar...' : 'Spara ändringar'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Password Reset */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Key className="mr-2 h-5 w-5" />
                            Lösenordshantering
                        </CardTitle>
                        <CardDescription>
                            Återställ användarens lösenord
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!showPasswordReset ? (
                            <Button 
                                onClick={() => setShowPasswordReset(true)}
                                variant="outline"
                            >
                                Återställ lösenord
                            </Button>
                        ) : (
                            <form onSubmit={handlePasswordReset} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password">Nytt lösenord</Label>
                                        <Input
                                            id="new_password"
                                            type="password"
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            error={passwordForm.errors.password}
                                            required
                                        />
                                        {passwordForm.errors.password && <p className="text-sm text-destructive">{passwordForm.errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Bekräfta lösenord</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            error={passwordForm.errors.password_confirmation}
                                            required
                                        />
                                        {passwordForm.errors.password_confirmation && <p className="text-sm text-destructive">{passwordForm.errors.password_confirmation}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => {
                                            setShowPasswordReset(false);
                                            passwordForm.reset();
                                        }}
                                    >
                                        Avbryt
                                    </Button>
                                    <Button type="submit" disabled={passwordForm.processing}>
                                        {passwordForm.processing ? 'Återställer...' : 'Återställ lösenord'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}