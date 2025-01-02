import React, { useState } from 'react';
import { Tag } from './Tag';
import { useForumTags } from '../../../hooks/forum/useForumTags';

interface TagSelectProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagSelect({
  selectedTags,
  onChange,
  maxTags = 5
}: TagSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { tags, isLoading } = useForumTags();

  const handleTagSelect = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else if (selectedTags.length < maxTags) {
      onChange([...selectedTags, tagId]);
    }
  };

  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id));
  const availableTags = tags.filter(tag => !selectedTags.includes(tag.id));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedTagObjects.map(tag => (
          <Tag
            key={tag.id}
            tag={tag}
            isSelected
            onRemove={() => handleTagSelect(tag.id)}
          />
        ))}
        {selectedTags.length < maxTags && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add Tag
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-2 p-2 bg-white border border-gray-200 rounded-md shadow-sm">
          {isLoading ? (
            <p className="text-sm text-gray-500 p-2">Loading tags...</p>
          ) : availableTags.length === 0 ? (
            <p className="text-sm text-gray-500 p-2">No more tags available</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Tag
                  key={tag.id}
                  tag={tag}
                  onClick={() => {
                    handleTagSelect(tag.id);
                    if (selectedTags.length + 1 >= maxTags) {
                      setIsOpen(false);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}