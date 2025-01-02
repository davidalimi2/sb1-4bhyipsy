import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useVoting } from '../../hooks/forum/useVoting';

interface VoteButtonsProps {
  type: 'post' | 'reply';
  id: string;
  upvotes: number;
  downvotes: number;
  onVoteChange?: (newVoteCount: number) => void;
}

export function VoteButtons({
  type,
  id,
  upvotes,
  downvotes,
  onVoteChange
}: VoteButtonsProps) {
  const { vote, isVoting } = useVoting({ onVoteChange });

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => vote(type, id, 'upvote')}
        disabled={isVoting}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
          isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="text-sm">{upvotes}</span>
      </button>
      <button
        onClick={() => vote(type, id, 'downvote')}
        disabled={isVoting}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
          isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
        }`}
      >
        <ThumbsDown className="h-4 w-4" />
        <span className="text-sm">{downvotes}</span>
      </button>
    </div>
  );
}