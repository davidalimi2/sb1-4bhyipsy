import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import { generateStoragePath } from '../../utils/storageUtils';
import type { MessageAttachment } from '../../types/message';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ATTACHMENTS = 5;

export function useMessageAttachments() {
  const [isUploading, setIsUploading] = useState(false);
  const { addNotification } = useNotifications();

  const uploadAttachments = async (files: File[]): Promise<string[]> => {
    try {
      setIsUploading(true);

      // Validate files
      if (files.length > MAX_ATTACHMENTS) {
        throw new Error(`Maximum ${MAX_ATTACHMENTS} attachments allowed`);
      }

      for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File ${file.name} exceeds maximum size of 10MB`);
        }
      }

      // Upload files and create attachment records
      const attachmentIds = await Promise.all(
        files.map(async (file) => {
          const path = generateStoragePath('message-attachments', file.name);
          
          // Upload file
          const { error: uploadError } = await supabase.storage
            .from('messages')
            .upload(path, file);

          if (uploadError) throw uploadError;

          // Create attachment record
          const { data: attachment, error: attachmentError } = await supabase
            .from('message_attachments')
            .insert({
              name: file.name,
              storage_path: path,
              size: file.size,
              type: file.type
            })
            .select()
            .single();

          if (attachmentError) throw attachmentError;
          return attachment.id;
        })
      );

      return attachmentIds;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Upload failed',
        message: error instanceof Error ? error.message : 'Failed to upload attachments'
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAttachment = async (attachmentId: string) => {
    try {
      const { error } = await supabase
        .from('message_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) throw error;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to delete attachment'
      });
      throw error;
    }
  };

  return {
    uploadAttachments,
    deleteAttachment,
    isUploading
  };
}