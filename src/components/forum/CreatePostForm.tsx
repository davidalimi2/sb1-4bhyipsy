import React from 'react';
import { useForm } from '../../hooks/useForm';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';
import { Select } from '../shared/ui/Select';
import { RichTextEditor } from '../shared/editor/RichTextEditor';
import { TagSelect } from './tags/TagSelect';
import type { ForumCategory } from '../../types/forum';

interface CreatePostFormData {
  title: string;
  content: string;
  category: ForumCategory;
  tags: string[];
}

interface CreatePostFormProps {
  onSubmit: (data: CreatePostFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreatePostForm({ onSubmit, isSubmitting }: CreatePostFormProps) {
  const { formData, setFormData, handleSubmit } = useForm<CreatePostFormData>({
    initialData: {
      title: '',
      content: '',
      category: 'general',
      tags: []
    },
    onSubmit
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
        placeholder="Enter a descriptive title"
      />

      <Select
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData(prev => ({ 
          ...prev, 
          category: e.target.value as ForumCategory 
        }))}
        required
      >
        <option value="general">General Discussion</option>
        <option value="legal_advice">Legal Advice</option>
        <option value="resources">Resources</option>
        <option value="court_help">Court Help</option>
      </Select>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          placeholder="Write your post content here..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <TagSelect
          selectedTags={formData.tags}
          onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
        >
          Create Post
        </Button>
      </div>
    </form>
  );
}