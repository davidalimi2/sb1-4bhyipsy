export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  contentType: string;
  size: number;
  hash: string;
  createdBy: string;
  createdAt: Date;
  comment?: string;
}

export interface VersionDiff {
  added: string[];
  removed: string[];
  modified: string[];
}