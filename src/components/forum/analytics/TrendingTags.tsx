import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useForumAnalytics } from '../../../hooks/forum/useForumAnalytics';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';

export function TrendingTags() {
  const { analytics, isLoading } = useForumAnalytics();

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!analytics?.trendingTags.length) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No trending tags yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <TrendingUp className="h-5 w-5 text-indigo-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Trending Tags</h3>
      </div>

      <div className="space-y-4">
        {analytics.trendingTags.map(tag => (
          <div
            key={tag.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                #{tag.name}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                {tag.count} posts
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${Math.min(tag.trend, 100)}%` }}
                />
              </div>
              <span className="ml-2 text-xs text-gray-500">
                {Math.round(tag.trend)}% trend
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}