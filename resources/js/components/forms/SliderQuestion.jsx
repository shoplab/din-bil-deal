import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export default function SliderQuestion({ question, value, onChange }) {
  const min = question.config?.min || 0;
  const max = question.config?.max || 100;
  const step = question.config?.step || 1;
  const unit = question.config?.unit || '';
  const defaultValue = question.config?.default || min;

  const formatValue = (val) => {
    if (unit === 'mil' || unit === 'km') {
      return `${val.toLocaleString('sv-SE')} ${unit}`;
    }
    return `${val.toLocaleString('sv-SE')}${unit ? ' ' + unit : ''}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Label className="text-sm text-gray-600">Max körsträcka</Label>
        <div className="text-4xl font-bold text-blue-600 mt-2">
          {formatValue(value)}
        </div>
        <p className="text-sm text-gray-500 mt-2">Dra reglaget för att justera</p>
      </div>

      <div className="px-4">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />

        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
}
