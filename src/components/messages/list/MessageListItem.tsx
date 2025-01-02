import { Link } from 'react-router-dom';
import { Avatar } from '../../shared/ui/Avatar';
import { MessageListMeta } from './MessageListMeta';
import { MessageListActions } from './MessageListActions';
import { formatDateTime } from '../../../utils/date';
import { useAuthContext } from '../../../contexts/AuthContext';
import type { Message } from '../../../types/message';

interface MessageListItemProps {
  message: Message;
  onRead?: () => void;
}

export function MessageListItem({ message, onRead }: MessageListItemProps) {
  const { user } = useAuthContext();
  if (!user) return null;

  const isRecipient = message.recipient_id === user.id;
  const otherUser = isRecipient ? message.sender : message.recipient;

  return (
    <div 
      className={`
        flex items-start justify-between p-4 hover:bg-gray-50
        ${!message.read && isRecipient ? 'bg-blue-50' : ''}
      `}
    >
      <Link
        to={`/messages/${message.id}`}
        onClick={onRead}
        className="flex-1 min-w-0 flex items-start space-x-3"
      >
        <Avatar name={otherUser?.full_name || ''} size="md" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {otherUser?.full_name}
            </h3>
            <span className="text-sm text-gray-500">
              {formatDateTime(message.created_at)}
            </span>
          </div>

          <p className="text-sm font-medium text-gray-900 mt-1 truncate">
            {message.subject}
          </p>
          
          <MessageListMeta message={message} isRecipient={isRecipient} />
        </div>
      </Link>

      <MessageListActions 
        message={message}
        onActionComplete={onRead}
      />
    </div>
  );
}