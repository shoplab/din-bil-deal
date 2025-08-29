import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
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
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
    Users,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Shield,
    ShieldCheck,
    SortAsc,
    SortDesc,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Index({ users, filters, roles }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');
    const [selectedVerified, setSelectedVerified] = useState(filters.verified || 'all');
    const [selectedMarketing, setSelectedMarketing] = useState(filters.marketing_consent || 'all');
    const [sortBy, setSortBy] = useState(filters.sort || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.order || 'desc');

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        const params = {
            search: searchTerm || undefined,
            role: selectedRole !== 'all' ? selectedRole : undefined,
            verified: selectedVerified !== 'all' ? selectedVerified : undefined,
            marketing_consent: selectedMarketing !== 'all' ? selectedMarketing : undefined,
            sort: sortBy,
            order: sortOrder,
        };
        
        router.get(route('admin.users.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
        
        setTimeout(() => applyFilters(), 0);
    };

    const deleteUser = (user) => {
        if (confirm('Är du säker på att du vill ta bort denna användare?')) {
            router.delete(route('admin.users.destroy', user.id), {
                onSuccess: () => {
                    // Success message will be shown via toast
                },
            });
        }
    };

    const toggleVerification = (user) => {
        router.patch(route('admin.users.toggle-verification', user.id), {}, {
            preserveState: true,
        });
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'customer': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Admin';
            case 'customer': return 'Kund';
            default: return role;
        }
    };

    const SortButton = ({ column, children }) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort(column)}
            className="h-8 px-2 text-left justify-start font-medium"
        >
            {children}
            {sortBy === column && (
                sortOrder === 'asc' ? <SortAsc className="ml-2 h-4 w-4" /> : <SortDesc className="ml-2 h-4 w-4" />
            )}
        </Button>
    );

    return (
        <AdminLayout>
            <Head title="Användare" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Användare</h1>
                        <p className="text-muted-foreground">
                            Hantera systemanvändare och kunder
                        </p>
                    </div>
                    <Link href={route('admin.users.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Skapa användare
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Filter className="mr-2 h-5 w-5" />
                            Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                    {roles.map(role => (
                                        <SelectItem key={role} value={role}>
                                            {getRoleLabel(role)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedVerified} onValueChange={setSelectedVerified}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Verifierad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Alla</SelectItem>
                                    <SelectItem value="yes">Verifierad</SelectItem>
                                    <SelectItem value="no">Ej verifierad</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedMarketing} onValueChange={setSelectedMarketing}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Marknadsföring" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Alla</SelectItem>
                                    <SelectItem value="yes">Godkänt marknadsföring</SelectItem>
                                    <SelectItem value="no">Ej godkänt marknadsföring</SelectItem>
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
                                        <th className="text-left p-4">
                                            <SortButton column="name">Namn</SortButton>
                                        </th>
                                        <th className="text-left p-4">
                                            <SortButton column="email">E-post</SortButton>
                                        </th>
                                        <th className="text-left p-4">Roll</th>
                                        <th className="text-left p-4">Verifierad</th>
                                        <th className="text-left p-4">Marknadsföring</th>
                                        <th className="text-left p-4">
                                            <SortButton column="created_at">Skapad</SortButton>
                                        </th>
                                        <th className="text-left p-4">Åtgärder</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/25">
                                            <td className="p-4">
                                                <div>
                                                    <div className="font-medium">{user.name}</div>
                                                    {user.phone && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {user.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm">{user.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={getRoleBadgeColor(user.role)}>
                                                    {getRoleLabel(user.role)}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                {user.email_verified_at ? (
                                                    <Badge variant="success">
                                                        <ShieldCheck className="mr-1 h-3 w-3" />
                                                        Verifierad
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">
                                                        <Shield className="mr-1 h-3 w-3" />
                                                        Ej verifierad
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={user.marketing_consent ? "success" : "secondary"}>
                                                    {user.marketing_consent ? 'Ja' : 'Nej'}
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
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.users.show', user.id)}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Visa
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.users.edit', user.id)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Redigera
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={() => toggleVerification(user)}
                                                        >
                                                            {user.email_verified_at ? (
                                                                <>
                                                                    <Shield className="mr-2 h-4 w-4" />
                                                                    Avverifiera
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                                    Verifiera
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={() => deleteUser(user)}
                                                            className="text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Ta bort
                                                        </DropdownMenuItem>
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
        </AdminLayout>
    );
}