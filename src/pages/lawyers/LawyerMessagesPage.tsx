import React from 'react';
import { useParams } from 'react-router-dom';
import { MessageThread } from '../../components/lawyers/messaging/MessageThread';
import { useConversation } from '../../hooks/lawyers/useConversation';
import { useLawyer } from '../../hooks/lawyers/useLawyer';

export default function LawyerMessagesPage() {
  const { id: lawyerId } = useParams();
  const { lawyer } = useLawyer(lawyerId);
  const { messages, isLoading, sendMessage } = useConversation(lawyerId || '');

  if (!lawyer) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-white shadow-sm rounded-lg overflow-hidden">
      <MessageThread
        messages={messages}
        recipientName={lawyer.name}
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}