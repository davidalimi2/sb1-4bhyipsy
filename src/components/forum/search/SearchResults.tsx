import React from 'react';
import { ForumPostCard } from '../ForumPostCard';
import { EmptyState } from '../../shared/EmptyState';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import type { ForumPost } from '../../../types/forum';

interface SearchResultsProps {
  results: ForumPost[];
  isLoading: boolean;
  error?: string | null;
  searchQuery: string;
}

export function SearchResults({ results, isLoading, error, searchQuery }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <EmptyState
        title="No posts found"
        description={searchQuery 
          ? "Try adjusting your search terms or filters"
          : "No posts match the selected filters"}
        action={{
          label: "Create Post",
          href: "/community/new"
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {results.map(post => (
        <ForumPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}