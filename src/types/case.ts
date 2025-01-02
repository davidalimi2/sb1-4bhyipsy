export interface Case {
  id: string;
  title: string;
  description: string;
  type: 'civil' | 'family' | 'small_claims';
  status: 'open' | 'in_progress' | 'closed';
  client_id: string;
  lawyer_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewCaseData {
  title: string;
  description: string;
  type: Case['type'];
}

export interface CaseFilters {
  search: string;
  type?: Case['type'];
  status?: Case['status'];
}

export interface SortConfig {
  field: 'createdAt' | 'updatedAt' | 'title';
  order: 'asc' | 'desc';
}