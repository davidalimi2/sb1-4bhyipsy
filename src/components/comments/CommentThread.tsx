import React from 'react';
import { CommentItem } from './CommentItem';
import { CommentReplyForm } from './CommentReplyForm';
import type { CommentThread as CommentThreadType } from '../../types/comment';

interface CommentThreadProps {
  thread: CommentThreadType;
  onResolve: () => void;
  onReply: (content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

export function CommentThread({
  thread,
  onResolve,
  onReply,
  onEdit,
  onDelete
}: CommentThreadProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="space-y-4">
        {thread.comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onEdit={(content) => onEdit(comment.id, content)}
            onDelete={() => onDelete(comment.id)}
          />
        ))}
      </div>
      
      {thread.status === 'active' && (
        <div className="mt-4 space-y-4">
          <CommentReplyForm onSubmit={onReply} />
          <button
            onClick={onResolve}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Resolve thread
          </button>
        </div>
      )}
    </div>
  );
}