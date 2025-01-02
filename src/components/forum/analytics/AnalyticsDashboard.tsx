import React from 'react';
import { ForumStats } from './ForumStats';
import { TrendingTags } from './TrendingTags';

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <ForumStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Activity chart will be added here */}
        </div>
        <div>
          <TrendingTags />
        </div>
      </div>
    </div>
  );
}