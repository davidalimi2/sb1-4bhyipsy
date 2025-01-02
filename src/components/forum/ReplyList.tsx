import React from 'react';
import { ReplyCard } from './ReplyCard';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import type { ForumReply } from '../../types/forum';

interface ReplyListProps {
  replies: ForumReply[];
  isLoading: boolean;
  error?: string | null;
}

export function ReplyList({ replies, isLoading, error }: ReplyListProps) {
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

  if (!replies.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No replies yet. Be the first to reply!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {replies.map(reply => (
        <ReplyCard key={reply.id} reply={reply} />
      ))}
    </div>
  );
}