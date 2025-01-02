import React from 'react';
import { Briefcase, FileText, Clock, AlertCircle } from 'lucide-react';

export function DashboardStats() {
  const stats = [
    {
      label: 'Active Cases',
      value: '12',
      icon: Briefcase,
      trend: '+2 this month',
      color: 'bg-blue-500'
    },
    {
      label: 'Documents',
      value: '48',
      icon: FileText,
      trend: '+5 this week',
      color: 'bg-green-500'
    },
    {
      label: 'Pending Tasks',
      value: '8',
      icon: Clock,
      trend: '3 urgent',
      color: 'bg-yellow-500'
    },
    {
      label: 'Upcoming Deadlines',
      value: '4',
      icon: AlertCircle,
      trend: 'Next in 3 days',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(({ label, value, icon: Icon, trend, color }) => (
        <div key={label} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
              <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{label}</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                <p className="ml-2 text-sm text-gray-500">{trend}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}