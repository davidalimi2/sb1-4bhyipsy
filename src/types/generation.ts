```typescript
export type DocumentTemplateType = 
  | 'lawsuit'
  | 'contract'
  | 'motion'
  | 'brief'
  | 'discovery'
  | 'deposition';

export interface DocumentTemplate {
  id: string;
  type: DocumentTemplateType;
  title: string;
  description: string;
  questions: TemplateQuestion[];
  structure: Record<string, any>;
  jurisdiction?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateQuestion {
  id: string;
  text: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean' | 'multi';
  required: boolean;
  options?: string[];
  dependsOn?: {
    questionId: string;
    value: any;
  };
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    message?: string;
  };
}

export type GenerationAnswers = Record<string, any>;

export interface DocumentAnalysis {
  warnings?: string[];
  suggestions?: string[];
  requiredFields?: string[];
  legalCitations?: Array<{
    citation: string;
    relevance: string;
  }>;
  nextSteps?: string[];
}
```