import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { CalendarEvent } from '../../types/calendar';

export function useCalendarEvents(currentDate: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);

        // Get start and end of month
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Fetch tasks with due dates in this month
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            due_date,
            priority,
            type,
            description,
            case_id,
            cases:case_id(title)
          `)
          .gte('due_date', startOfMonth.toISOString())
          .lte('due_date', endOfMonth.toISOString());

        if (tasksError) throw tasksError;

        // Convert tasks to calendar events
        const calendarEvents = tasks.map(task => ({
          id: task.id,
          title: task.title,
          date: task.due_date,
          type: task.type || 'deadline',
          priority: task.priority,
          caseId: task.case_id,
          caseName: task.cases?.title,
          description: task.description
        }));

        setEvents(calendarEvents);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch calendar events'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();

    // Subscribe to task changes
    const subscription = supabase
      .channel('calendar-events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentDate, addNotification]);

  return { events, isLoading };
}