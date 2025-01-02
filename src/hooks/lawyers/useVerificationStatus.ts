```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

export function useVerificationStatus(lawyerId: string) {
  const [status, setStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [message, setMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('lawyers')
          .select('verification_status, verification_message')
          .eq('id', lawyerId)
          .single();

        if (error) throw error;

        setStatus(data.verification_status);
        setMessage(data.verification_message);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch verification status'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();

    // Subscribe to status changes
    const subscription = supabase
      .channel(`lawyer-verification-${lawyerId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'lawyers', filter: `id=eq.${lawyerId}` },
        (payload) => {
          setStatus(payload.new.verification_status);
          setMessage(payload.new.verification_message);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [lawyerId, addNotification]);

  return {
    status,
    message,
    isLoading
  };
}
```