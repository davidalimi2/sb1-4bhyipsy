import { Archive, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useMessageActions } from '../../../hooks/messages/useMessageActions';
import type { Message } from '../../../types/message';

interface MessageListActionsProps {
  message: Message;
  onActionComplete?: () => void;
}

export function MessageListActions({ message, onActionComplete }: MessageListActionsProps) {
  const { archiveMessage, deleteMessage, isLoading } = useMessageActions();

  const handleArchive = async () => {
    await archiveMessage(message.id);
    onActionComplete?.();
  };

  const handleDelete = async () => {
    await deleteMessage(message.id);
    onActionComplete?.();
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="secondary"
        size="sm"
        icon={<Archive className="h-4 w-4" />}
        onClick={handleArchive}
        disabled={isLoading}
        title="Archive message"
      />
      <Button
        variant="secondary"
        size="sm"
        icon={<Trash2 className="h-4 w-4" />}
        onClick={handleDelete}
        disabled={isLoading}
        title="Delete message"
      />
      <Button
        variant="secondary"
        size="sm"
        icon={<MoreVertical className="h-4 w-4" />}
        title="More actions"
      />
    </div>
  );
}