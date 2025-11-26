import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Shield,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Users,
    Lock,
    ArrowLeft,
    Crown,
    Settings,
} from 'lucide-react';
import { useState } from 'react';

export default function RolesSettings({ roles }) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    const handleDelete = (role) => {
        setSelectedRole(role);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.settings.roles.destroy', selectedRole.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedRole(null);
            },
        });
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

    return (
        <AdminLayout>
            <Head title="Roller" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.settings.index')}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Roller</h1>
                            <p className="text-muted-foreground">Hantera användarroller och deras behörigheter</p>
                        </div>
                    </div>
                    <Link href={route('admin.settings.roles.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Skapa roll
                        </Button>
                    </Link>
                </div>

                {/* Roles Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => (
                        <Card key={role.id} className="relative">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 rounded-lg ${
                                                role.is_super_user
                                                    ? 'bg-yellow-100'
                                                    : role.is_system
                                                      ? 'bg-blue-100'
                                                      : 'bg-gray-100'
                                            }`}
                                        >
                                            {role.is_super_user ? (
                                                <Crown className="h-5 w-5 text-yellow-600" />
                                            ) : (
                                                <Shield className="h-5 w-5 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{role.name}</CardTitle>
                                            <Badge className={getRoleBadgeColor(role)}>{role.slug}</Badge>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Åtgärder</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={route('admin.settings.roles.edit', role.id)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Redigera
                                                </Link>
                                            </DropdownMenuItem>
                                            {!role.is_system && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(role)}
                                                        className="text-destructive"
                                                        disabled={role.users_count > 0}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Ta bort
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardDescription className="mt-2">{role.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center text-muted-foreground">
                                            <Users className="mr-1 h-4 w-4" />
                                            {role.users_count} användare
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <Lock className="mr-1 h-4 w-4" />
                                            {role.is_super_user ? 'Alla' : role.permissions_count} behörigheter
                                        </div>
                                    </div>
                                    {role.is_system && (
                                        <Badge variant="outline" className="text-xs">
                                            <Settings className="mr-1 h-3 w-3" />
                                            System
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Om roller</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>
                            <strong>Systemroller</strong> kan inte tas bort men deras behörigheter kan justeras (förutom
                            Super Användare).
                        </p>
                        <p>
                            <strong>Super Användare</strong> har automatiskt alla behörigheter och kan inte begränsas.
                        </p>
                        <p>
                            Roller med användare kopplade kan inte tas bort. Flytta användarna till en annan roll först.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ta bort roll?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Är du säker på att du vill ta bort rollen "{selectedRole?.name}"? Denna åtgärd kan inte
                            ångras.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Avbryt</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                            Ta bort
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
