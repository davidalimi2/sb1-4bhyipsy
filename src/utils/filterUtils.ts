import type { Case } from '../types';

export function filterCases(
  cases: Case[],
  filters: {
    type?: Case['type'];
    status?: Case['status'];
    search?: string;
  }
): Case[] {
  return cases.filter(caseItem => {
    if (filters.type && caseItem.type !== filters.type) {
      return false;
    }
    
    if (filters.status && caseItem.status !== filters.status) {
      return false;
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        caseItem.title.toLowerCase().includes(searchLower) ||
        caseItem.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
}