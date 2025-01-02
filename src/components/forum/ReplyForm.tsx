import React, { useState } from 'react';
import { Button } from '../shared/ui/Button';
import { RichTextEditor } from '../shared/editor/RichTextEditor';

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
}

export function ReplyForm({ onSubmit, placeholder = 'Write your reply...' }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RichTextEditor
        content={content}
        onChange={setContent}
        placeholder={placeholder}
        minHeight="150px"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          loading={isSubmitting}
        >
          Post Reply
        </Button>
      </div>
    </form>
  );
}