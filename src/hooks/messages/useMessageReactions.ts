import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import { useAuthContext } from '../../contexts/AuthContext';

interface Reactions {
  [emoji: string]: string[]; // Array of user IDs who reacted
}

export function useMessageReactions(messageId: string) {
  const [reactions, setReactions] = useState<Reactions>({});
  const { addNotification } = useNotifications();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const { data, error } = await supabase
          .from('message_reactions')
          .select('emoji, user_id')
          .eq('message_id', messageId);

        if (error) throw error;

        // Group reactions by emoji
        const groupedReactions = data.reduce((acc, { emoji, user_id }) => {
          if (!acc[emoji]) acc[emoji] = [];
          acc[emoji].push(user_id);
          return acc;
        }, {} as Reactions);

        setReactions(groupedReactions);
      } catch (error) {
        console.error('Error fetching reactions:', error);
      }
    };

    fetchReactions();

    // Subscribe to reaction changes
    const subscription = supabase
      .channel(`message-reactions-${messageId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'message_reactions', filter: `message_id=eq.${messageId}` },
        () => {
          fetchReactions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [messageId]);

  const addReaction = async (emoji: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: messageId,
          emoji,
          user_id: user.id
        });

      if (error) throw error;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to add reaction'
      });
    }
  };

  const removeReaction = async (emoji: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .match({
          message_id: messageId,
          emoji,
          user_id: user.id
        });

      if (error) throw error;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to remove reaction'
      });
    }
  };

  return {
    reactions,
    addReaction,
    removeReaction
  };
}