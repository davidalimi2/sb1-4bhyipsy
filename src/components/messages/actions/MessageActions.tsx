import { Reply, Archive, Trash2 } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useMessageActions } from '../../../hooks/messages/useMessageActions';
import type { Message } from '../../../types/message';

interface MessageActionsProps {
  message: Message;
  onReply?: () => void;
}

export function MessageActions({ message, onReply }: MessageActionsProps) {
  const { archiveMessage, deleteMessage, isLoading } = useMessageActions();

  return (
    <div className="flex items-center space-x-2">
      {onReply && (
        <Button
          variant="secondary"
          size="sm"
          icon={<Reply className="h-4 w-4" />}
          onClick={onReply}
          disabled={isLoading}
        >
          Reply
        </Button>
      )}

      <Button
        variant="secondary"
        size="sm"
        icon={<Archive className="h-4 w-4" />}
        onClick={() => archiveMessage(message.id)}
        disabled={isLoading}
        title="Archive message"
      />

      <Button
        variant="secondary"
        size="sm"
        icon={<Trash2 className="h-4 w-4" />}
        onClick={() => deleteMessage(message.id)}
        disabled={isLoading}
        title="Delete message"
      />
    </div>
  );
}