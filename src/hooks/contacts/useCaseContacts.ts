import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { CaseContact } from '../../types/contact';

export function useCaseContacts(caseId: string) {
  const [contacts, setContacts] = useState<CaseContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!caseId) return;
    
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('case_contacts')
          .select(`
            case_id,
            contact_id,
            role,
            notes,
            created_at,
            contact:contacts(*)
          `)
          .eq('case_id', caseId);

        if (error) throw error;
        setContacts(data || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch case contacts'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [caseId, addNotification]);

  const removeContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('case_contacts')
        .delete()
        .match({ case_id: caseId, contact_id: contactId });

      if (error) throw error;

      setContacts(prev => prev.filter(c => c.contact_id !== contactId));
      addNotification({
        type: 'success',
        title: 'Contact removed',
        message: 'Contact has been removed from the case'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to remove contact'
      });
    }
  };

  return {
    contacts,
    isLoading,
    removeContact
  };
}