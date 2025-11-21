import { useForm } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CallbackModal({ open, onClose, source }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    phone: '',
    source: source || 'form',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('callback.store'), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Vi ringer upp dig</DialogTitle>
          <DialogDescription>
            Fyll i dina uppgifter så hör vi av oss inom kort
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Namn *</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Ditt namn"
              required
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Telefonnummer *</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              placeholder="070-123 45 67"
              required
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={processing}
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={processing}
            >
              {processing ? 'Skickar...' : 'Boka samtal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
