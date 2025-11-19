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
import { toast } from 'sonner';

export default function FormsIndex({ forms }) {
  const handleDelete = (id) => {
    if (confirm('Är du säker på att du vill ta bort detta formulär?')) {
      router.delete(route('admin.forms.destroy', id));
    }
  };

  const handleCopyLink = (e, slug) => {
    e.stopPropagation();
    e.preventDefault();

    // Copy just the slug
    const textArea = document.createElement('textarea');
    textArea.value = slug;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      toast.success('Slug kopierad!', {
        description: slug,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Kunde inte kopiera slug');
    }

    document.body.removeChild(textArea);
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
                    <TableRow
                      key={form.id}
                      className="cursor-pointer"
                      onClick={() => router.visit(route('admin.forms.edit', form.id))}
                    >
                      <TableCell className="font-medium">{form.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {form.slug}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleCopyLink(e, form.slug)}
                            className="h-7 w-7 p-0"
                            title="Kopiera länk"
                          >
                            <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </Button>
                        </div>
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
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-8 p-0"
                          >
                            <Link href={route('forms.show', form.slug)}>
                              <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Åtgärder</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(form.id);
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Ta bort
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
