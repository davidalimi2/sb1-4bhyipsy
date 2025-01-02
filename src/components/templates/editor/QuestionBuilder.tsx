import React from 'react';
import { Plus } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '../../shared/ui/Button';
import { QuestionItem } from './QuestionItem';
import type { Template, TemplateQuestion } from '../../../types/template';

interface QuestionBuilderProps {
  template: Partial<Template>;
  onChange: (updates: Partial<Template>) => void;
}

export function QuestionBuilder({ template, onChange }: QuestionBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addQuestion = () => {
    const newQuestion: TemplateQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      type: 'text',
      required: false
    };

    onChange({
      questions: [...(template.questions || []), newQuestion]
    });
  };

  const updateQuestion = (index: number, updates: Partial<TemplateQuestion>) => {
    const newQuestions = [...(template.questions || [])];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onChange({ questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...(template.questions || [])];
    newQuestions.splice(index, 1);
    onChange({ questions: newQuestions });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    const questions = Array.from(template.questions || []);
    const oldIndex = questions.findIndex(q => q.id === active.id);
    const newIndex = questions.findIndex(q => q.id === over.id);
    
    const [reorderedItem] = questions.splice(oldIndex, 1);
    questions.splice(newIndex, 0, reorderedItem);

    onChange({ questions });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Template Questions
        </h3>
        <Button
          onClick={addQuestion}
          icon={<Plus className="h-4 w-4" />}
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
          items={template.questions?.map(q => q.id) || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {template.questions?.map((question, index) => (
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