import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface Conversation {
  id: string;
  case_id: string;
  otherParty: {
    id: string;
    full_name: string;
  };
  lastMessage?: {
    content: string;
    created_at: string;
  };
  unreadCount: number;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('conversations')
          .select(`
            id,
            case_id,
            cases:case_id (
              client:client_id(id, full_name),
              lawyer:lawyer_id(id, full_name)
            ),
            messages:messages (
              id,
              content,
              created_at,
              read,
              sender_id
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data
        const transformedConversations = data.map(conversation => {
          const isClient = conversation.cases.client.id === user.id;
          const otherParty = isClient ? conversation.cases.lawyer : conversation.cases.client;
          const messages = conversation.messages || [];
          const lastMessage = messages[0];
          const unreadCount = messages.filter(m => !m.read && m.sender_id !== user.id).length;

          return {
            id: conversation.id,
            case_id: conversation.case_id,
            otherParty,
            lastMessage,
            unreadCount
          };
        });

        setConversations(transformedConversations);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to load conversations'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to new messages
    const subscription = supabase
      .channel('conversations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [addNotification]);

  return { conversations, isLoading };
}