import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialData: T;
  onSubmit: (data: T) => Promise<void>;
}

export function useForm<T>({ initialData, onSubmit }: UseFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit]);

  return {
    formData,
    setFormData,
    isSubmitting,
    handleSubmit
  };
}