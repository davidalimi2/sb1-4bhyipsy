import React from 'react';
import { StatsCard } from './StatsCard';
import { Briefcase, FileText, Clock, AlertCircle } from 'lucide-react';
import { useStats } from '../../../hooks/useStats';

export function DashboardStats() {
  const { stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-lg h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        label="Active Cases"
        value={stats.activeCases}
        trend={stats.casesTrend}
        icon={Briefcase}
        color="blue"
      />
      <StatsCard
        label="Documents"
        value={stats.totalDocuments}
        trend={stats.documentsTrend}
        icon={FileText}
        color="green"
      />
      <StatsCard
        label="Pending Tasks"
        value={stats.pendingTasks}
        trend={`${stats.urgentTasks} urgent`}
        icon={Clock}
        color="yellow"
      />
      <StatsCard
        label="Upcoming Deadlines"
        value={stats.upcomingDeadlines}
        trend={stats.nextDeadline}
        icon={AlertCircle}
        color="red"
      />
    </div>
  );
}