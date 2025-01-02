import { Search } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { useMessageFilters } from '../../../hooks/messages/useMessageFilters';

export function MessageSearchBar() {
  const { filters, updateSearch } = useMessageFilters();

  return (
    <Input
      placeholder="Search messages..."
      value={filters.search}
      onChange={(e) => updateSearch(e.target.value)}
      icon={<Search className="h-5 w-5 text-gray-400" />}
      className="w-full"
    />
  );
}