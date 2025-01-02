```typescript
import { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { Switch } from '../../shared/ui/Switch';
import { requestNotificationPermission } from '../../../utils/message/notifications';

export function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    Notification.permission === 'granted'
  );

  const handleToggle = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
    } else {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {notificationsEnabled ? (
            <Bell className="h-5 w-5 text-indigo-500" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Desktop Notifications
            </h3>
            <p className="text-sm text-gray-500">
              {notificationsEnabled
                ? 'You will receive notifications for new messages'
                : 'Enable notifications to stay updated'}
            </p>
          </div>
        </div>
        <Switch
          checked={notificationsEnabled}
          onChange={handleToggle}
        />
      </div>
    </div>
  );
}
```