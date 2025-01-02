import { useState } from 'react';
import type { Document } from '../types';

interface UseDocumentFormProps {
  caseId: string;
  initialData?: Partial<Document>;
  onSubmit: (data: FormData) => Promise<void>;
}

interface FormData {
  title: string;
  type: Document['type'];
  file: File | null;
}

export function useDocumentForm({ caseId, initialData, onSubmit }: UseDocumentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: initialData?.title || '',
    type: initialData?.type || 'filing',
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('file', formData.file);
      data.append('caseId', caseId);
      
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit,
  };
}