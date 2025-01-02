import { X } from 'lucide-react';

interface ComposeHeaderProps {
  title: string;
  onClose: () => void;
}

export function ComposeHeader({ title, onClose }: ComposeHeaderProps) {
  return (
    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-500"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}