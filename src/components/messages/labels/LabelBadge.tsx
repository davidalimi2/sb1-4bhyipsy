import type { MessageLabel } from '../../../types/message';

interface LabelBadgeProps {
  label: MessageLabel;
  onRemove?: () => void;
}

export function LabelBadge({ label, onRemove }: LabelBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${label.color}20`,
        color: label.color
      }}
    >
      {label.name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:opacity-75"
        >
          ×
        </button>
      )}
    </span>
  );
}