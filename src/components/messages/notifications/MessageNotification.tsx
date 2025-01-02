import { Mail } from 'lucide-react';
import { formatDateTime } from '../../../utils/date';
import type { Message } from '../../../types/message';

interface MessageNotificationProps {
  message: Message;
  onRead: () => void;
}

export function MessageNotification({ message, onRead }: MessageNotificationProps) {
  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Mail className="h-6 w-6 text-indigo-500" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {message.sender?.full_name}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {message.subject}
            </p>
            <div className="mt-2 flex space-x-3">
              <button
                onClick={onRead}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Read message
              </button>
              <span className="text-sm text-gray-500">
                {formatDateTime(message.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}