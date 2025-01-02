import React from 'react';
import { useParams } from 'react-router-dom';
import { PostDetails } from '../components/forum/post/PostDetails';
import { ReplyList } from '../components/forum/ReplyList';
import { ReplyForm } from '../components/forum/ReplyForm';
import { usePost } from '../hooks/forum/usePost';
import { usePostReplies } from '../hooks/forum/usePostReplies';
import { LoadingSpinner } from '../components/shared/ui/LoadingSpinner';

export function PostDetailsPage() {
  const { id = '' } = useParams();
  const { post, isLoading: postLoading } = usePost(id);
  const { replies, isLoading: repliesLoading, addReply } = usePostReplies(id);

  if (postLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PostDetails post={post} />
      
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">
          {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
        </h2>
        
        <ReplyList
          replies={replies}
          isLoading={repliesLoading}
        />

        {!post.is_locked && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Add Your Reply
            </h3>
            <ReplyForm onSubmit={addReply} />
          </div>
        )}
      </div>
    </div>
  );
}