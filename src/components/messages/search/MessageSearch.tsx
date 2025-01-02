```typescript
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { useMessageStore } from '../../../stores/messageStore';
import { useDebounce } from '../../../hooks/ui/useDebounce';

export function MessageSearch() {
  const { filters, setFilters } = useMessageStore();
  const debouncedSetSearch = useDebounce(
    (search: string) => setFilters({ search }),
    300
  );

  return (
    <Input
      placeholder="Search messages..."
      value={filters.search}
      onChange={(e) => {
        setFilters({ search: e.target.value });
        debouncedSetSearch(e.target.value);
      }}
      icon={<Search className="h-5 w-5 text-gray-400" />}
    />
  );
}
```