import { Filter } from 'lucide-react';
import { Select } from '../../shared/ui/Select';
import { useMessageFilters } from '../../../hooks/messages/useMessageFilters';

export function MessageFilters() {
  const { filters, updateStatus } = useMessageFilters();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Filter className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm text-gray-700">Status:</span>
      </div>

      <Select
        value={filters.status}
        onChange={(e) => updateStatus(e.target.value as any)}
        className="w-40"
      >
        <option value="unread">Unread</option>
        <option value="read">Read</option>
        <option value="archived">Archived</option>
      </Select>
    </div>
  );
}