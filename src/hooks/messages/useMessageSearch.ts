import { useState, useEffect } from 'react';
import { useDebounce } from '../ui/useDebounce';
import { supabase } from '../../lib/supabase';
import type { Message } from '../../types/message';

export function useMessageSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchMessages = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsSearching(true);
        
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id(full_name),
            recipient:recipient_id(full_name),
            attachments:message_attachments(*)
          `)
          .or(`subject.ilike.%${debouncedQuery}%,content.ilike.%${debouncedQuery}%`);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchMessages();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isSearching
  };
}