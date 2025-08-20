import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Car, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MarketingLayout from '@/layouts/MarketingLayout';

export default function CustomerLogin({ status }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/customer/login');
    };

    const handleRememberChange = (checked) => {
        setData('remember', checked);
    };

    return (
        <MarketingLayout>
            <Head title="Logga in" />
            
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center">
                            <Car className="h-12 w-12 text-blue-600" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Logga in på ditt konto
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Få tillgång till dina sparade bilar och förfrågningar
                        </p>
                    </div>

                    {/* Login Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Inloggning</CardTitle>
                            <CardDescription>
                                Ange dina uppgifter för att logga in
                            </CardDescription>
                        </CardHeader>
                        
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                {/* Success Status Message */}
                                {status && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-800">
                                            {status}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Success Message */}
                                {recentlySuccessful && (
                                    <Alert className="border-green-200 bg-green-50">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <AlertDescription className="text-green-800">
                                            Inloggning lyckades! Du omdirigeras snart...
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-postadress</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                        placeholder="din@email.se"
                                        autoFocus
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-600 text-sm">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Lösenord</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                        placeholder="Ditt lösenord"
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-red-600 text-sm">{errors.password}</p>
                                    )}
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={handleRememberChange}
                                    />
                                    <Label htmlFor="remember" className="text-sm">
                                        Kom ihåg mig
                                    </Label>
                                </div>

                                {/* General Error */}
                                {Object.keys(errors).length > 0 && !recentlySuccessful && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <AlertDescription className="text-red-800">
                                            Kontrollera dina inloggningsuppgifter och försök igen.
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
                                    {processing ? 'Loggar in...' : 'Logga in'}
                                </Button>
                                
                                <div className="flex flex-col space-y-2 text-center">
                                    <Link 
                                        href="/customer/forgot-password" 
                                        className="text-sm text-blue-600 hover:text-blue-500"
                                    >
                                        Glömt lösenord?
                                    </Link>
                                    
                                    <p className="text-sm text-gray-600">
                                        Har du inget konto?{' '}
                                        <Link 
                                            href="/customer/register" 
                                            className="font-medium text-blue-600 hover:text-blue-500"
                                        >
                                            Skapa konto här
                                        </Link>
                                    </p>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                    
                    {/* Help */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Behöver du hjälp?{' '}
                            <Link 
                                href="/contact" 
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Kontakta oss
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </MarketingLayout>
    );
}