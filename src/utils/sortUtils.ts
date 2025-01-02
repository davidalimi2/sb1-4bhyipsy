import type { Case, SortConfig } from '../types/case';

export function sortCases(cases: Case[], config: SortConfig): Case[] {
  return [...cases].sort((a, b) => {
    const { field, order } = config;
    
    if (field === 'title') {
      return order === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    
    const aValue = new Date(a[field]).getTime();
    const bValue = new Date(b[field]).getTime();
    
    return order === 'asc' ? aValue - bValue : bValue - aValue;
  });
}