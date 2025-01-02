import type { Case, CaseFilters } from '../types/case';

export function getCaseTypeLabel(type: Case['type']): string {
  const labels: Record<Case['type'], string> = {
    civil: 'Civil Case',
    family: 'Family Law',
    small_claims: 'Small Claims'
  };
  return labels[type];
}

export function isCaseEditable(caseData: Case): boolean {
  return caseData.status !== 'closed';
}

export function canDeleteCase(caseData: Case): boolean {
  return caseData.status === 'open' && !caseData.lawyer_id;
}

export function filterCases(cases: Case[], filters: CaseFilters): Case[] {
  return cases.filter(caseItem => {
    // Type filter
    if (filters.type && caseItem.type !== filters.type) {
      return false;
    }
    
    // Status filter
    if (filters.status && caseItem.status !== filters.status) {
      return false;
    }
    
    // Search filter
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