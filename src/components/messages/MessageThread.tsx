import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMessages } from '../../hooks/messages/useMessages';
import { useAuthContext } from '../../contexts/AuthContext';
import { Avatar } from '../shared/ui/Avatar';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { MessageInput } from './MessageInput';
import { AttachmentList } from './attachments/AttachmentList';
import { formatDateTime } from '../../utils/date';

export function MessageThread() {
  const { id: conversationId } = useParams();
  const { messages, isLoading, sendMessage } = useMessages(conversationId);
  const { user } = useAuthContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage);
    setNewMessage('');
  };
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start max-w-[70%] space-x-2">
              {message.sender_id !== user?.id && (
                <Avatar name={message.sender?.full_name || ''} size="sm" />
              )}
              <div>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.sender_id === user?.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.attachments?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-opacity-20">
                      <AttachmentList attachments={message.attachments} />
                    </div>
                  )}
                  <div className="mt-2">
                    <MessageReactions messageId={message.id} />
                  </div>
                </div>
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <span>{formatDateTime(message.created_at)}</span>
                  {message.read && message.sender_id === user?.id && (
                    <span className="ml-2">✓</span>
                  )}
                </div>
                <div className="mt-2">
                  <MessageReactions messageId={message.id} />
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            icon={<Send className="h-4 w-4" />}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}