import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '../ui/useDebounce';
import { supabase } from '../../lib/supabase';
import type { ForumPost, ForumCategory } from '../../types/forum';

interface SearchFilters {
  category?: ForumCategory;
  tags?: string[];
  status?: 'open' | 'closed';
  sortBy?: 'recent' | 'popular' | 'unanswered';
  timeframe?: 'day' | 'week' | 'month' | 'all';
}

export function useForumSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  const search = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('forum_posts')
        .select(`
          *,
          author:author_id(full_name),
          tags:forum_post_tags(tag_id(name)),
          replies_count:forum_replies(count)
        `);

      // Apply text search
      if (debouncedQuery) {
        query = query.or(`title.ilike.%${debouncedQuery}%,content.ilike.%${debouncedQuery}%`);
      }

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.tags?.length) {
        query = query.contains('tags', filters.tags);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'popular':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'unanswered':
          query = query.eq('replies_count', 0);
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply timeframe filter
      if (filters.timeframe && filters.timeframe !== 'all') {
        const now = new Date();
        let startDate = new Date();

        switch (filters.timeframe) {
          case 'day':
            startDate.setDate(now.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        }

        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error: searchError } = await query;

      if (searchError) throw searchError;
      setResults(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search posts');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery, filters]);

  useEffect(() => {
    search();
  }, [search]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    isLoading,
    error
  };
}