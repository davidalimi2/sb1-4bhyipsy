import { MessageThreadItem } from './MessageThreadItem';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { useMessageThread } from '../../../hooks/messages/useMessageThread';
import type { Message } from '../../../types/message';

interface MessageThreadProps {
  messageId: string;
  onReply?: (message: Message) => void;
}

export function MessageThread({ messageId, onReply }: MessageThreadProps) {
  const { thread, isLoading } = useMessageThread(messageId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!thread.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        Message not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {thread.map((message) => (
        <MessageThreadItem
          key={message.id}
          message={message}
          onReply={() => onReply?.(message)}
        />
      ))}
    </div>
  );
}