import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Contact } from '../../types/contact';

interface AssignContactData {
  contactId: string;
  role: string;
  notes?: string;
}

export function useCaseContactAssignment(caseId: string) {
  const [isAssigning, setIsAssigning] = useState(false);
  const { addNotification } = useNotifications();

  const assignContact = async ({ contactId, role, notes }: AssignContactData) => {
    try {
      setIsAssigning(true);

      const { error } = await supabase
        .from('case_contacts')
        .insert({
          case_id: caseId,
          contact_id: contactId,
          role,
          notes
        });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Contact assigned',
        message: 'Contact has been assigned to the case'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to assign contact'
      });
      throw error;
    } finally {
      setIsAssigning(false);
    }
  };

  const unassignContact = async (contactId: string) => {
    try {
      setIsAssigning(true);

      const { error } = await supabase
        .from('case_contacts')
        .delete()
        .match({ case_id: caseId, contact_id: contactId });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Contact unassigned',
        message: 'Contact has been removed from the case'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to unassign contact'
      });
      throw error;
    } finally {
      setIsAssigning(false);
    }
  };

  return {
    assignContact,
    unassignContact,
    isAssigning
  };
}