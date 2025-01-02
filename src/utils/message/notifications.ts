```typescript
import { supabase } from '../../lib/supabase';
import type { Message } from '../../types/message';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export async function showMessageNotification(message: Message) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const notification = new Notification('New Message', {
    body: `From: ${message.sender?.full_name}\n${message.subject}`,
    icon: '/notification-icon.png',
    tag: message.id,
    data: {
      messageId: message.id,
      url: `/messages/${message.id}`
    }
  });

  notification.onclick = async () => {
    window.focus();
    window.location.href = notification.data.url;
    notification.close();

    // Mark as read when clicked
    await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', message.id);
  };
}

export function setupNotificationHandlers() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('message', async (event) => {
    if (event.data.type === 'SHOW_NOTIFICATION') {
      const message = event.data.message;
      await showMessageNotification(message);
    }
  });
}
```