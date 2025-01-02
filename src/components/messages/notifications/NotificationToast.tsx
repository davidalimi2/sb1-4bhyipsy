```typescript
import { X } from 'lucide-react';
import { formatDateTime } from '../../../utils/date';
import type { Message } from '../../../types/message';

interface NotificationToastProps {
  message: Message;
  onClose: () => void;
  onClick: () => void;
}

export function NotificationToast({ message, onClose, onClick }: NotificationToastProps) {
  return (
    <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {message.sender?.full_name}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {message.subject}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {formatDateTime(message.created_at)}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={onClick}
            className="w-full bg-indigo-600 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Message
          </button>
        </div>
      </div>
    </div>
  );
}
```