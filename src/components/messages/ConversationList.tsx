import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Avatar } from '../shared/ui/Avatar';
import { formatDateTime } from '../../utils/date';
import { useConversations } from '../../hooks/messages/useConversations';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';

export function ConversationList() {
  const navigate = useNavigate();
  const { conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <EmptyState
        title="No conversations"
        description="Start a conversation with a lawyer or client"
        action={{
          label: "Start Conversation",
          href: "/messages/new"
        }}
      />
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className="p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => navigate(`/messages/${conversation.id}`)}
        >
          <div className="flex items-start space-x-3">
            <Avatar name={conversation.otherParty.full_name} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {conversation.otherParty.full_name}
                </p>
                <span className="text-xs text-gray-500">
                  {formatDateTime(conversation.lastMessage?.created_at)}
                </span>
              </div>
              {conversation.lastMessage && (
                <p className="mt-1 text-sm text-gray-500 truncate">
                  {conversation.lastMessage.content}
                </p>
              )}
              {conversation.unreadCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {conversation.unreadCount} new
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}