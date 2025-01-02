import React, { memo } from 'react';
import { useMessageThread } from '../../../hooks/messages/useMessageThread';
import { ThreadMessage } from './ThreadMessage';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import type { ThreadNode } from '../../../types/message';

interface ThreadViewProps {
  messageId: string;
  onReply?: (messageId: string) => void;
}

export const ThreadView = memo(function ThreadView({ messageId, onReply }: ThreadViewProps) {
  const { thread, isLoading } = useMessageThread(messageId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const renderNode = (node: ThreadNode, isLast: boolean = false) => (
    <div key={node.message.id} className="space-y-2">
      <ThreadMessage
        message={node.message}
        onReply={onReply}
        isLast={isLast && node.children.length === 0}
      />
      {node.children.length > 0 && (
        <div className="ml-8 space-y-2 border-l-2 border-gray-200 pl-4">
          {node.children.map((child, index) =>
            renderNode(child, index === node.children.length - 1)
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {thread.map((node, index) => renderNode(node, index === thread.length - 1))}
    </div>
  );
});