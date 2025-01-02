import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  activeCases: number;
  casesTrend: string;
  totalDocuments: number;
  documentsTrend: string;
  pendingTasks: number;
  urgentTasks: number;
  upcomingDeadlines: number;
  nextDeadline: string;
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats>({
    activeCases: 0,
    casesTrend: '',
    totalDocuments: 0,
    documentsTrend: '',
    pendingTasks: 0,
    urgentTasks: 0,
    upcomingDeadlines: 0,
    nextDeadline: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data: cases } = await supabase
          .from('cases')
          .select('status', { count: 'exact' })
          .eq('status', 'open');

        const { data: documents } = await supabase
          .from('documents')
          .select('id', { count: 'exact' });

        const { data: tasks } = await supabase
          .from('tasks')
          .select('priority, due_date')
          .eq('status', 'pending');

        setStats({
          activeCases: cases?.length || 0,
          casesTrend: '+2 this month',
          totalDocuments: documents?.length || 0,
          documentsTrend: '+5 this week',
          pendingTasks: tasks?.length || 0,
          urgentTasks: tasks?.filter(t => t.priority === 'high').length || 0,
          upcomingDeadlines: tasks?.filter(t => {
            const dueDate = new Date(t.due_date);
            const today = new Date();
            const diff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return diff <= 7;
          }).length || 0,
          nextDeadline: 'Next in 3 days'
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}