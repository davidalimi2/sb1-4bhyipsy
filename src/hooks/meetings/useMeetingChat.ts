```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    full_name: string;
  };
  created_at: string;
}

export function useMeetingChat(meetingId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('meeting_chat_messages')
          .select(`
            *,
            sender:sender_id(id, full_name)
          `)
          .eq('meeting_id', meetingId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`meeting-chat-${meetingId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'meeting_chat_messages', filter: `meeting_id=eq.${meetingId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [meetingId]);

  const sendMessage = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('meeting_chat_messages')
        .insert({
          meeting_id: meetingId,
          sender_id: user.id,
          content
        });

      if (error) throw error;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to send message'
      });
    }
  };

  return {
    messages,
    sendMessage
  };
}
```