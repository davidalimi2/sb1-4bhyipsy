import { Archive, Trash2, Tag } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useMessageActions } from '../../../hooks/messages/useMessageActions';

interface SelectionToolbarProps {
  selectedIds: string[];
  onClearSelection: () => void;
}

export function SelectionToolbar({ selectedIds, onClearSelection }: SelectionToolbarProps) {
  const { archiveMessages, deleteMessages, isLoading } = useMessageActions();

  const handleArchive = async () => {
    await archiveMessages(selectedIds);
    onClearSelection();
  };

  const handleDelete = async () => {
    await deleteMessages(selectedIds);
    onClearSelection();
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {selectedIds.length} selected
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Archive className="h-4 w-4" />}
            onClick={handleArchive}
            disabled={isLoading}
          >
            Archive
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Tag className="h-4 w-4" />}
            onClick={() => {/* TODO: Implement labeling */}}
            disabled={isLoading}
          >
            Label
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>

        <button
          onClick={onClearSelection}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}