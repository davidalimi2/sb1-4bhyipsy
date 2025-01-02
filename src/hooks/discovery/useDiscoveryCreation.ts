import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Discovery } from '../../types/discovery';

export function useDiscoveryCreation(caseId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const createDiscovery = async (data: Omit<Discovery, 'id' | 'case_id' | 'status' | 'created_at' | 'updated_at'>) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('discovery')
        .insert({
          ...data,
          case_id: caseId,
          status: 'pending'
        });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Discovery request created',
        message: 'Your discovery request has been created successfully'
      });

      navigate('/cases/' + caseId + '/discovery');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create discovery request'
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createDiscovery,
    isSubmitting
  };
}