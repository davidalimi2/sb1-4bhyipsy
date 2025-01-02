import React from 'react';
import { Award } from 'lucide-react';
import type { UserReputation } from '../../../types/forum';

interface ReputationBadgeProps {
  reputation: UserReputation;
  size?: 'sm' | 'md' | 'lg';
}

export function ReputationBadge({ reputation, size = 'md' }: ReputationBadgeProps) {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600 bg-purple-100';
    if (level >= 5) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className={`inline-flex items-center ${sizes[size]} font-medium rounded-full px-2 py-1 ${getLevelColor(reputation.level)}`}>
      <Award className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
      <span>Level {reputation.level}</span>
    </div>
  );
}