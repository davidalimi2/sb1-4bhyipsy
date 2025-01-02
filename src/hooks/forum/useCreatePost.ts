import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { ForumCategory } from '../../types/forum';

interface CreatePostData {
  title: string;
  content: string;
  category: ForumCategory;
  tags: string[];
}

export function useCreatePost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const createPost = async (data: CreatePostData) => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: post, error } = await supabase
        .from('forum_posts')
        .insert({
          title: data.title,
          content: data.content,
          category: data.category,
          author_id: user.id,
          tags: data.tags
        })
        .select()
        .single();

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Post Created',
        message: 'Your post has been created successfully'
      });

      navigate(`/community/posts/${post.id}`);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create post'
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createPost,
    isSubmitting
  };
}