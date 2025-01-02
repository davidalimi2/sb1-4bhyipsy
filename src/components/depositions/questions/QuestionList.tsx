```typescript
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { QuestionItem } from './QuestionItem';
import { QuestionStats } from './QuestionStats';
import { QuestionGroupButton } from './QuestionGroupButton';
import { useQuestionManagement } from '../../../hooks/depositions/useQuestionManagement';
import { QUESTION_CATEGORIES } from '../../../utils/questionCategories';
import type { Question } from '../../../types/deposition';

interface QuestionListProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export function QuestionList({ questions, onChange }: QuestionListProps) {
  const {
    handleDragEnd,
    addQuestion,
    addQuestionGroup,
    updateQuestion,
    removeQuestion,
    reorderQuestions
  } = useQuestionManagement({ questions, onChange });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Questions</h3>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => reorderQuestions()}
          >
            Sort by Priority
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => addQuestion()}
          >
            Add Question
          </Button>
        </div>
      </div>

      <QuestionStats questions={questions} />

      <div className="flex flex-wrap gap-2">
        {Object.keys(QUESTION_CATEGORIES).map((category) => (
          <QuestionGroupButton
            key={category}
            category={category as keyof typeof QUESTION_CATEGORIES}
            onAdd={() => addQuestionGroup(category as keyof typeof QUESTION_CATEGORIES)}
          />
        ))}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {questions.map((question, index) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={(updates) => updateQuestion(index, updates)}
                  onRemove={() => removeQuestion(index)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
```