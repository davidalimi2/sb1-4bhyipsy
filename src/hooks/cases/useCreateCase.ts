import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { NewCaseData } from '../../types/case';

export function useCreateCase() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const createCase = async (data: NewCaseData) => {
    try {
      setIsSubmitting(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      // Create the case
      const { data: newCase, error: caseError } = await supabase
        .from('cases')
        .insert({
          ...data,
          client_id: user.id,
          status: 'open'
        })
        .select()
        .single();

      if (caseError) throw caseError;

      addNotification({
        type: 'success',
        title: 'Case created',
        message: 'Your case has been created successfully'
      });

      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create case'
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createCase,
    isSubmitting
  };
}