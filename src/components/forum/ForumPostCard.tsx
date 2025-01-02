import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Pin, Lock } from 'lucide-react';
import { Avatar } from '../shared/ui/Avatar';
import { Badge } from '../shared/ui/Badge';
import { formatDateTime } from '../../utils/date';
import type { ForumPost } from '../../types/forum';

interface ForumPostCardProps {
  post: ForumPost;
}

export function ForumPostCard({ post }: ForumPostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <Avatar name={post.author?.full_name || ''} size="md" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Link 
              to={`/community/posts/${post.id}`}
              className="text-lg font-medium text-gray-900 hover:text-indigo-600"
            >
              {post.title}
            </Link>
            {post.is_pinned && <Pin className="h-4 w-4 text-indigo-500" />}
            {post.is_locked && <Lock className="h-4 w-4 text-gray-500" />}
          </div>

          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {post.content}
          </p>

          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <span>{post.author?.full_name}</span>
            <span>•</span>
            <span>{formatDateTime(post.created_at)}</span>
          </div>

          <div className="mt-3 flex items-center space-x-4">
            <div className="flex items-center text-gray-500">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="text-sm">{post.replies_count?.count || 0}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-sm">{post.likes_count || 0}</span>
            </div>
            {post.tags?.map(tag => (
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