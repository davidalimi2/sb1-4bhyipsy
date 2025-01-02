import React from 'react';
import { useForumPosts } from '../../hooks/forum/useForumPosts';
import { ForumPostCard } from './ForumPostCard';
import { EmptyState } from '../shared/EmptyState';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import type { ForumCategory } from '../../types/forum';

interface ForumPostListProps {
  category?: ForumCategory;
  tag?: string;
  searchQuery?: string;
}

export function ForumPostList({ category, tag, searchQuery }: ForumPostListProps) {
  const { posts, isLoading, error } = useForumPosts({ category, tag, searchQuery });

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

  if (!posts.length) {
    return (
      <EmptyState
        title="No posts found"
        description={searchQuery ? "Try adjusting your search" : "Be the first to start a discussion"}
        action={{
          label: "Create Post",
          href: "/community/new"
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <ForumPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}