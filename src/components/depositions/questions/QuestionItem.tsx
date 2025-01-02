```typescript
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { QuestionContent } from './QuestionContent';
import type { Question } from '../../../types/deposition';

interface QuestionItemProps {
  question: Question;
  index: number;
  onUpdate: (updates: Partial<Question>) => void;
  onRemove: () => void;
}

export function QuestionItem({
  question,
  index,
  onUpdate,
  onRemove
}: QuestionItemProps) {
  return (
    <Draggable draggableId={question.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <QuestionContent
            question={question}
            onUpdate={onUpdate}
            onRemove={onRemove}
            dragHandleProps={provided.dragHandleProps}
          />
        </div>
      )}
    </Draggable>
  );
}
```