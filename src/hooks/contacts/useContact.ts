```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Contact } from '../../types/contact';

export function useContact(contactId: string) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', contactId)
          .single();

        if (error) throw error;
        setContact(data);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch contact'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [contactId, addNotification]);

  const deleteContact = async () => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Contact deleted',
        message: 'Contact has been deleted successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete contact'
      });
      throw error;
    }
  };

  return {
    contact,
    isLoading,
    deleteContact
  };
}