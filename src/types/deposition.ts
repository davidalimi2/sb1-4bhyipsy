```typescript
import { QuestionCategory } from '../utils/questionCategories';

export interface Question {
  id: string;
  text: string;
  category: QuestionCategory;
  importance: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface DepositionPlan {
  id: string;
  caseId: string;
  deponentName: string;
  date?: string;
  questions: Question[];
  objectives: string[];
  documents: string[];
  notes: string;
}

export type DeponentRole = 'witness' | 'expert' | 'party';
```