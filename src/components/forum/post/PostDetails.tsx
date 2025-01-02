import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Avatar } from '../../shared/ui/Avatar';
import { Badge } from '../../shared/ui/Badge';
import { VoteButtons } from '../VoteButtons';
import { ModerationActions } from '../moderation/ModerationActions';
import { formatDateTime } from '../../../utils/date';
import type { ForumPost } from '../../../types/forum';

interface PostDetailsProps {
  post: ForumPost;
}

export function PostDetails({ post }: PostDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
          <ModerationActions
            postId={post.id}
            isPinned={post.is_pinned}
            isLocked={post.is_locked}
          />
        </div>

        <div className="mt-2 flex items-center space-x-4">
          <Avatar name={post.author.full_name} size="sm" />
          <span className="text-sm text-gray-500">
            Posted by {post.author.full_name}
          </span>
          <span className="text-sm text-gray-500">
            {formatDateTime(post.created_at)}
          </span>
        </div>

        <div className="mt-6 prose max-w-none">
          {post.content}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <VoteButtons
              type="post"
              id={post.id}
              upvotes={post.upvotes}
              downvotes={post.downvotes}
            />
            <div className="flex items-center text-gray-500">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-sm">{post.replies_count}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {post.tags.map(tag => (
              <Badge key={tag.name} variant="default">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}