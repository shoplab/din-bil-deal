import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    AlertTriangle,
    Trash2,
    ArrowLeft,
    Shield,
    Download,
    Eye,
    EyeOff
} from 'lucide-react';

export default function DeleteProfile() {
    const [showPassword, setShowPassword] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { data, setData, delete: deleteAccount, processing, errors } = useForm({
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!confirmDelete) {
            return;
        }
        deleteAccount(route('customer.profile.destroy'));
    };

    const downloadData = () => {
        window.location.href = route('customer.profile.download');
    };

    return (
        <CustomerLayout title="Radera konto">
            <Head title="Radera konto" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" asChild>
                    <a href={route('customer.profile.edit')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Tillbaka till profil
                    </a>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Radera konto</h1>
                    <p className="text-gray-600 mt-1">
                        Permanent borttagning av ditt konto och all data
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Warning */}
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Varning!</strong> Detta är en permanent åtgärd som inte kan ångras. 
                        All din data kommer att raderas permanent från våra system.
                    </AlertDescription>
                </Alert>

                {/* What will be deleted */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-5 w-5" />
                            Vad som kommer att raderas
                        </CardTitle>
                        <CardDescription>
                            Följande information kommer att tas bort permanent:
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                All personlig information (namn, e-post, telefon, adress)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Alla sparade bilar och favoriter
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Bokade tider och tidigare möten
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                All meddelandehistorik och konversationer
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Alla leads och förfrågningar
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Kontoinställningar och preferenser
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Download data first */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Ladda ner din data först
                        </CardTitle>
                        <CardDescription>
                            Enligt GDPR har du rätt att få en kopia av all din personliga data innan du raderar ditt konto.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            Vi rekommenderar starkt att du laddar ner en kopia av all din data innan du fortsätter. 
                            Detta inkluderar all din personliga information, meddelanden, bokningar och aktivitetshistorik.
                        </p>
                        <Button variant="outline" onClick={downloadData} className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Ladda ner min data (JSON)
                        </Button>
                    </CardContent>
                </Card>

                {/* Alternatives */}
                <Card>
                    <CardHeader>
                        <CardTitle>Alternativ till radering</CardTitle>
                        <CardDescription>
                            Kanske finns det andra lösningar på ditt problem:
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-1">Avsluta marknadsföring</h4>
                                <p className="text-gray-600">
                                    Du kan avsluta all marknadsföring i dina profilinställningar utan att radera kontot.
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-1">Ändra kontaktinställningar</h4>
                                <p className="text-gray-600">
                                    Uppdatera hur vi kontaktar dig eller stäng av alla notifikationer.
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-1">Kontakta support</h4>
                                <p className="text-gray-600">
                                    Har du specifika problem? Vårt supportteam kan hjälpa dig utan att radera kontot.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Deletion form */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <Shield className="h-5 w-5" />
                            Bekräfta radering
                        </CardTitle>
                        <CardDescription>
                            Ange ditt lösenord för att bekräfta att du vill radera ditt konto permanent.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Password confirmation */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Bekräfta med ditt lösenord</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Ange ditt lösenord"
                                        className={errors.password ? 'border-red-500' : ''}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Final confirmation */}
                            <div className="flex items-start space-x-3 pt-2">
                                <Checkbox
                                    id="confirm_delete"
                                    checked={confirmDelete}
                                    onCheckedChange={setConfirmDelete}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="confirm_delete" className="text-sm font-medium">
                                        Jag förstår att denna åtgärd är permanent
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                        Genom att markera denna ruta bekräftar jag att jag vill radera mitt konto permanent 
                                        och att all min data kommer att tas bort och inte kan återställas.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="outline" asChild className="flex-1">
                                    <a href={route('customer.profile.edit')}>
                                        Avbryt
                                    </a>
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="destructive" 
                                    disabled={processing || !confirmDelete || !data.password}
                                    className="flex-1"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {processing ? 'Raderar...' : 'Radera konto permanent'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* GDPR notice */}
                <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                        <div className="text-xs text-gray-600 space-y-2">
                            <p>
                                <strong>GDPR-information:</strong> Enligt dataskyddsförordningen (GDPR) har du rätt att:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Få en kopia av all din personliga data</li>
                                <li>Få din data raderad (rätten att bli glömd)</li>
                                <li>Begära rättelse av felaktig information</li>
                                <li>Begränsa behandlingen av din data</li>
                            </ul>
                            <p>
                                För frågor om databehandling, kontakta oss på{' '}
                                <a href="mailto:privacy@dinbildeal.se" className="text-blue-600 hover:underline">
                                    privacy@dinbildeal.se
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CustomerLayout>
    );
}