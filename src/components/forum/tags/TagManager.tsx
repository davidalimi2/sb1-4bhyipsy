import React, { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';
import { useForumTags } from '../../../hooks/forum/useForumTags';

export function TagManager() {
  const { tags, isLoading, createTag, deleteTag } = useForumTags();
  const [newTagName, setNewTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setIsSubmitting(true);
      await createTag(newTagName.trim());
      setNewTagName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="Enter new tag name"
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!newTagName.trim() || isSubmitting}
          loading={isSubmitting}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Tag
        </Button>
      </form>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {tags.map(tag => (
            <div
              key={tag.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <span className="text-sm font-medium text-gray-900">
                {tag.name}
              </span>
              <button
                onClick={() => deleteTag(tag.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}