import React from 'react';
import { ConversationList } from '../components/messages/ConversationList';
import { MessageThread } from '../components/messages/MessageThread';
import { useParams } from 'react-router-dom';

export default function MessagesPage() {
  const { id: conversationId } = useParams();

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80 border-r bg-white overflow-y-auto">
        <ConversationList />
      </div>
      <div className="flex-1 bg-white">
        {conversationId ? (
          <MessageThread />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}