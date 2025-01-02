export type DiscoveryType = 
  | 'interrogatory'
  | 'document_request'
  | 'admission_request'
  | 'deposition_notice';

export type DiscoveryStatus = 
  | 'pending'
  | 'completed'
  | 'overdue'
  | 'withdrawn';

export interface Discovery {
  id: string;
  case_id: string;
  type: DiscoveryType;
  description: string;
  party?: string;
  status: DiscoveryStatus;
  dueDate: string;
  created_at: string;
  updated_at: string;
  documents?: string[];
  responses?: DiscoveryResponse[];
}

export interface DiscoveryResponse {
  id: string;
  discovery_id: string;
  content: string;
  documents?: string[];
  created_at: string;
  created_by: string;
}