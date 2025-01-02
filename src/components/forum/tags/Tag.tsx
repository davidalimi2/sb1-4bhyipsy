import React from 'react';
import { X } from 'lucide-react';
import type { ForumTag } from '../../../types/forum';

interface TagProps {
  tag: ForumTag;
  isSelected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

export function Tag({ tag, isSelected, onClick, onRemove }: TagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium
        ${isSelected
          ? 'bg-indigo-100 text-indigo-800'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }
      `}
    >
      {tag.name}
      {onRemove && (
        <X
          className="ml-1.5 h-3.5 w-3.5 text-gray-500 hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
}