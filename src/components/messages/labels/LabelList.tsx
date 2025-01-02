import { useMessageLabels } from '../../../hooks/messages/useMessageLabels';
import { LabelItem } from './LabelItem';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';

export function LabelList() {
  const { labels, isLoading } = useMessageLabels();

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {labels.map((label) => (
        <LabelItem
          key={label.id}
          label={label}
          isActive={false} // TODO: Add active state based on current label
        />
      ))}
    </div>
  );
}