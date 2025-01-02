import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  trend?: string;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

export function StatsCard({ label, value, trend, icon: Icon, color }: StatsCardProps) {
  const colors = {
    blue: 'bg-blue-500 bg-opacity-10 text-blue-500',
    green: 'bg-green-500 bg-opacity-10 text-green-500',
    yellow: 'bg-yellow-500 bg-opacity-10 text-yellow-500',
    red: 'bg-red-500 bg-opacity-10 text-red-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{label}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {trend && <p className="ml-2 text-sm text-gray-500">{trend}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}