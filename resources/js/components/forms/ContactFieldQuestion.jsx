import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ContactFieldQuestion({ question, value, onChange }) {
  const placeholder = {
    text: 'Skriv ditt svar här...',
    email: 'din@email.se',
    phone: '070-123 45 67',
    textarea: 'Skriv ditt svar här...',
  }[question.type] || '';

  const inputType = {
    text: 'text',
    email: 'email',
    phone: 'tel',
    textarea: 'text',
  }[question.type] || 'text';

  return (
    <div className="space-y-3">
      {question.type === 'textarea' ? (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          required={question.is_required}
          className="w-full"
        />
      ) : (
        <Input
          type={inputType}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={question.is_required}
          className="w-full"
        />
      )}
    </div>
  );
}
