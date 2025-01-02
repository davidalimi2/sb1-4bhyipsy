import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useDebounce } from '../ui/useDebounce';

interface Recipient {
  id: string;
  full_name: string;
  email: string;
}

export function useRecipientSearch(query: string) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchRecipients = async () => {
      if (!debouncedQuery) {
        setRecipients([]);
        return;
      }

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, email')
          .or(`email.ilike.%${debouncedQuery}%,full_name.ilike.%${debouncedQuery}%`)
          .limit(5);

        if (error) throw error;
        setRecipients(data || []);
      } catch (error) {
        console.error('Error searching recipients:', error);
        setRecipients([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchRecipients();
  }, [debouncedQuery]);

  return { recipients, isLoading };
}