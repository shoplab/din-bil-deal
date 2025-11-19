import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Briefcase,
  Users,
  Mountain,
  Building2,
  Car,
  Heart,
  Star,
  Zap
} from 'lucide-react';

const iconMap = {
  Briefcase,
  Users,
  Mountain,
  Building2,
  Car,
  Heart,
  Star,
  Zap,
};

export default function MultiSelectQuestion({ question, value, onChange }) {
  const handleToggle = (optionId) => {
    if (value.includes(optionId)) {
      onChange(value.filter(id => id !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  };

  return (
    <div className="space-y-3">
      {question.options?.map((option) => {
        const Icon = option.icon ? iconMap[option.icon] : null;
        const isSelected = value.includes(String(option.id));

        return (
          <div
            key={option.id}
            onClick={() => handleToggle(String(option.id))}
            className={`
              relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
              ${isSelected
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            {Icon && (
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center mr-4
                ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}
              `}>
                <Icon className="h-6 w-6" />
              </div>
            )}

            <div className="flex-1">
              <Label className="text-base font-medium cursor-pointer">
                {option.label}
              </Label>
              {option.description && (
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              )}
            </div>

            <Checkbox
              checked={isSelected}
              className="ml-4"
              onCheckedChange={() => handleToggle(String(option.id))}
            />
          </div>
        );
      })}
    </div>
  );
}
