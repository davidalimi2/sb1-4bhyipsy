import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Contact, NewContactData } from '../../types/contact';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .order('full_name');

        if (error) throw error;
        setContacts(data || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch contacts'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [addNotification]);

  const createContact = async (data: NewContactData) => {
    try {
      const { data: contact, error } = await supabase
        .from('contacts')
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      setContacts(prev => [...prev, contact]);
      addNotification({
        type: 'success',
        title: 'Contact created',
        message: 'Contact has been created successfully'
      });

      return contact;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create contact'
      });
      throw error;
    }
  };

  const updateContact = async (id: string, data: Partial<Contact>) => {
    try {
      const { data: contact, error } = await supabase
        .from('contacts')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setContacts(prev => prev.map(c => c.id === id ? contact : c));
      addNotification({
        type: 'success',
        title: 'Contact updated',
        message: 'Contact has been updated successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update contact'
      });
      throw error;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContacts(prev => prev.filter(c => c.id !== id));
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
    contacts,
    isLoading,
    createContact,
    updateContact,
    deleteContact
  };
}