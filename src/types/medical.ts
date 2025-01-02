```typescript
export interface MedicalFinding {
  condition: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  date?: string;
  provider?: string;
}

export interface TimelineEvent {
  date: string;
  description: string;
  provider?: string;
  documents?: string[];
}

export interface MedicalSummary {
  id: string;
  caseId: string;
  keyFindings: MedicalFinding[];
  timeline: TimelineEvent[];
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}
```