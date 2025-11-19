import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Edit, Trash2, Eye, Copy } from 'lucide-react';

export default function FormsIndex({ forms }) {
  const handleDelete = (id) => {
    if (confirm('Är du säker på att du vill ta bort detta formulär?')) {
      router.delete(route('admin.forms.destroy', id));
    }
  };

  const handleCopyLink = (slug) => {
    const url = route('forms.show', slug);
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    alert('Länk kopierad till urklipp!');
  };

  return (
    <AdminLayout title="Formulär">
      <Head title="Formulär" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Formulär</h1>
            <p className="text-muted-foreground mt-1">
              Hantera multi-step formulär och frågor
            </p>
          </div>
          <Button asChild>
            <Link href={route('admin.forms.create')}>
              <Plus className="h-4 w-4 mr-2" />
              Skapa formulär
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alla formulär</CardTitle>
            <CardDescription>
              {forms.length} {forms.length === 1 ? 'formulär' : 'formulär'} totalt
            </CardDescription>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Inga formulär skapade ännu
                </p>
                <Button asChild>
                  <Link href={route('admin.forms.create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Skapa ditt första formulär
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titel</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Frågor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Skapad</TableHead>
                    <TableHead className="text-right">Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.title}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {form.slug}
                        </code>
                      </TableCell>
                      <TableCell>{form.questions.length} frågor</TableCell>
                      <TableCell>
                        <Badge variant={form.is_active ? 'default' : 'secondary'}>
                          {form.is_active ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(form.created_at).toLocaleDateString('sv-SE')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Åtgärder</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={route('forms.show', form.slug)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Visa formulär
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCopyLink(form.slug)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Kopiera länk
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={route('admin.forms.edit', form.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Redigera
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(form.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Ta bort
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
