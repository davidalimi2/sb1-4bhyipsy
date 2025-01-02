import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ForumPost } from '../../types/forum';

export function useUserPosts(userId: string) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('forum_posts')
          .select(`
            *,
            author:author_id(full_name),
            tags:forum_post_tags(tag_id(name))
          `)
          .eq('author_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  return { posts, isLoading };
}