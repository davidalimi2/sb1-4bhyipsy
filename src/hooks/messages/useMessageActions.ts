import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

export function useMessageActions() {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const archiveMessage = async (messageId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('messages')
        .update({ archived: true })
        .eq('id', messageId);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Message archived',
        message: 'Message moved to archive'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to archive message'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Message deleted',
        message: 'Message deleted successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete message'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    archiveMessage,
    deleteMessage,
    isLoading
  };
}