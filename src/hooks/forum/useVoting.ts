import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface UseVotingOptions {
  onVoteChange?: (newVoteCount: number) => void;
}

export function useVoting({ onVoteChange }: UseVotingOptions = {}) {
  const [isVoting, setIsVoting] = useState(false);
  const { addNotification } = useNotifications();

  const vote = async (
    type: 'post' | 'reply',
    id: string,
    voteType: 'upvote' | 'downvote'
  ) => {
    try {
      setIsVoting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const table = type === 'post' ? 'forum_post_votes' : 'forum_reply_votes';
      const idField = type === 'post' ? 'post_id' : 'reply_id';

      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from(table)
        .select('id, vote_type')
        .eq(idField, id)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Remove vote if clicking same type
        if (existingVote.vote_type === voteType) {
          const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', existingVote.id);

          if (error) throw error;
        } else {
          // Change vote type
          const { error } = await supabase
            .from(table)
            .update({ vote_type: voteType })
            .eq('id', existingVote.id);

          if (error) throw error;
        }
      } else {
        // Create new vote
        const { error } = await supabase
          .from(table)
          .insert({
            [idField]: id,
            user_id: user.id,
            vote_type: voteType
          });

        if (error) throw error;
      }

      // Get updated vote count
      const { data: updated } = await supabase
        .from(type === 'post' ? 'forum_posts' : 'forum_replies')
        .select('upvotes, downvotes')
        .eq('id', id)
        .single();

      if (updated) {
        onVoteChange?.(updated.upvotes - updated.downvotes);
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to vote'
      });
    } finally {
      setIsVoting(false);
    }
  };

  return {
    vote,
    isVoting
  };
}