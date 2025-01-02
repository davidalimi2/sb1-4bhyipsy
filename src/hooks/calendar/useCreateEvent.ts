import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { EventType, EventPriority } from '../../types/calendar';

interface CreateEventData {
  title: string;
  date: string;
  type: EventType;
  priority: EventPriority;
  description?: string;
  location?: string;
  caseId?: string;
}

export function useCreateEvent() {
  const [isCreating, setIsCreating] = useState(false);
  const { addNotification } = useNotifications();

  const createEvent = async (data: CreateEventData) => {
    try {
      setIsCreating(true);

      // Create task record
      const { error } = await supabase
        .from('tasks')
        .insert({
          title: data.title,
          due_date: data.date,
          type: data.type,
          priority: data.priority,
          description: data.description,
          location: data.location,
          case_id: data.caseId,
          status: 'pending'
        });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Event created',
        message: 'Calendar event has been created successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create event'
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createEvent,
    isCreating
  };
}