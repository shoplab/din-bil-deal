import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Globe, Save, Clock, Calendar, DollarSign } from 'lucide-react';

export default function GeneralSettings({ settings, timezones }) {
    const form = useForm({
        site_name: settings.site_name?.value || '',
        timezone: settings.timezone?.value || 'Europe/Stockholm',
        date_format: settings.date_format?.value || 'Y-m-d',
        time_format: settings.time_format?.value || 'H:i',
        currency: settings.currency?.value || 'SEK',
        locale: settings.locale?.value || 'sv_SE',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.put(route('admin.settings.general.update'));
    };

    const dateFormats = [
        { value: 'Y-m-d', label: '2024-01-15 (ISO)' },
        { value: 'd/m/Y', label: '15/01/2024 (EU)' },
        { value: 'm/d/Y', label: '01/15/2024 (US)' },
        { value: 'd.m.Y', label: '15.01.2024 (DE)' },
        { value: 'd M Y', label: '15 Jan 2024' },
        { value: 'F j, Y', label: 'January 15, 2024' },
    ];

    const timeFormats = [
        { value: 'H:i', label: '14:30 (24-timmar)' },
        { value: 'H:i:s', label: '14:30:00 (24-timmar med sekunder)' },
        { value: 'g:i A', label: '2:30 PM (12-timmar)' },
        { value: 'g:i:s A', label: '2:30:00 PM (12-timmar med sekunder)' },
    ];

    const currencies = [
        { value: 'SEK', label: 'SEK - Svenska kronor' },
        { value: 'EUR', label: 'EUR - Euro' },
        { value: 'USD', label: 'USD - US Dollar' },
        { value: 'NOK', label: 'NOK - Norska kronor' },
        { value: 'DKK', label: 'DKK - Danska kronor' },
        { value: 'GBP', label: 'GBP - Brittiska pund' },
    ];

    const locales = [
        { value: 'sv_SE', label: 'Svenska (Sverige)' },
        { value: 'en_US', label: 'English (US)' },
        { value: 'en_GB', label: 'English (UK)' },
        { value: 'de_DE', label: 'Deutsch (Deutschland)' },
        { value: 'fr_FR', label: 'Français (France)' },
        { value: 'nb_NO', label: 'Norsk (Norge)' },
        { value: 'da_DK', label: 'Dansk (Danmark)' },
    ];

    return (
        <AdminLayout>
            <Head title="Allmänna inställningar" />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.settings.index')}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Allmänna inställningar</h1>
                            <p className="text-muted-foreground">Grundläggande konfiguration för systemet</p>
                        </div>
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Spara inställningar
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Site Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Globe className="mr-2 h-5 w-5" />
                                Webbplatsinställningar
                            </CardTitle>
                            <CardDescription>Grundläggande information om webbplatsen</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="site_name">Webbplatsnamn</Label>
                                <Input
                                    id="site_name"
                                    value={form.data.site_name}
                                    onChange={(e) => form.setData('site_name', e.target.value)}
                                />
                                {form.errors.site_name && (
                                    <p className="text-sm text-destructive">{form.errors.site_name}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="locale">Språk</Label>
                                <Select
                                    value={form.data.locale}
                                    onValueChange={(value) => form.setData('locale', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Välj språk" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locales.map((locale) => (
                                            <SelectItem key={locale.value} value={locale.value}>
                                                {locale.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.locale && (
                                    <p className="text-sm text-destructive">{form.errors.locale}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="currency">Valuta</Label>
                                <Select
                                    value={form.data.currency}
                                    onValueChange={(value) => form.setData('currency', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Välj valuta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencies.map((currency) => (
                                            <SelectItem key={currency.value} value={currency.value}>
                                                {currency.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.currency && (
                                    <p className="text-sm text-destructive">{form.errors.currency}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Time Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Clock className="mr-2 h-5 w-5" />
                                Tid och datum
                            </CardTitle>
                            <CardDescription>Konfigurera tidszon och datumformat</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="timezone">Tidszon</Label>
                                <Select
                                    value={form.data.timezone}
                                    onValueChange={(value) => form.setData('timezone', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Välj tidszon" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {Object.entries(timezones).map(([region, zones]) => (
                                            <div key={region}>
                                                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted">
                                                    {region}
                                                </div>
                                                {zones.map((tz) => (
                                                    <SelectItem key={tz} value={tz}>
                                                        {tz.replace('_', ' ')}
                                                    </SelectItem>
                                                ))}
                                            </div>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.timezone && (
                                    <p className="text-sm text-destructive">{form.errors.timezone}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date_format">Datumformat</Label>
                                <Select
                                    value={form.data.date_format}
                                    onValueChange={(value) => form.setData('date_format', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Välj datumformat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dateFormats.map((format) => (
                                            <SelectItem key={format.value} value={format.value}>
                                                {format.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.date_format && (
                                    <p className="text-sm text-destructive">{form.errors.date_format}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="time_format">Tidsformat</Label>
                                <Select
                                    value={form.data.time_format}
                                    onValueChange={(value) => form.setData('time_format', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Välj tidsformat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {timeFormats.map((format) => (
                                            <SelectItem key={format.value} value={format.value}>
                                                {format.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.time_format && (
                                    <p className="text-sm text-destructive">{form.errors.time_format}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Förhandsvisning</CardTitle>
                        <CardDescription>Så här kommer datum och tid att visas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                                <Calendar className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                                <div className="text-sm text-muted-foreground">Datum</div>
                                <div className="font-medium">
                                    {new Date().toLocaleDateString(
                                        form.data.locale.replace('_', '-'),
                                        form.data.date_format === 'Y-m-d'
                                            ? { year: 'numeric', month: '2-digit', day: '2-digit' }
                                            : { dateStyle: 'long' }
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                                <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                                <div className="text-sm text-muted-foreground">Tid</div>
                                <div className="font-medium">
                                    {new Date().toLocaleTimeString(form.data.locale.replace('_', '-'), {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: form.data.time_format.includes('A'),
                                    })}
                                </div>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                                <DollarSign className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                                <div className="text-sm text-muted-foreground">Valuta</div>
                                <div className="font-medium">
                                    {new Intl.NumberFormat(form.data.locale.replace('_', '-'), {
                                        style: 'currency',
                                        currency: form.data.currency,
                                    }).format(299000)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </AdminLayout>
    );
}
