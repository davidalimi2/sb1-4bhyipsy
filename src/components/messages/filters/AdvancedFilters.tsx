```typescript
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { FilterGroup } from './FilterGroup';
import { ActiveFilters } from './ActiveFilters';
import { useMessageFilters } from '../../../hooks/messages/useMessageFilters';
import type { MessageFilters } from '../../../types/message';

export function AdvancedFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, updateFilters, resetFilters } = useMessageFilters();

  const handleFilterChange = (key: keyof MessageFilters, value: any) => {
    updateFilters({ [key]: value });
  };

  const handleReset = () => {
    resetFilters();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        icon={<Filter className="h-4 w-4" />}
      >
        Filters
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-10">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Filter Messages</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <FilterGroup
                label="Status"
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'unread', label: 'Unread' },
                  { value: 'read', label: 'Read' },
                  { value: 'archived', label: 'Archived' }
                ]}
              />

              <FilterGroup
                label="Date Range"
                value={filters.dateRange}
                onChange={(value) => handleFilterChange('dateRange', value)}
                options={[
                  { value: 'all', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' }
                ]}
              />

              <FilterGroup
                label="Has Attachments"
                type="boolean"
                value={filters.hasAttachments}
                onChange={(value) => handleFilterChange('hasAttachments', value)}
              />

              <FilterGroup
                label="Priority"
                value={filters.priority}
                onChange={(value) => handleFilterChange('priority', value)}
                options={[
                  { value: 'high', label: 'High' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'low', label: 'Low' }
                ]}
              />

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          <ActiveFilters
            filters={filters}
            onRemove={handleFilterChange}
          />
        </div>
      )}
    </div>
  );
}
```