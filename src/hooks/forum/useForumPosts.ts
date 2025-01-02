import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { ForumPost, ForumCategory } from '../../types/forum';

interface UseForumPostsOptions {
  category?: ForumCategory;
  tag?: string;
  searchQuery?: string;
  limit?: number;
}

export function useForumPosts({ 
  category,
  tag,
  searchQuery,
  limit = 10 
}: UseForumPostsOptions = {}) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('forum_posts')
          .select(`
            *,
            author:author_id(full_name),
            tags:forum_post_tags(tag_id(name))
          `)
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(limit);

        if (category) {
          query = query.eq('category', category);
        }

        if (tag) {
          query = query.contains('tags', [tag]);
        }

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setPosts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [category, tag, searchQuery, limit]);

  return { posts, isLoading, error };
}