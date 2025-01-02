```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Lawyer } from '../../types/lawyer';

export function useLawyer(lawyerId?: string) {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        setIsLoading(true);
        
        // If no lawyerId provided, get current user's lawyer profile
        const { data: { user } } = await supabase.auth.getUser();
        const id = lawyerId || user?.id;

        if (!id) return;

        const { data: lawyerData, error: lawyerError } = await supabase
          .from('lawyers')
          .select(`
            *,
            education:lawyer_education(*),
            certifications:lawyer_certifications(*)
          `)
          .eq('id', id)
          .single();

        if (lawyerError) throw lawyerError;
        setLawyer(lawyerData);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch lawyer details'
        });
        setLawyer(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLawyer();
    }
  }, [lawyerId, addNotification]);

  return { lawyer, isLoading };
}
```