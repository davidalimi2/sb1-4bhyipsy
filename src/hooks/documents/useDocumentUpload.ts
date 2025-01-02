import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';

interface UseDocumentUploadOptions {
  caseId: string;
  onSuccess?: () => void;
}

export function useDocumentUpload({ caseId, onSuccess }: UseDocumentUploadOptions) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { addNotification } = useNotifications();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      setSelectedFile(file);
    } else {
      addNotification({
        type: 'error',
        title: 'File too large',
        message: 'Please select a file under 10MB'
      });
    }
  }, [addNotification]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      addNotification({
        type: 'error',
        title: 'File too large',
        message: 'Please select a file under 10MB'
      });
    }
  }, [addNotification]);

  const resetUpload = useCallback(() => {
    setSelectedFile(null);
    setUploadProgress(0);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${caseId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          }
        });

      if (uploadError) throw uploadError;

      // Create document record
      const { error: createError } = await supabase
        .from('documents')
        .insert([{
          case_id: caseId,
          title: selectedFile.name,
          type: 'filing',
          storage_path: filePath,
          size: selectedFile.size
        }]);

      if (createError) throw createError;

      addNotification({
        type: 'success',
        title: 'Upload complete',
        message: 'Document has been uploaded successfully'
      });

      resetUpload();
      onSuccess?.();
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Upload failed',
        message: error instanceof Error ? error.message : 'Failed to upload document'
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, caseId, addNotification, resetUpload, onSuccess]);

  return {
    selectedFile,
    uploadProgress,
    isUploading,
    handleFileSelect,
    handleDrop,
    handleUpload,
    resetUpload
  };
}