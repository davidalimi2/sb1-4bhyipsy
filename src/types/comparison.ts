export interface ComparisonResult {
  id: string;
  sourceVersionId: string;
  targetVersionId: string;
  changes: {
    additions: Change[];
    deletions: Change[];
    modifications: Change[];
  };
  createdAt: Date;
}

export interface Change {
  id: string;
  type: 'addition' | 'deletion' | 'modification';
  content: string;
  lineNumber: number;
  metadata?: Record<string, any>;
}