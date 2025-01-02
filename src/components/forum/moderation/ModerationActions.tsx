import React, { useState } from 'react';
import { Shield, Pin, Lock, AlertTriangle, Trash } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useModeration } from '../../../hooks/forum/useModeration';
import type { ForumModerationAction } from '../../../types/forum';

interface ModerationActionsProps {
  postId: string;
  isPinned: boolean;
  isLocked: boolean;
}

export function ModerationActions({ postId, isPinned, isLocked }: ModerationActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedAction, setSelectedAction] = useState<ForumModerationAction['action_type'] | null>(null);
  const { moderatePost, isLoading } = useModeration();

  const handleModerate = async () => {
    if (!selectedAction || !reason) return;

    await moderatePost({
      postId,
      action: selectedAction,
      reason
    });

    setShowActions(false);
    setReason('');
    setSelectedAction(null);
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        size="sm"
        icon={<Shield className="h-4 w-4" />}
        onClick={() => setShowActions(!showActions)}
      >
        Moderate
      </Button>

      {showActions && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 space-y-4">
          <div className="space-y-2">
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setSelectedAction('pin')}
              disabled={isPinned}
            >
              <Pin className="h-4 w-4 mr-2" />
              {isPinned ? 'Already Pinned' : 'Pin Post'}
            </button>
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setSelectedAction('lock')}
              disabled={isLocked}
            >
              <Lock className="h-4 w-4 mr-2" />
              {isLocked ? 'Already Locked' : 'Lock Post'}
            </button>
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-50 rounded-md"
              onClick={() => setSelectedAction('warn')}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Warn Author
            </button>
            <button
              className="flex items-center w-full px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md"
              onClick={() => setSelectedAction('delete')}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Post
            </button>
          </div>

          {selectedAction && (
            <div className="space-y-2">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for moderation..."
                className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelectedAction(null);
                    setReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleModerate}
                  loading={isLoading}
                  disabled={!reason.trim()}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}