```typescript
export const QUESTION_CATEGORIES = {
  background: {
    label: 'Background',
    description: 'Basic information about the deponent'
  },
  qualifications: {
    label: 'Qualifications',
    description: 'Education, training, and experience'
  },
  knowledge: {
    label: 'Knowledge',
    description: 'Understanding of relevant facts and circumstances'
  },
  events: {
    label: 'Events',
    description: 'Specific incidents or occurrences'
  },
  opinions: {
    label: 'Opinions',
    description: 'Professional judgments and conclusions'
  }
} as const;

export type QuestionCategory = keyof typeof QUESTION_CATEGORIES;

export function getQuestionCategoryLabel(category: QuestionCategory): string {
  return QUESTION_CATEGORIES[category].label;
}

export function getQuestionCategoryDescription(category: QuestionCategory): string {
  return QUESTION_CATEGORIES[category].description;
}
```