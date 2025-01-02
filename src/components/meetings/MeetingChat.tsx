```typescript
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Avatar } from '../shared/ui/Avatar';
import { Button } from '../shared/ui/Button';
import { useMeetingChat } from '../../hooks/meetings/useMeetingChat';
import { formatDateTime } from '../../utils/date';

interface MeetingChatProps {
  meetingId: string;
}

export function MeetingChat({ meetingId }: MeetingChatProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage } = useMeetingChat(meetingId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start space-x-3">
            <Avatar name={msg.sender.full_name} size="sm" />
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-medium text-sm">{msg.sender.full_name}</span>
                <span className="text-xs text-gray-500">
                  {formatDateTime(msg.created_at)}
                </span>
              </div>
              <p className="text-sm text-gray-900 mt-1">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <Button
            type="submit"
            disabled={!message.trim()}
            icon={<Send className="h-4 w-4" />}
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
```