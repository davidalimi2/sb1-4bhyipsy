import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Message, ThreadNode } from '../../types/message';

export function useMessageThread(messageId: string) {
  const [thread, setThread] = useState<ThreadNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setIsLoading(true);
        
        // Get all messages in thread
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id(full_name)
          `)
          .or(`id.eq.${messageId},thread_id.eq.${messageId}`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        // Build thread tree
        const messageMap = new Map<string, ThreadNode>();
        const rootNodes: ThreadNode[] = [];

        // First pass: create nodes
        data.forEach(message => {
          messageMap.set(message.id, {
            message,
            children: [],
            level: 0
          });
        });

        // Second pass: build tree
        data.forEach(message => {
          const node = messageMap.get(message.id)!;
          if (message.parent_id && messageMap.has(message.parent_id)) {
            const parent = messageMap.get(message.parent_id)!;
            parent.children.push(node);
            node.level = parent.level + 1;
          } else {
            rootNodes.push(node);
          }
        });

        setThread(rootNodes);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to load message thread'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchThread();

    // Subscribe to thread changes
    const subscription = supabase
      .channel(`thread-${messageId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages', filter: `thread_id=eq.${messageId}` },
        () => {
          fetchThread();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [messageId, addNotification]);

  return { thread, isLoading };
}