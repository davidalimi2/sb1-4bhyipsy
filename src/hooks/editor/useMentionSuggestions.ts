import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

interface User {
  id: string;
  name: string;
}

export function useMentionSuggestions() {
  const [suggestions, setSuggestions] = useState<User[]>([]);

  const getSuggestions = useCallback(async (query: string) => {
    if (!query) return [];

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name')
        .ilike('full_name', `%${query}%`)
        .limit(5);

      if (error) throw error;

      return data.map(user => ({
        id: user.id,
        name: user.full_name
      }));
    } catch (error) {
      console.error('Error fetching mention suggestions:', error);
      return [];
    }
  }, []);

  return {
    suggestions,
    getSuggestions
  };
}