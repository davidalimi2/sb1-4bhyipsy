import { VirtualizedMessageList } from './VirtualizedMessageList';
import type { Message } from '../../../types/message';

interface MessageListContentProps {
  messages: Message[];
  isLoading: boolean;
  error?: string | null;
}

export function MessageListContent({ messages, isLoading, error }: MessageListContentProps) {
  return (
    <VirtualizedMessageList
      messages={messages}
      isLoading={isLoading}
      error={error}
    />
  );
}