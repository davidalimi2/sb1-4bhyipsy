import React from 'react';
import { ForumStats } from '../components/forum/analytics/ForumStats';
import { SearchContainer } from '../components/forum/search/SearchContainer';
import { TrendingTags } from '../components/forum/analytics/TrendingTags';
import { Button } from '../components/shared/ui/Button';
import { Plus } from 'lucide-react';

export function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Community</h1>
        <Button
          href="/community/new"
          icon={<Plus className="h-4 w-4" />}
        >
          Create Post
        </Button>
      </div>

      <ForumStats />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <SearchContainer />
        </div>
        <div className="space-y-6">
          <TrendingTags />
        </div>
      </div>
    </div>
  );
}