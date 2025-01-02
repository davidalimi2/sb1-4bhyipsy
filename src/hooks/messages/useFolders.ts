import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { MessageFolder } from '../../types/message';

export function useFolders() {
  const [folders, setFolders] = useState<MessageFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        setIsLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('message_folders')
          .select(`
            *,
            messages:message_folder_assignments(count)
          `)
          .eq('user_id', user.id)
          .order('position');

        if (error) throw error;

        setFolders(data.map(folder => ({
          ...folder,
          count: folder.messages?.[0]?.count || 0
        })));
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch folders'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();
  }, [addNotification]);

  return { folders, isLoading };
}