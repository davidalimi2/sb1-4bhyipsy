import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNotifications } from './useNotifications';

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  type: 'deadline' | 'hearing' | 'filing';
  caseId: string;
  caseName: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('tasks')
          .select(`
            *,
            case:case_id (
              title
            )
          `)
          .eq('status', 'pending')
          .order('due_date', { ascending: true });

        if (fetchError) throw fetchError;

        setTasks(
          data?.map(task => ({
            id: task.id,
            title: task.title,
            dueDate: new Date(task.due_date),
            priority: task.priority,
            type: task.type,
            caseId: task.case_id,
            caseName: task.case?.title || 'Unknown Case'
          })) || []
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
        setError(message);
        addNotification({
          type: 'error',
          title: 'Error loading tasks',
          message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [addNotification]);

  return { tasks, isLoading, error };
}