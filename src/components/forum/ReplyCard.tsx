import React from 'react';
import { MessageSquare, Check } from 'lucide-react';
import { Avatar } from '../shared/ui/Avatar';
import { VoteButtons } from './VoteButtons';
import { formatDateTime } from '../../utils/date';
import type { ForumReply } from '../../types/forum';

interface ReplyCardProps {
  reply: ForumReply;
  onReply?: () => void;
  onMarkSolution?: () => void;
  canMarkSolution?: boolean;
}

export function ReplyCard({
  reply,
  onReply,
  onMarkSolution,
  canMarkSolution
}: ReplyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex space-x-4">
        <Avatar name={reply.author.full_name} size="sm" />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {reply.author.full_name}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {formatDateTime(reply.created_at)}
              </span>
            </div>
            {reply.is_solution && (
              <span className="flex items-center text-green-600 text-sm">
                <Check className="h-4 w-4 mr-1" />
                Solution
              </span>
            )}
          </div>

          <div className="mt-2 text-gray-700">
            {reply.content}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <VoteButtons
                type="reply"
                id={reply.id}
                upvotes={reply.upvotes}
                downvotes={reply.downvotes}
              />

              {onReply && (
                <button
                  onClick={onReply}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span className="text-sm">Reply</span>
                </button>
              )}
            </div>

            {canMarkSolution && !reply.is_solution && (
              <button
                onClick={onMarkSolution}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Mark as Solution
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}