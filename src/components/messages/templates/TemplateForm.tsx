```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';
import { RichTextEditor } from '../../shared/editor/RichTextEditor';
import { useTemplateStore } from '../../../stores/templateStore';
import type { MessageTemplate } from '../../../types/message';

interface TemplateFormProps {
  initialData?: Partial<MessageTemplate>;
}

export function TemplateForm({ initialData }: TemplateFormProps) {
  const navigate = useNavigate();
  const { createTemplate, updateTemplate } = useTemplateStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<MessageTemplate>>({
    name: '',
    subject: '',
    content: '',
    variables: [],
    ...initialData
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.subject || !formData.content) return;

    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updateTemplate(initialData.id, formData);
      } else {
        await createTemplate(formData as Omit<MessageTemplate, 'id' | 'created_at'>);
      }
      navigate('/settings/templates');
    } catch (error) {
      console.error('Failed to save template:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Template Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Input
        label="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
          placeholder="Write your template content..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/settings/templates')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!formData.name || !formData.subject || !formData.content}
        >
          {initialData?.id ? 'Update Template' : 'Create Template'}
        </Button>
      </div>
    </form>
  );
}
```