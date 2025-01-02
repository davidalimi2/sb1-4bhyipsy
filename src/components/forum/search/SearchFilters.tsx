import React from 'react';
import { Filter } from 'lucide-react';
import { Select } from '../../shared/ui/Select';
import type { ForumCategory } from '../../../types/forum';

interface SearchFiltersProps {
  category?: ForumCategory;
  onCategoryChange: (category?: ForumCategory) => void;
  status?: 'open' | 'closed';
  onStatusChange: (status?: 'open' | 'closed') => void;
  sortBy?: 'recent' | 'popular' | 'unanswered';
  onSortChange: (sort: 'recent' | 'popular' | 'unanswered') => void;
  timeframe?: 'day' | 'week' | 'month' | 'all';
  onTimeframeChange: (timeframe: 'day' | 'week' | 'month' | 'all') => void;
}

export function SearchFilters({
  category,
  onCategoryChange,
  status,
  onStatusChange,
  sortBy,
  onSortChange,
  timeframe,
  onTimeframeChange
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center">
        <Filter className="h-4 w-4 mr-2 text-gray-500" />
        <span className="text-sm text-gray-700">Filters:</span>
      </div>

      <Select
        value={category || ''}
        onChange={(e) => onCategoryChange(e.target.value as ForumCategory || undefined)}
        className="w-40"
      >
        <option value="">All Categories</option>
        <option value="general">General Discussion</option>
        <option value="legal_advice">Legal Advice</option>
        <option value="resources">Resources</option>
        <option value="court_help">Court Help</option>
      </Select>

      <Select
        value={status || ''}
        onChange={(e) => onStatusChange(e.target.value as 'open' | 'closed' || undefined)}
        className="w-32"
      >
        <option value="">All Status</option>
        <option value="open">Open</option>
        <option value="closed">Closed</option>
      </Select>

      <Select
        value={sortBy || 'recent'}
        onChange={(e) => onSortChange(e.target.value as 'recent' | 'popular' | 'unanswered')}
        className="w-40"
      >
        <option value="recent">Most Recent</option>
        <option value="popular">Most Popular</option>
        <option value="unanswered">Unanswered</option>
      </Select>

      <Select
        value={timeframe || 'all'}
        onChange={(e) => onTimeframeChange(e.target.value as 'day' | 'week' | 'month' | 'all')}
        className="w-32"
      >
        <option value="all">All Time</option>
        <option value="day">Past Day</option>
        <option value="week">Past Week</option>
        <option value="month">Past Month</option>
      </Select>
    </div>
  );
}