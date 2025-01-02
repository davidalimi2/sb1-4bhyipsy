```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock } from 'lucide-react';
import { Avatar } from '../shared/ui/Avatar';
import { formatDateTime } from '../../utils/date';
import { useAuthContext } from '../../contexts/AuthContext';
import type { Message } from '../../types/message';

interface MessageCardProps {
  message: Message;
  onRead: () => void;
}

export function MessageCard({ message, onRead }: MessageCardProps) {
  const { user } = useAuthContext();
  const isRecipient = message.recipient_id === user?.id;
  const otherUser = isRecipient ? message.sender : message.recipient;

  return (
    <Link
      to={`/messages/${message.id}`}
      onClick={onRead}
      className={`
        block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow
        ${!message.read && isRecipient ? 'border-l-4 border-indigo-500' : ''}
      `}
    >
      <div className="flex items-start space-x-4">
        <Avatar name={otherUser?.full_name || ''} size="md" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              {otherUser?.full_name}
            </h3>
            <span className="text-sm text-gray-500">
              {formatDateTime(message.created_at)}
            </span>
          </div>

          <p className="mt-1 text-sm font-medium text-gray-900">
            {message.subject}
          </p>
          
          <p className="mt-1 text-sm text-gray-500 truncate">
            {message.content}
          </p>

          <div className="mt-2 flex items-center text-xs text-gray-500">
            {!message.read && isRecipient && (
              <span className="flex items-center text-indigo-600">
                <Mail className="h-4 w-4 mr-1" />
                New
              </span>
            )}
            {message.parent_id && (
              <span className="flex items-center ml-4">
                <Clock className="h-4 w-4 mr-1" />
                Reply
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
```