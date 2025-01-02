import React from 'react';
import { CreatePostForm } from '../components/forum/CreatePostForm';
import { useCreatePost } from '../hooks/forum/useCreatePost';

export function CreatePostPage() {
  const { createPost, isSubmitting } = useCreatePost();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Post</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <CreatePostForm
          onSubmit={createPost}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}