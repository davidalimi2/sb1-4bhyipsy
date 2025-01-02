import React from 'react';
import { DashboardStats } from './stats/DashboardStats';
import { RecentCases } from './cases/RecentCases';
import { RecentDocuments } from './documents/RecentDocuments';
import { UpcomingTasks } from './tasks/UpcomingTasks';

export function DashboardContent() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <DashboardStats />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RecentCases />
        <RecentDocuments />
      </div>

      <UpcomingTasks />
    </div>
  );
}