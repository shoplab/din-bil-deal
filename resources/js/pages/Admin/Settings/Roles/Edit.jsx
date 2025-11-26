import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Shield, Save, Crown, Settings } from 'lucide-react';

export default function EditRole({ role, permissions }) {
    const form = useForm({
        name: role.name,
        slug: role.slug,
        description: role.description || '',
        permissions: role.permissions,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        form.put(route('admin.settings.roles.update', role.id));
    };

    const togglePermission = (permissionId) => {
        if (form.data.permissions.includes(permissionId)) {
            form.setData(
                'permissions',
                form.data.permissions.filter((id) => id !== permissionId)
            );
        } else {
            form.setData('permissions', [...form.data.permissions, permissionId]);
        }
    };

    const toggleGroup = (groupPermissions) => {
        const groupIds = groupPermissions.map((p) => p.id);
        const allSelected = groupIds.every((id) => form.data.permissions.includes(id));

        if (allSelected) {
            form.setData(
                'permissions',
                form.data.permissions.filter((id) => !groupIds.includes(id))
            );
        } else {
            form.setData('permissions', [...new Set([...form.data.permissions, ...groupIds])]);
        }
    };

    const getGroupLabel = (group) => {
        const labels = {
            dashboard: 'Dashboard',
            cars: 'Bilar',
            leads: 'Leads',
            deals: 'Affärer',
            users: 'Användare',
            analytics: 'Statistik',
            forms: 'Formulär',
            settings: 'Inställningar',
        };
        return labels[group] || group;
    };

    return (
        <AdminLayout>
            <Head title={`Redigera ${role.name}`} />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.settings.roles')}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight">Redigera {role.name}</h1>
                                {role.is_super_user && (
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                        <Crown className="mr-1 h-3 w-3" />
                                        Super User
                                    </Badge>
                                )}
                                {role.is_system && !role.is_super_user && (
                                    <Badge variant="outline">
                                        <Settings className="mr-1 h-3 w-3" />
                                        Systemroll
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground">Uppdatera roll och behörigheter</p>
                        </div>
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        <Save className="mr-2 h-4 w-4" />
                        Spara ändringar
                    </Button>
                </div>

                {role.is_super_user && (
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>Super Användare</strong> har automatiskt alla behörigheter och kan inte begränsas.
                            Du kan endast uppdatera beskrivningen.
                        </p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Role Info */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="mr-2 h-5 w-5" />
                                Rollinformation
                            </CardTitle>
                            <CardDescription>Grundläggande information om rollen</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Namn</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    disabled={role.is_system}
                                />
                                {form.errors.name && (
                                    <p className="text-sm text-destructive">{form.errors.name}</p>
                                )}
                                {role.is_system && (
                                    <p className="text-xs text-muted-foreground">Systemrollers namn kan inte ändras</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={form.data.slug}
                                    onChange={(e) => form.setData('slug', e.target.value)}
                                    disabled={role.is_system}
                                />
                                {form.errors.slug && (
                                    <p className="text-sm text-destructive">{form.errors.slug}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Beskrivning</Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    rows={3}
                                />
                                {form.errors.description && (
                                    <p className="text-sm text-destructive">{form.errors.description}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permissions */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Behörigheter</CardTitle>
                            <CardDescription>
                                {role.is_super_user
                                    ? 'Super Användare har alla behörigheter automatiskt'
                                    : `Välj vilka behörigheter denna roll ska ha. Valda: ${form.data.permissions.length}`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {role.is_super_user ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Crown className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                                    <p>Alla behörigheter är automatiskt tilldelade</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(permissions).map(([group, groupPermissions]) => {
                                        const groupIds = groupPermissions.map((p) => p.id);
                                        const allSelected = groupIds.every((id) =>
                                            form.data.permissions.includes(id)
                                        );
                                        const someSelected =
                                            groupIds.some((id) => form.data.permissions.includes(id)) && !allSelected;

                                        return (
                                            <div key={group} className="space-y-3">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`group-${group}`}
                                                        checked={allSelected}
                                                        onCheckedChange={() => toggleGroup(groupPermissions)}
                                                        className={someSelected ? 'opacity-50' : ''}
                                                    />
                                                    <Label htmlFor={`group-${group}`} className="font-semibold">
                                                        {getGroupLabel(group)}
                                                    </Label>
                                                </div>
                                                <div className="ml-6 grid gap-2 sm:grid-cols-2">
                                                    {groupPermissions.map((permission) => (
                                                        <div
                                                            key={permission.id}
                                                            className="flex items-center space-x-2"
                                                        >
                                                            <Checkbox
                                                                id={`permission-${permission.id}`}
                                                                checked={form.data.permissions.includes(permission.id)}
                                                                onCheckedChange={() => togglePermission(permission.id)}
                                                            />
                                                            <Label
                                                                htmlFor={`permission-${permission.id}`}
                                                                className="text-sm font-normal cursor-pointer"
                                                            >
                                                                {permission.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </form>
        </AdminLayout>
    );
}
