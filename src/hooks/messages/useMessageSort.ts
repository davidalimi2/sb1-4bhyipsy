import { useCallback } from 'react';
import { useMessageStore } from '../../stores/messageStore';
import type { MessageSort } from '../../types/message';

export function useMessageSort() {
  const { sort, setSort } = useMessageStore();

  const updateSort = useCallback((field: MessageSort['field'], direction: MessageSort['direction']) => {
    setSort({ field, direction });
  }, [setSort]);

  const toggleSortDirection = useCallback(() => {
    setSort(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, [setSort]);

  return {
    sort,
    updateSort,
    toggleSortDirection
  };
}