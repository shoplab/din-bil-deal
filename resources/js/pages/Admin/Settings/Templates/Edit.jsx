import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Mail, Save, Variable, Settings } from 'lucide-react';

export default function EditTemplate({ template, commonVariables }) {
    const form = useForm({
        name: template.name,
        slug: template.slug,
        subject: template.subject,
        body: template.body,
        description: template.description || '',
        variables: template.variables || [],
        is_active: template.is_active,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.put(route('admin.settings.templates.update', template.id));
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
            <Head title={`Redigera ${template.name}`} />

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
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight">Redigera {template.name}</h1>
                                {template.is_system && (
                                    <Badge variant="outline">
                                        <Settings className="mr-1 h-3 w-3" />
                                        Systemmall
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground">Uppdatera e-postmallens innehåll</p>
                        </div>
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Spara ändringar
                    </Button>
                </div>

                {template.is_system && (
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Systemmall:</strong> Du kan ändra ämne, innehåll och aktivera/inaktivera denna mall,
                            men inte ändra namn eller slug.
                        </p>
                    </div>
                )}

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
                                    disabled={template.is_system}
                                />
                                {form.errors.name && (
                                    <p className="text-sm text-destructive">{form.errors.name}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={form.data.slug}
                                    onChange={(e) => form.setData('slug', e.target.value)}
                                    disabled={template.is_system}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Beskrivning</Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    rows={3}
                                    disabled={template.is_system}
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
                                    rows={16}
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
                        {form.data.variables && form.data.variables.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="text-sm text-muted-foreground mb-2">Definierade variabler för denna mall:</div>
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

                {/* Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Förhandsvisning</CardTitle>
                        <CardDescription>
                            Så här ser e-posten ut (variabler visas som platshållare)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Ämne:</div>
                                <div className="p-3 bg-muted rounded-lg">{form.data.subject}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Innehåll:</div>
                                <div
                                    className="p-4 border rounded-lg prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: form.data.body }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </AdminLayout>
    );
}
