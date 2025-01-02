```typescript
import React from 'react';
import { GripVertical, Trash } from 'lucide-react';
import { QuestionFields } from './QuestionFields';
import { Button } from '../../shared/ui/Button';
import type { Question } from '../../../types/deposition';

interface QuestionContentProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onRemove: () => void;
  dragHandleProps?: any;
}

export function QuestionContent({
  question,
  onUpdate,
  onRemove,
  dragHandleProps
}: QuestionContentProps) {
  return (
    <div className="p-4">
      <div className="flex items-start space-x-4">
        <div {...dragHandleProps} className="mt-2 cursor-move">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <QuestionFields
            question={question}
            onUpdate={onUpdate}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<Trash className="h-4 w-4" />}
          onClick={onRemove}
        />
      </div>
    </div>
  );
}
```