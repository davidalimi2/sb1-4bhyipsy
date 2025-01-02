```typescript
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { getQuestionCategoryLabel } from '../../../utils/questionCategories';
import type { QuestionCategory } from '../../../types/deposition';

interface QuestionGroupButtonProps {
  category: QuestionCategory;
  onAdd: () => void;
}

export function QuestionGroupButton({ category, onAdd }: QuestionGroupButtonProps) {
  return (
    <Button
      variant="secondary"
      size="sm"
      icon={<Plus className="h-4 w-4" />}
      onClick={onAdd}
    >
      Add {getQuestionCategoryLabel(category)} Questions
    </Button>
  );
}
```