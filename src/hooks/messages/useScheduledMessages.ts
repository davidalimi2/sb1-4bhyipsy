import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Message } from '../../types/message';

export function useScheduledMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchScheduledMessages = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('scheduled_messages')
          .select(`
            *,
            message:message_id(
              *,
              sender:sender_id(full_name),
              recipient:recipient_id(full_name)
            )
          `)
          .eq('user_id', user.id)
          .order('scheduled_for', { ascending: true });

        if (error) throw error;
        setMessages(data?.map(item => item.message) || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch scheduled messages'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduledMessages();
  }, [addNotification]);

  const scheduleMessage = async (messageId: string, scheduledFor: Date) => {
    try {
      const { error } = await supabase
        .from('scheduled_messages')
        .insert({
          message_id: messageId,
          scheduled_for: scheduledFor.toISOString()
        });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Message scheduled',
        message: 'Message has been scheduled successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to schedule message'
      });
      throw error;
    }
  };

  const cancelScheduledMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_messages')
        .delete()
        .eq('message_id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));

      addNotification({
        type: 'success',
        title: 'Schedule cancelled',
        message: 'Message schedule has been cancelled'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to cancel scheduled message'
      });
    }
  };

  return {
    scheduledMessages: messages,
    isLoading,
    scheduleMessage,
    cancelScheduledMessage
  };
}