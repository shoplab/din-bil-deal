import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Lock, Crown, Save } from 'lucide-react';
import { useState } from 'react';

export default function PermissionsSettings({ permissionGroups, roles }) {
    const [rolePermissions, setRolePermissions] = useState(
        roles.reduce((acc, role) => {
            acc[role.id] = role.permissions;
            return acc;
        }, {})
    );
    const [saving, setSaving] = useState({});

    const togglePermission = (roleId, permissionId) => {
        const current = rolePermissions[roleId] || [];
        const newPermissions = current.includes(permissionId)
            ? current.filter((id) => id !== permissionId)
            : [...current, permissionId];

        setRolePermissions({
            ...rolePermissions,
            [roleId]: newPermissions,
        });
    };

    const saveRolePermissions = (role) => {
        setSaving({ ...saving, [role.id]: true });

        router.put(
            route('admin.settings.permissions.role.update', role.id),
            { permissions: rolePermissions[role.id] },
            {
                preserveScroll: true,
                onFinish: () => {
                    setSaving({ ...saving, [role.id]: false });
                },
            }
        );
    };

    const hasChanges = (role) => {
        const original = role.permissions.sort().join(',');
        const current = (rolePermissions[role.id] || []).sort().join(',');
        return original !== current;
    };

    const getRoleBadgeColor = (role) => {
        if (role.is_super_user) return 'bg-yellow-100 text-yellow-800';
        switch (role.slug) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'manager':
                return 'bg-purple-100 text-purple-800';
            case 'agent':
                return 'bg-blue-100 text-blue-800';
            case 'customer':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter out customer role from the display
    const adminRoles = roles.filter((r) => r.slug !== 'customer');

    return (
        <AdminLayout>
            <Head title="Behörigheter" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('admin.settings.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Behörigheter</h1>
                        <p className="text-muted-foreground">
                            Konfigurera vilka behörigheter varje roll har i systemet
                        </p>
                    </div>
                </div>

                {/* Permission Matrix */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Lock className="mr-2 h-5 w-5" />
                            Behörighetsmatris
                        </CardTitle>
                        <CardDescription>
                            Kryssa i behörigheter för varje roll. Super Användare har automatiskt alla behörigheter.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium min-w-[200px]">Behörighet</th>
                                        {adminRoles.map((role) => (
                                            <th key={role.id} className="text-center p-4 font-medium min-w-[120px]">
                                                <div className="flex flex-col items-center gap-1">
                                                    <Badge className={getRoleBadgeColor(role)}>
                                                        {role.is_super_user && <Crown className="mr-1 h-3 w-3" />}
                                                        {role.name}
                                                    </Badge>
                                                    {!role.is_super_user && hasChanges(role) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-6 text-xs"
                                                            onClick={() => saveRolePermissions(role)}
                                                            disabled={saving[role.id]}
                                                        >
                                                            <Save className="mr-1 h-3 w-3" />
                                                            Spara
                                                        </Button>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissionGroups.map((group) => (
                                        <>
                                            <tr key={group.slug} className="bg-muted/25">
                                                <td colSpan={adminRoles.length + 1} className="p-3 font-semibold">
                                                    {group.name}
                                                </td>
                                            </tr>
                                            {group.permissions.map((permission) => (
                                                <tr key={permission.id} className="border-b hover:bg-muted/10">
                                                    <td className="p-4">
                                                        <div>
                                                            <div className="font-medium">{permission.name}</div>
                                                            {permission.description && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    {permission.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    {adminRoles.map((role) => (
                                                        <td key={role.id} className="p-4 text-center">
                                                            {role.is_super_user ? (
                                                                <Checkbox checked disabled className="opacity-50" />
                                                            ) : (
                                                                <Checkbox
                                                                    checked={(rolePermissions[role.id] || []).includes(
                                                                        permission.id
                                                                    )}
                                                                    onCheckedChange={() =>
                                                                        togglePermission(role.id, permission.id)
                                                                    }
                                                                />
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Om behörigheter</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>
                            Behörigheter kontrollerar vad användare kan göra i systemet. En användare kan ha flera
                            roller, och får då kombinerade behörigheter från alla sina roller.
                        </p>
                        <p>
                            <strong>Viktigt:</strong> Ändringar träder i kraft omedelbart efter att du sparar. Se till
                            att du inte låser ut dig själv eller andra administratörer från viktiga funktioner.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
