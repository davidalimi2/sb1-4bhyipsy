```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Message } from '../../types/message';

export function useMessage(messageId: string) {
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id(full_name),
            recipient:recipient_id(full_name),
            attachments:message_attachments(*)
          `)
          .eq('id', messageId)
          .single();

        if (error) throw error;
        
        // Mark message as read if recipient is current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user && data.recipient_id === user.id && !data.read) {
          await supabase
            .from('messages')
            .update({ read: true })
            .eq('id', messageId);
        }

        setMessage(data);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch message'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [messageId, addNotification]);

  return { message, isLoading };
}
```