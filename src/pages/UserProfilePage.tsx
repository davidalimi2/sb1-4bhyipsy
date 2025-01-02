import React from 'react';
import { useParams } from 'react-router-dom';
import { UserProfile } from '../components/users/UserProfile';
import { ReputationHistory } from '../components/forum/reputation/ReputationHistory';
import { UserPosts } from '../components/users/UserPosts';
import { LoadingSpinner } from '../components/shared/ui/LoadingSpinner';
import { useUserProfile } from '../hooks/users/useUserProfile';
import { useReputation } from '../hooks/forum/useReputation';

export function UserProfilePage() {
  const { id = '' } = useParams();
  const { user, isLoading: userLoading } = useUserProfile(id);
  const { reputation, reputationHistory, isLoading: reputationLoading } = useReputation(id);

  if (userLoading || reputationLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <UserProfile user={user} reputation={reputation} />
          <UserPosts userId={id} />
        </div>
        <div>
          <ReputationHistory events={reputationHistory} />
        </div>
      </div>
    </div>
  );
}