import { useState, useCallback } from 'react';
import { validateFile } from '../../utils/fileTypes';
import { useNotifications } from '../useNotifications';

interface UseFileUploadOptions {
  allowedTypes?: string[];
  multiple?: boolean;
  onSuccess?: (file: File) => void;
  onError?: (error: string) => void;
}

export function useFileUpload({ 
  allowedTypes,
  multiple = false,
  onSuccess,
  onError 
}: UseFileUploadOptions = {}) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(multiple ? [] : []);
  const [isDragging, setIsDragging] = useState(false);
  const { addNotification } = useNotifications();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter(file => {
      const { valid, error } = validateFile(file);
      if (!valid) {
        onError?.(error || 'Invalid file');
        addNotification({
          type: 'error',
          title: 'Invalid File',
          message: error || 'Please select a valid file'
        });
        return false;
      }
      return true;
    });

    if (validFiles.length) {
      setSelectedFiles(multiple ? validFiles : [validFiles[0]]);
      validFiles.forEach(file => onSuccess?.(file));
    }
  }, [multiple, onSuccess, onError, addNotification]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const validFiles = files.filter(file => {
      const { valid, error } = validateFile(file);
      if (!valid) {
        onError?.(error || 'Invalid file');
        addNotification({
          type: 'error',
          title: 'Invalid File',
          message: error || 'Please select a valid file'
        });
        return false;
      }
      return true;
    });

    if (validFiles.length) {
      setSelectedFiles(multiple ? validFiles : [validFiles[0]]);
      validFiles.forEach(file => onSuccess?.(file));
    }
  }, [multiple, onSuccess, onError, addNotification]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const reset = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  return {
    selectedFiles,
    isDragging,
    handleFileSelect,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    reset
  };
}