```typescript
import { useCallback } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import type { Question, QuestionCategory } from '../../types/deposition';

interface UseQuestionManagementProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export function useQuestionManagement({ questions, onChange }: UseQuestionManagementProps) {
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  }, [questions, onChange]);

  const addQuestion = useCallback((category?: QuestionCategory) => {
    onChange([
      ...questions,
      {
        id: Math.random().toString(36).substr(2, 9),
        text: '',
        category: category || 'background',
        importance: 'medium'
      }
    ]);
  }, [questions, onChange]);

  const addQuestionGroup = useCallback((category: QuestionCategory, count: number = 3) => {
    const newQuestions = Array.from({ length: count }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      category,
      importance: 'medium' as const
    }));

    onChange([...questions, ...newQuestions]);
  }, [questions, onChange]);

  const updateQuestion = useCallback((index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange(newQuestions);
  }, [questions, onChange]);

  const removeQuestion = useCallback((index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  }, [questions, onChange]);

  const reorderQuestions = useCallback((categoryOrder?: QuestionCategory[]) => {
    if (!categoryOrder) {
      // Sort by importance if no category order provided
      const order = { high: 1, medium: 2, low: 3 };
      return onChange([...questions].sort((a, b) => order[a.importance] - order[b.importance]));
    }

    // Sort by category order
    const orderedQuestions = [...questions].sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.category);
      const bIndex = categoryOrder.indexOf(b.category);
      return aIndex - bIndex;
    });

    onChange(orderedQuestions);
  }, [questions, onChange]);

  return {
    handleDragEnd,
    addQuestion,
    addQuestionGroup,
    updateQuestion,
    removeQuestion,
    reorderQuestions
  };
}
```