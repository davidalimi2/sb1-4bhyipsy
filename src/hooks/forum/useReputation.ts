import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { UserReputation, ReputationEvent } from '../../types/forum';

const REPUTATION_POINTS = {
  post_created: 5,
  solution_marked: 15,
  helpful_marked: 10,
  post_liked: 2,
  reply_liked: 1
};

export function useReputation(userId: string) {
  const [reputation, setReputation] = useState<UserReputation | null>(null);
  const [reputationHistory, setReputationHistory] = useState<ReputationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReputation = async () => {
      try {
        setIsLoading(true);

        // Get user reputation
        const { data: repData, error: repError } = await supabase
          .from('user_reputation')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (repError) throw repError;

        // Get reputation history
        const { data: historyData, error: historyError } = await supabase
          .from('reputation_events')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (historyError) throw historyError;

        setReputation(repData);
        setReputationHistory(historyData || []);
      } catch (error) {
        console.error('Error fetching reputation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReputation();

    // Subscribe to reputation changes
    const subscription = supabase
      .channel(`reputation-${userId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_reputation', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setReputation(payload.new as UserReputation);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return {
    reputation,
    reputationHistory,
    isLoading
  };
}