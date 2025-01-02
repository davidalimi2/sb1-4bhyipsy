import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ForumReply } from '../../types/forum';

export function usePostReplies(postId: string) {
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        setIsLoading(true);
        
        const { data, error: fetchError } = await supabase
          .from('forum_replies')
          .select(`
            *,
            author:author_id(full_name)
          `)
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;
        setReplies(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch replies');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReplies();

    // Subscribe to new replies
    const subscription = supabase
      .channel(`post-${postId}-replies`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_replies', filter: `post_id=eq.${postId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReplies(prev => [...prev, payload.new as ForumReply]);
          } else if (payload.eventType === 'UPDATE') {
            setReplies(prev => prev.map(reply => 
              reply.id === payload.new.id ? payload.new as ForumReply : reply
            ));
          } else if (payload.eventType === 'DELETE') {
            setReplies(prev => prev.filter(reply => reply.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [postId]);

  const addReply = async (content: string, parentId?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('forum_replies')
      .insert({
        post_id: postId,
        content,
        author_id: user.id,
        parent_id: parentId
      });

    if (error) throw error;
  };

  return {
    replies,
    isLoading,
    error,
    addReply
  };
}