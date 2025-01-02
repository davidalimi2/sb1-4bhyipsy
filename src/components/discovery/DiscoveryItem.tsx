import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Badge } from '../shared/ui/Badge';
import { getDiscoveryTypeIcon } from '../../utils/discoveryUtils';
import { formatDate } from '../../utils/date';
import type { Discovery } from '../../types/discovery';

interface DiscoveryItemProps {
  item: Discovery;
}

export function DiscoveryItem({ item }: DiscoveryItemProps) {
  const Icon = getDiscoveryTypeIcon(item.type);
  
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Icon className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900">
            {item.type}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{item.description}</div>
        {item.party && (
          <div className="text-sm text-gray-500">To: {item.party}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge
          variant={
            item.status === 'pending' ? 'warning' :
            item.status === 'completed' ? 'success' :
            item.status === 'overdue' ? 'error' :
            'default'
          }
        >
          {item.status}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(item.dueDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-indigo-600 hover:text-indigo-900">
          <MoreVertical className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}