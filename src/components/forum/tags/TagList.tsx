import React from 'react';
import { Tag } from './Tag';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import type { ForumTag } from '../../../types/forum';

interface TagListProps {
  tags: ForumTag[];
  selectedTags?: string[];
  onTagSelect?: (tagId: string) => void;
  onTagRemove?: (tagId: string) => void;
  isLoading?: boolean;
}

export function TagList({
  tags,
  selectedTags = [],
  onTagSelect,
  onTagRemove,
  isLoading
}: TagListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!tags.length) {
    return (
      <p className="text-sm text-gray-500">No tags available</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Tag
          key={tag.id}
          tag={tag}
          isSelected={selectedTags.includes(tag.id)}
          onClick={() => {
            if (selectedTags.includes(tag.id)) {
              onTagRemove?.(tag.id);
            } else {
              onTagSelect?.(tag.id);
            }
          }}
        />
      ))}
    </div>
  );
}