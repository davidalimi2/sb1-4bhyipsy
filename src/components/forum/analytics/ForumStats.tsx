import React from 'react';
import { MessageSquare, Users, TrendingUp, Calendar } from 'lucide-react';
import { useForumAnalytics } from '../../../hooks/forum/useForumAnalytics';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';

export function ForumStats() {
  const { analytics, isLoading } = useForumAnalytics();

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    {
      label: 'Total Posts',
      value: analytics.totalPosts,
      icon: MessageSquare,
      color: 'text-blue-500 bg-blue-100'
    },
    {
      label: 'Active Users',
      value: analytics.activeUsers,
      icon: Users,
      color: 'text-green-500 bg-green-100'
    },
    {
      label: 'Total Replies',
      value: analytics.totalReplies,
      icon: TrendingUp,
      color: 'text-purple-500 bg-purple-100'
    },
    {
      label: 'Posts Today',
      value: analytics.postsToday,
      icon: Calendar,
      color: 'text-orange-500 bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}