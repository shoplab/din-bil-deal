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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Mail,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    ArrowLeft,
    Settings,
    Power,
    PowerOff,
} from 'lucide-react';
import { useState } from 'react';

export default function TemplatesSettings({ templates }) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewContent, setPreviewContent] = useState({ subject: '', body: '' });

    const handleDelete = (template) => {
        setSelectedTemplate(template);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.settings.templates.destroy', selectedTemplate.id), {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedTemplate(null);
            },
        });
    };

    const toggleActive = (template) => {
        router.patch(route('admin.settings.templates.toggle-active', template.id));
    };

    const handlePreview = async (template) => {
        setSelectedTemplate(template);
        try {
            const response = await fetch(route('admin.settings.templates.preview', template.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            });
            const data = await response.json();
            setPreviewContent(data);
            setIsPreviewOpen(true);
        } catch (error) {
            console.error('Preview failed:', error);
        }
    };

    const getTemplateIcon = (slug) => {
        const icons = {
            welcome: '👋',
            password_reset: '🔑',
            email_verification: '✉️',
            lead_created: '📥',
            lead_assigned: '👤',
            deal_created: '🤝',
            deal_won: '🎉',
            appointment_confirmation: '📅',
            appointment_reminder: '⏰',
        };
        return icons[slug] || '📧';
    };

    return (
        <AdminLayout>
            <Head title="E-postmallar" />

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
                            <h1 className="text-3xl font-bold tracking-tight">E-postmallar</h1>
                            <p className="text-muted-foreground">Anpassa systemets automatiska e-postmeddelanden</p>
                        </div>
                    </div>
                    <Link href={route('admin.settings.templates.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Skapa mall
                        </Button>
                    </Link>
                </div>

                {/* Templates Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <Card key={template.id} className={!template.is_active ? 'opacity-60' : ''}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{getTemplateIcon(template.slug)}</div>
                                        <div>
                                            <CardTitle className="text-lg">{template.name}</CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant={template.is_active ? 'default' : 'secondary'}>
                                                    {template.is_active ? 'Aktiv' : 'Inaktiv'}
                                                </Badge>
                                                {template.is_system && (
                                                    <Badge variant="outline">
                                                        <Settings className="mr-1 h-3 w-3" />
                                                        System
                                                    </Badge>
                                                )}
                                            </div>
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
                                            <DropdownMenuItem onClick={() => handlePreview(template)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Förhandsgranska
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={route('admin.settings.templates.edit', template.id)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Redigera
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => toggleActive(template)}>
                                                {template.is_active ? (
                                                    <>
                                                        <PowerOff className="mr-2 h-4 w-4" />
                                                        Inaktivera
                                                    </>
                                                ) : (
                                                    <>
                                                        <Power className="mr-2 h-4 w-4" />
                                                        Aktivera
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            {!template.is_system && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(template)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Ta bort
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardDescription className="mt-2">{template.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm">
                                    <div className="text-muted-foreground mb-1">Ämne:</div>
                                    <div className="font-mono text-xs bg-muted p-2 rounded truncate">
                                        {template.subject}
                                    </div>
                                </div>
                                {template.variables && template.variables.length > 0 && (
                                    <div className="mt-3">
                                        <div className="text-xs text-muted-foreground mb-1">Variabler:</div>
                                        <div className="flex flex-wrap gap-1">
                                            {template.variables.slice(0, 5).map((variable) => (
                                                <Badge key={variable} variant="outline" className="text-xs font-mono">
                                                    {`{{${variable}}}`}
                                                </Badge>
                                            ))}
                                            {template.variables.length > 5 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{template.variables.length - 5}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Om e-postmallar</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>
                            E-postmallar används för automatiska meddelanden som skickas från systemet. Du kan anpassa
                            ämne och innehåll men inte ta bort systemmallar.
                        </p>
                        <p>
                            <strong>Variabler</strong> skrivs som {'{{variabelnamn}}'} och ersätts automatiskt med
                            aktuell data när e-posten skickas.
                        </p>
                        <p>
                            <strong>Inaktiverade mallar</strong> kommer inte att skickas. Var försiktig med att
                            inaktivera viktiga systemmeddelanden som lösenordsåterställning.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ta bort e-postmall?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Är du säker på att du vill ta bort mallen "{selectedTemplate?.name}"? Denna åtgärd kan inte
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

            {/* Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Förhandsgranska: {selectedTemplate?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Så här ser e-posten ut med exempeldata
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Ämne:</div>
                            <div className="p-3 bg-muted rounded-lg font-medium">{previewContent.subject}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">Innehåll:</div>
                            <div
                                className="p-4 border rounded-lg prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: previewContent.body }}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
