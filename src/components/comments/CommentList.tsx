import React from 'react';
import { MessageSquare } from 'lucide-react';
import { CommentThread } from './CommentThread';
import type { CommentThread as CommentThreadType } from '../../types/comment';

interface CommentListProps {
  threads: CommentThreadType[];
  onResolve: (threadId: string) => void;
  onReply: (threadId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

export function CommentList({
  threads,
  onResolve,
  onReply,
  onEdit,
  onDelete
}: CommentListProps) {
  if (!threads.length) {
    return (
      <div className="text-center py-6">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No comments yet</h3>
        <p className="mt-1 text-sm text-gray-500">Start the discussion by adding a comment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {threads.map(thread => (
        <CommentThread
          key={thread.id}
          thread={thread}
          onResolve={() => onResolve(thread.id)}
          onReply={(content) => onReply(thread.id, content)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}