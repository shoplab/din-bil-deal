import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Mail, Save, Variable } from 'lucide-react';

export default function CreateTemplate({ commonVariables }) {
    const form = useForm({
        name: '',
        slug: '',
        subject: '',
        body: '',
        description: '',
        variables: [],
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.post(route('admin.settings.templates.store'));
    };

    const insertVariable = (variable, field) => {
        const placeholder = `{{${variable}}}`;
        if (field === 'subject') {
            form.setData('subject', form.data.subject + placeholder);
        } else {
            form.setData('body', form.data.body + placeholder);
        }

        // Add to variables list if not already there
        if (!form.data.variables.includes(variable)) {
            form.setData('variables', [...form.data.variables, variable]);
        }
    };

    return (
        <AdminLayout>
            <Head title="Skapa e-postmall" />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.settings.templates')}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Skapa e-postmall</h1>
                            <p className="text-muted-foreground">Definiera en ny e-postmall för systemet</p>
                        </div>
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Spara mall
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Template Info */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Mail className="mr-2 h-5 w-5" />
                                Mallinformation
                            </CardTitle>
                            <CardDescription>Grundläggande information om mallen</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Namn</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="T.ex. Orderbekräftelse"
                                />
                                {form.errors.name && (
                                    <p className="text-sm text-destructive">{form.errors.name}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug (valfritt)</Label>
                                <Input
                                    id="slug"
                                    value={form.data.slug}
                                    onChange={(e) => form.setData('slug', e.target.value)}
                                    placeholder="t.ex. order_confirmation"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Lämna tomt för att generera automatiskt
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Beskrivning</Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Beskriv när denna mall används..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="is_active">Aktiv</Label>
                                <Switch
                                    id="is_active"
                                    checked={form.data.is_active}
                                    onCheckedChange={(checked) => form.setData('is_active', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Template Content */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Mallinnehåll</CardTitle>
                            <CardDescription>Ämne och brödtext för e-postmeddelandet</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="subject">Ämne</Label>
                                <Input
                                    id="subject"
                                    value={form.data.subject}
                                    onChange={(e) => form.setData('subject', e.target.value)}
                                    placeholder="T.ex. Bekräftelse på din bokning - {{site_name}}"
                                />
                                {form.errors.subject && (
                                    <p className="text-sm text-destructive">{form.errors.subject}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="body">Brödtext (HTML)</Label>
                                <Textarea
                                    id="body"
                                    value={form.data.body}
                                    onChange={(e) => form.setData('body', e.target.value)}
                                    placeholder="<h1>Hej {{user_name}}</h1><p>Ditt meddelande här...</p>"
                                    rows={12}
                                    className="font-mono text-sm"
                                />
                                {form.errors.body && (
                                    <p className="text-sm text-destructive">{form.errors.body}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Variables */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Variable className="mr-2 h-5 w-5" />
                            Tillgängliga variabler
                        </CardTitle>
                        <CardDescription>
                            Klicka på en variabel för att infoga den i brödtexten
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(commonVariables).map(([variable, description]) => (
                                <Button
                                    key={variable}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => insertVariable(variable, 'body')}
                                    className="font-mono"
                                >
                                    {`{{${variable}}}`}
                                    <span className="ml-2 text-muted-foreground font-sans text-xs">
                                        {description}
                                    </span>
                                </Button>
                            ))}
                        </div>
                        {form.data.variables.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="text-sm text-muted-foreground mb-2">Använda variabler:</div>
                                <div className="flex flex-wrap gap-1">
                                    {form.data.variables.map((variable) => (
                                        <Badge key={variable} variant="secondary" className="font-mono">
                                            {`{{${variable}}}`}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </form>
        </AdminLayout>
    );
}
