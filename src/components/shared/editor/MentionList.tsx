import React from 'react';
import { Avatar } from '../ui/Avatar';

interface MentionListProps {
  items: Array<{
    id: string;
    name: string;
  }>;
  command: (item: any) => void;
}

export function MentionList({ items, command }: MentionListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => command(item)}
          className="w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50"
        >
          <Avatar name={item.name} size="sm" />
          <span className="text-sm text-gray-900">{item.name}</span>
        </button>
      ))}
    </div>
  );
}