import { Search } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { useMessageSearch } from '../../../hooks/messages/useMessageSearch';

export function MessageSearchInput() {
  const { query, setQuery, isSearching } = useMessageSearch();

  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search messages..."
      icon={<Search className="h-5 w-5 text-gray-400" />}
      disabled={isSearching}
      className="w-full"
    />
  );
}