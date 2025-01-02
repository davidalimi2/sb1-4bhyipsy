import { Tag } from 'lucide-react';
import type { MessageLabel } from '../../../types/message';

interface LabelItemProps {
  label: MessageLabel;
  isActive: boolean;
  onSelect?: () => void;
}

export function LabelItem({ label, isActive, onSelect }: LabelItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
        ${isActive
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      <Tag
        className="h-4 w-4 mr-2"
        style={{ color: label.color }}
      />
      <span>{label.name}</span>
    </button>
  );
}