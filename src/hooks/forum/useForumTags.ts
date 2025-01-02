import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { ForumTag } from '../../types/forum';

export function useForumTags() {
  const [tags, setTags] = useState<ForumTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data, error } = await supabase
          .from('forum_tags')
          .select('*')
          .order('name');

        if (error) throw error;
        setTags(data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();

    const subscription = supabase
      .channel('forum_tags')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_tags' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTags(prev => [...prev, payload.new as ForumTag].sort((a, b) => a.name.localeCompare(b.name)));
          } else if (payload.eventType === 'DELETE') {
            setTags(prev => prev.filter(tag => tag.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createTag = async (name: string, description?: string) => {
    try {
      const { error } = await supabase
        .from('forum_tags')
        .insert({ name, description });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Tag Created',
        message: `Tag "${name}" has been created successfully`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create tag'
      });
      throw error;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('forum_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Tag Deleted',
        message: 'Tag has been deleted successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete tag'
      });
      throw error;
    }
  };

  return {
    tags,
    isLoading,
    createTag,
    deleteTag
  };
}