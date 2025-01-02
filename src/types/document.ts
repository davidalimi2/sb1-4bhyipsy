export interface Document {
  id: string;
  title: string;
  description?: string;
  type: 'filing' | 'evidence' | 'correspondence';
  status: 'draft' | 'final' | 'submitted';
  storage_path: string;
  size: number;
  mime_type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  current_version_id?: string;
  case_id: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version: number;
  storage_path: string;
  size: number;
  comment?: string;
  created_by: string;
  created_at: string;
}