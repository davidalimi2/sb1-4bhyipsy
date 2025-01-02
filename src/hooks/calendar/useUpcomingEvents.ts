import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { CalendarEvent } from '../../types/calendar';

export function useUpcomingEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setIsLoading(true);

        // Get next 30 days of events
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            due_date,
            priority,
            type,
            description,
            case_id
          `)
          .gte('due_date', today.toISOString())
          .lte('due_date', thirtyDaysFromNow.toISOString())
          .order('due_date', { ascending: true });

        if (tasksError) throw tasksError;

        // Convert tasks to calendar events
        const calendarEvents = tasks.map(task => ({
          id: task.id,
          title: task.title,
          date: task.due_date,
          type: task.type || 'deadline',
          priority: task.priority,
          caseId: task.case_id,
          description: task.description
        }));

        setEvents(calendarEvents);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch upcoming events'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingEvents();

    // Subscribe to task changes
    const subscription = supabase
      .channel('upcoming-events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          fetchUpcomingEvents();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [addNotification]);

  return { events, isLoading };
}