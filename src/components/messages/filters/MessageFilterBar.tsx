import { Filter } from 'lucide-react';
import { Select } from '../../shared/ui/Select';
import { useMessageFilters } from '../../../hooks/messages/useMessageFilters';

export function MessageFilterBar() {
  const { filters, updateStatus, updateDateRange } = useMessageFilters();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Filter className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm text-gray-700">Filter by:</span>
      </div>

      <Select
        value={filters.status}
        onChange={(e) => updateStatus(e.target.value as any)}
        className="w-40"
      >
        <option value="all">All Messages</option>
        <option value="unread">Unread</option>
        <option value="read">Read</option>
      </Select>

      <Select
        value={filters.dateRange}
        onChange={(e) => updateDateRange(e.target.value as any)}
        className="w-40"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </Select>
    </div>
  );
}