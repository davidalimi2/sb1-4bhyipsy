```typescript
import { Bell } from 'lucide-react';
import { useMessageStore } from '../../../stores/messageStore';

export function NotificationBadge() {
  const unreadCount = useMessageStore(state => state.unreadCount);

  if (unreadCount === 0) return null;

  return (
    <div className="relative">
      <Bell className="h-5 w-5 text-gray-500" />
      <span className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </div>
  );
}
```