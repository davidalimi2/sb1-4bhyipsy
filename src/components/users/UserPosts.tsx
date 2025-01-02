import React from 'react';
import { ForumPostCard } from '../forum/ForumPostCard';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { useUserPosts } from '../../hooks/forum/useUserPosts';

interface UserPostsProps {
  userId: string;
}

export function UserPosts({ userId }: UserPostsProps) {
  const { posts, isLoading } = useUserPosts(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Posts</h2>
      {posts.map(post => (
        <ForumPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}