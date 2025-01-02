import React, { useState } from 'react';
import { Edit2, Trash2, Clock } from 'lucide-react';
import { CommentEditForm } from './CommentEditForm';
import type { Comment } from '../../types/comment';

interface CommentItemProps {
  comment: Comment;
  onEdit: (content: string) => void;
  onDelete: () => void;
}

export function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <CommentEditForm
        initialContent={comment.content}
        onSubmit={(content) => {
          onEdit(content);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {comment.author[0].toUpperCase()}
          </span>
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">{comment.author}</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-700">{comment.content}</p>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {new Date(comment.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}