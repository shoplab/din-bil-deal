import { Head, Link, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
    Users,
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Key,
    Mail,
    ShieldCheck,
    ShieldOff,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Crown,
} from 'lucide-react';
import { useState } from 'react';

export default function UsersSettings({ users, roles, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const createForm = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        roles: [],
        is_active: true,
    });

    const editForm = useForm({
        name: '',
        email: '',
        phone: '',
        roles: [],
        is_active: true,
    });

    const resetForm = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get(
            route('admin.settings.users'),
            {
                search: searchTerm || undefined,
                role: selectedRole !== 'all' ? selectedRole : undefined,
                status: selectedStatus !== 'all' ? selectedStatus : undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route('admin.settings.users.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            roles: user.roles.map((r) => r.id),
            is_active: user.is_active,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.put(route('admin.settings.users.update', selectedUser.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedUser(null);
            },
        });
    };

    const handleResetPassword = (user) => {
        setSelectedUser(user);
        resetForm.reset();
        setIsResetOpen(true);
    };

    const submitResetPassword = (e) => {
        e.preventDefault();
        resetForm.post(route('admin.settings.users.reset-password', selectedUser.id), {
            onSuccess: () => {
                setIsResetOpen(false);
                setSelectedUser(null);
                resetForm.reset();
            },
        });
    };

    const sendPasswordResetEmail = (user) => {
        router.post(route('admin.settings.users.send-reset', user.id));
    };

    const toggleActive = (user) => {
        router.patch(route('admin.settings.users.toggle-active', user.id));
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.settings.users.destroy', selectedUser.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedUser(null);
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
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <Head title="Användarhantering" />

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
                            <h1 className="text-3xl font-bold tracking-tight">Användarhantering</h1>
                            <p className="text-muted-foreground">
                                Hantera administratörer och systemanvändare
                            </p>
                        </div>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Skapa användare
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Skapa ny användare</DialogTitle>
                                    <DialogDescription>
                                        Lägg till en ny administratör eller systemanvändare.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Namn</Label>
                                        <Input
                                            id="name"
                                            value={createForm.data.name}
                                            onChange={(e) => createForm.setData('name', e.target.value)}
                                        />
                                        {createForm.errors.name && (
                                            <p className="text-sm text-destructive">{createForm.errors.name}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">E-post</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={createForm.data.email}
                                            onChange={(e) => createForm.setData('email', e.target.value)}
                                        />
                                        {createForm.errors.email && (
                                            <p className="text-sm text-destructive">{createForm.errors.email}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Telefon</Label>
                                        <Input
                                            id="phone"
                                            value={createForm.data.phone}
                                            onChange={(e) => createForm.setData('phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Lösenord</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={createForm.data.password}
                                            onChange={(e) => createForm.setData('password', e.target.value)}
                                        />
                                        {createForm.errors.password && (
                                            <p className="text-sm text-destructive">{createForm.errors.password}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">Bekräfta lösenord</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={createForm.data.password_confirmation}
                                            onChange={(e) =>
                                                createForm.setData('password_confirmation', e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Roller</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {roles.map((role) => (
                                                <label
                                                    key={role.id}
                                                    className="flex items-center space-x-2 cursor-pointer"
                                                >
                                                    <Checkbox
                                                        checked={createForm.data.roles.includes(role.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                createForm.setData('roles', [
                                                                    ...createForm.data.roles,
                                                                    role.id,
                                                                ]);
                                                            } else {
                                                                createForm.setData(
                                                                    'roles',
                                                                    createForm.data.roles.filter((id) => id !== role.id)
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <span className="text-sm">{role.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {createForm.errors.roles && (
                                            <p className="text-sm text-destructive">{createForm.errors.roles}</p>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsCreateOpen(false)}
                                    >
                                        Avbryt
                                    </Button>
                                    <Button type="submit" disabled={createForm.processing}>
                                        Skapa
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Sök användare..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Roll" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Alla roller</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role.id} value={role.slug}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Alla</SelectItem>
                                    <SelectItem value="active">Aktiva</SelectItem>
                                    <SelectItem value="inactive">Inaktiva</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="mr-2 h-5 w-5" />
                            Användare ({users.total})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-medium">Användare</th>
                                        <th className="text-left p-4 font-medium">Roller</th>
                                        <th className="text-left p-4 font-medium">Status</th>
                                        <th className="text-left p-4 font-medium">Skapad</th>
                                        <th className="text-left p-4 font-medium">Åtgärder</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/25">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {user.is_super_user && (
                                                        <Crown className="h-4 w-4 text-yellow-500" />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {user.email}
                                                        </div>
                                                        {user.phone && (
                                                            <div className="text-sm text-muted-foreground">
                                                                {user.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <Badge key={role.id} className={getRoleBadgeColor(role)}>
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={user.is_active ? 'success' : 'secondary'}>
                                                    {user.is_active ? 'Aktiv' : 'Inaktiv'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString('sv-SE')}
                                            </td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Åtgärder</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Redigera
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                                            <Key className="mr-2 h-4 w-4" />
                                                            Återställ lösenord
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => sendPasswordResetEmail(user)}>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Skicka återställningslänk
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {!user.is_super_user && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => toggleActive(user)}>
                                                                    {user.is_active ? (
                                                                        <>
                                                                            <ShieldOff className="mr-2 h-4 w-4" />
                                                                            Inaktivera
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                                                            Aktivera
                                                                        </>
                                                                    )}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(user)}
                                                                    className="text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Ta bort
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-4 border-t">
                                <div className="text-sm text-muted-foreground">
                                    Visar {users.from}-{users.to} av {users.total} användare
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(users.prev_page_url)}
                                        disabled={!users.prev_page_url}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Föregående
                                    </Button>
                                    <div className="text-sm">
                                        Sida {users.current_page} av {users.last_page}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get(users.next_page_url)}
                                        disabled={!users.next_page_url}
                                    >
                                        Nästa
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleUpdate}>
                        <DialogHeader>
                            <DialogTitle>Redigera användare</DialogTitle>
                            <DialogDescription>Uppdatera användarens information.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Namn</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-destructive">{editForm.errors.name}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-email">E-post</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                />
                                {editForm.errors.email && (
                                    <p className="text-sm text-destructive">{editForm.errors.email}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-phone">Telefon</Label>
                                <Input
                                    id="edit-phone"
                                    value={editForm.data.phone}
                                    onChange={(e) => editForm.setData('phone', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Roller</Label>
                                <div className="flex flex-wrap gap-2">
                                    {roles.map((role) => (
                                        <label key={role.id} className="flex items-center space-x-2 cursor-pointer">
                                            <Checkbox
                                                checked={editForm.data.roles.includes(role.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        editForm.setData('roles', [...editForm.data.roles, role.id]);
                                                    } else {
                                                        editForm.setData(
                                                            'roles',
                                                            editForm.data.roles.filter((id) => id !== role.id)
                                                        );
                                                    }
                                                }}
                                            />
                                            <span className="text-sm">{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {editForm.errors.roles && (
                                    <p className="text-sm text-destructive">{editForm.errors.roles}</p>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-active"
                                    checked={editForm.data.is_active}
                                    onCheckedChange={(checked) => editForm.setData('is_active', checked)}
                                />
                                <Label htmlFor="edit-active">Aktiv</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                                Avbryt
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                Spara
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <form onSubmit={submitResetPassword}>
                        <DialogHeader>
                            <DialogTitle>Återställ lösenord</DialogTitle>
                            <DialogDescription>
                                Ange ett nytt lösenord för {selectedUser?.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="reset-password">Nytt lösenord</Label>
                                <Input
                                    id="reset-password"
                                    type="password"
                                    value={resetForm.data.password}
                                    onChange={(e) => resetForm.setData('password', e.target.value)}
                                />
                                {resetForm.errors.password && (
                                    <p className="text-sm text-destructive">{resetForm.errors.password}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="reset-password-confirm">Bekräfta lösenord</Label>
                                <Input
                                    id="reset-password-confirm"
                                    type="password"
                                    value={resetForm.data.password_confirmation}
                                    onChange={(e) => resetForm.setData('password_confirmation', e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsResetOpen(false)}>
                                Avbryt
                            </Button>
                            <Button type="submit" disabled={resetForm.processing}>
                                Återställ
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ta bort användare?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Är du säker på att du vill ta bort {selectedUser?.name}? Denna åtgärd kan inte ångras.
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
