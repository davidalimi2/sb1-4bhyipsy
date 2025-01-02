import React from 'react';
import { Header } from '../layout/Header';
import { Sidebar } from '../layout/Sidebar';
import { DashboardStats } from './stats/DashboardStats';
import { RecentCases } from './cases/RecentCases';
import { RecentDocuments } from './documents/RecentDocuments';
import { UpcomingTasks } from './tasks/UpcomingTasks';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header />
        <main className="flex-1 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              
              <div className="mt-8">
                <DashboardStats />
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <RecentCases />
                <RecentDocuments />
              </div>

              <div className="mt-8">
                <UpcomingTasks />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}