import { useMessages } from '../../../hooks/messages/useMessages';
import { MessageListContent } from './MessageListContent';

export function MessageList() {
  const { messages, isLoading, error } = useMessages();

  return (
    <MessageListContent
      messages={messages}
      isLoading={isLoading}
      error={error}
    />
  );
}