import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check } from 'lucide-react';

export default function ImageSelectQuestion({ question, value, onChange }) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-4">
      {question.options?.map((option) => {
        const isSelected = value === String(option.id);

        return (
          <div
            key={option.id}
            className={`
              relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
              ${isSelected
                ? 'border-blue-600 ring-2 ring-blue-600'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
            onClick={() => onChange(String(option.id))}
          >
            {option.image_url && (
              <div className="aspect-video bg-gray-100">
                <img
                  src={option.image_url}
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium cursor-pointer">
                    {option.label}
                  </Label>
                  {option.description && (
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  )}
                </div>

                {isSelected && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center ml-2">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>

            <RadioGroupItem
              value={String(option.id)}
              className="absolute top-2 right-2 opacity-0"
            />
          </div>
        );
      })}
    </RadioGroup>
  );
}
