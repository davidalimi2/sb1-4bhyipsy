import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Task } from '../../types/task';

export function useTasks(caseId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!caseId) return;
    
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('tasks')
          .select('*, assignee:assigned_to(full_name)')
          .eq('case_id', caseId)
          .order('due_date', { ascending: true });

        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch tasks'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    // Subscribe to task changes
    const subscription = supabase
      .channel(`tasks-${caseId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks', filter: `case_id=eq.${caseId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [...prev, payload.new as Task]);
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev => prev.map(task => 
              task.id === payload.new.id ? payload.new as Task : task
            ));
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(task => task.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [caseId, addNotification]);

  const createTask = async (data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Task created',
        message: 'Task has been created successfully'
      });

      return task;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create task'
      });
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Optimistically update the UI
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ));

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) {
        // Revert optimistic update on error
        setTasks(prev => prev.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        ));
        throw error;
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update task'
      });
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Task deleted',
        message: 'Task has been deleted successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete task'
      });
      throw error;
    }
  };

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask
  };
}