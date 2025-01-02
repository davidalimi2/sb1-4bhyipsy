import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ForumPost } from '../../types/forum';

export function usePost(postId: string) {
  const [post, setPost] = useState<ForumPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('forum_posts')
          .select(`
            *,
            author:author_id(full_name),
            tags:forum_post_tags(tag_id(name))
          `)
          .eq('id', postId)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();

    // Subscribe to post changes
    const subscription = supabase
      .channel(`post-${postId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_posts', filter: `id=eq.${postId}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setPost(prev => ({ ...prev, ...payload.new }));
          } else if (payload.eventType === 'DELETE') {
            setPost(null);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [postId]);

  return { post, isLoading };
}