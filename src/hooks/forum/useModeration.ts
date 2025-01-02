import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { ForumModerationAction } from '../../types/forum';

interface ModeratePostOptions {
  postId: string;
  action: ForumModerationAction['action_type'];
  reason: string;
}

export function useModeration() {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const moderatePost = async ({ postId, action, reason }: ModeratePostOptions) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create moderation action record
      const { error: moderationError } = await supabase
        .from('forum_moderation_actions')
        .insert({
          post_id: postId,
          action_type: action,
          reason,
          moderator_id: user.id
        });

      if (moderationError) throw moderationError;

      // Update post based on action
      if (action === 'pin' || action === 'lock') {
        const { error: updateError } = await supabase
          .from('forum_posts')
          .update({
            [action === 'pin' ? 'is_pinned' : 'is_locked']: true
          })
          .eq('id', postId);

        if (updateError) throw updateError;
      }

      addNotification({
        type: 'success',
        title: 'Moderation Action',
        message: 'Moderation action applied successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to moderate post'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    moderatePost,
    isLoading
  };
}