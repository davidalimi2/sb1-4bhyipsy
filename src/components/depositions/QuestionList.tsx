import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Input } from '../shared/ui/Input';
import { Select } from '../shared/ui/Select';
import { Button } from '../shared/ui/Button'; 
import { QuestionItem } from './QuestionItem';
import type { Question } from '../../types/deposition';

interface Question {
  id: string;
  text: string;
  category: string;
  importance: 'high' | 'medium' | 'low';
  notes?: string;
}

interface QuestionListProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export function QuestionList({ questions, onChange }: QuestionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addQuestion = () => {
    onChange([
      ...questions,
      {
        id: Math.random().toString(36).substr(2, 9),
        text: '',
        category: 'background',
        importance: 'medium'
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange(newQuestions);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex(q => q.id === active.id);
    const newIndex = questions.findIndex(q => q.id === over.id);
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(oldIndex, 1);
    items.splice(newIndex, 0, reorderedItem);

    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Questions</h3>
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={addQuestion}
        >
          Add Question
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map(q => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionItem
                key={question.id}
                question={question}
                onUpdate={(updates) => updateQuestion(index, updates)}
                onRemove={() => removeQuestion(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}