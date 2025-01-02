```typescript
import React from 'react';
import { Avatar } from '../../shared/ui/Avatar';
import { MessageContent } from './MessageContent';
import { MessageInput } from './MessageInput';
import { formatDateTime } from '../../../utils/date';
import type { Message } from '../../../types/message';

interface MessageThreadProps {
  messages: Message[];
  recipientName: string;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export function MessageThread({ messages, recipientName, onSendMessage, isLoading }: MessageThreadProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center">
          <Avatar name={recipientName} size="md" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">{recipientName}</h3>
            <p className="text-xs text-gray-500">
              {messages.length > 0 ? 'Active now' : 'Start a conversation'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === 'currentUser' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender_id === 'currentUser'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <MessageContent content={message.content} />
              <div className="mt-1 text-xs opacity-70">
                {formatDateTime(message.created_at)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t">
        <MessageInput onSend={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
```