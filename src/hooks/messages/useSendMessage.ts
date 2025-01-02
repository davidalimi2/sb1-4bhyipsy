import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import { validateMessageData } from '../../utils/messageValidation';
import { uploadAttachments } from '../../utils/messageUtils';
import type { NewMessageData } from '../../types/message';

export function useSendMessage() {
  const [isSending, setIsSending] = useState(false);
  const { addNotification } = useNotifications();

  const sendMessage = async (data: NewMessageData) => {
    try {
      setIsSending(true);

      // Validate message data
      const validation = validateMessageData(data);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Not authenticated');

      // Upload attachments if any
      const attachmentIds = data.attachments?.length 
        ? await uploadAttachments(data.attachments)
        : [];

      // Create message record
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: data.recipient_id,
          subject: data.subject,
          content: data.content,
          parent_id: data.parent_id,
          attachments: attachmentIds
        });

      if (messageError) throw messageError;

      addNotification({
        type: 'success',
        title: 'Message sent',
        message: 'Your message has been sent successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to send message'
      });
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendMessage,
    isSending
  };
}