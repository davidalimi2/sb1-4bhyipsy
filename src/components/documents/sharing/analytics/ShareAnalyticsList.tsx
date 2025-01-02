import React from 'react';
import { Activity, MapPin, Globe, Download } from 'lucide-react';
import type { ShareAnalytics } from '../../../../types';

interface ShareAnalyticsListProps {
  analytics: ShareAnalytics[];
}

export function ShareAnalyticsList({ analytics }: ShareAnalyticsListProps) {
  if (!analytics.length) {
    return (
      <div className="text-center py-4">
        <Activity className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">No activity recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {analytics.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {item.accessType === 'download' ? (
                <Download className="h-5 w-5 text-blue-500" />
              ) : (
                <Globe className="h-5 w-5 text-green-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.accessedBy}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(item.accessedAt).toLocaleString()}
                </p>
              </div>
            </div>
            {item.metadata?.location && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {item.metadata.location}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}