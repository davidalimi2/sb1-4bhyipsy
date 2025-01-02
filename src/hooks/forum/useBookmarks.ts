import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { ForumPost } from '../../types/forum';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('forum_bookmarks')
          .select(`
            post:post_id(
              *,
              author:author_id(full_name),
              tags:forum_post_tags(tag_id(name))
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBookmarks(data?.map(b => b.post) || []);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const toggleBookmark = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('forum_bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single();

      if (existing) {
        // Remove bookmark
        const { error } = await supabase
          .from('forum_bookmarks')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;

        setBookmarks(prev => prev.filter(b => b.id !== postId));
        addNotification({
          type: 'success',
          title: 'Bookmark removed',
          message: 'Post has been removed from your bookmarks'
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('forum_bookmarks')
          .insert({ user_id: user.id, post_id: postId });

        if (error) throw error;

        const { data: post, error: postError } = await supabase
          .from('forum_posts')
          .select(`
            *,
            author:author_id(full_name),
            tags:forum_post_tags(tag_id(name))
          `)
          .eq('id', postId)
          .single();

        if (postError) throw postError;

        setBookmarks(prev => [post, ...prev]);
        addNotification({
          type: 'success',
          title: 'Bookmark added',
          message: 'Post has been added to your bookmarks'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to toggle bookmark'
      });
    }
  };

  return {
    bookmarks,
    isLoading,
    toggleBookmark
  };
}