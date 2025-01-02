```typescript
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useMessageStore } from '../../stores/messageStore';
import { showMessageNotification, requestNotificationPermission } from '../../utils/message/notifications';
import type { Message } from '../../types/message';

export function useMessageNotifications() {
  const { messages } = useMessageStore();

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) return;

      // Subscribe to new messages
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `recipient_id=eq.${user.id}`
          },
          async (payload) => {
            const message = payload.new as Message;
            if (!message.read) {
              await showMessageNotification(message);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    setupNotifications();
  }, []);

  // Return current notification status
  return {
    notificationsEnabled: Notification.permission === 'granted'
  };
}
```