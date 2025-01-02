```typescript
import { X } from 'lucide-react';
import type { MessageFilters } from '../../../types/message';

interface ActiveFiltersProps {
  filters: MessageFilters;
  onRemove: (key: keyof MessageFilters, value: any) => void;
}

export function ActiveFilters({ filters, onRemove }: ActiveFiltersProps) {
  const activeFilters = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    if (key === 'status' && value === 'all') return false;
    if (key === 'dateRange' && value === 'all') return false;
    return value !== undefined && value !== '';
  });

  if (activeFilters.length === 0) return null;

  return (
    <div className="px-4 py-3 border-t border-gray-200">
      <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
        Active Filters
      </h4>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map(([key, value]) => (
          <span
            key={key}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100"
          >
            {key}: {value.toString()}
            <button
              onClick={() => onRemove(key as keyof MessageFilters, undefined)}
              className="ml-1 text-gray-400 hover:text-gray-500"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
```