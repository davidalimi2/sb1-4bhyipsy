import React from 'react';
import { Mail, Calendar } from 'lucide-react';
import { Avatar } from '../shared/ui/Avatar';
import { ReputationBadge } from '../forum/reputation/ReputationBadge';
import { formatDateTime } from '../../utils/date';
import type { User } from '../../types/user';
import type { UserReputation } from '../../types/forum';

interface UserProfileProps {
  user: User;
  reputation: UserReputation | null;
}

export function UserProfile({ user, reputation }: UserProfileProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar name={user.full_name} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {user.email}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Joined {formatDateTime(user.created_at)}
              </div>
            </div>
          </div>
        </div>

        {reputation && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <ReputationBadge reputation={reputation} size="lg" />
              <div className="text-sm text-gray-500">
                {reputation.total_points} reputation points
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  {reputation.post_count}
                </div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  {reputation.solution_count}
                </div>
                <div className="text-sm text-gray-500">Solutions</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  {reputation.helpful_count}
                </div>
                <div className="text-sm text-gray-500">Helpful Marks</div>
              </div>
            </div>

            {reputation.badges.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">Badges</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {reputation.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}