```typescript
import { Select } from '../../shared/ui/Select';
import { Switch } from '../../shared/ui/Switch';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroupProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  options?: FilterOption[];
  type?: 'select' | 'boolean';
}

export function FilterGroup({
  label,
  value,
  onChange,
  options = [],
  type = 'select'
}: FilterGroupProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {type === 'select' && options.length > 0 && (
        <Select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      )}

      {type === 'boolean' && (
        <Switch
          checked={value || false}
          onChange={onChange}
          label="Include attachments only"
        />
      )}
    </div>
  );
}
```