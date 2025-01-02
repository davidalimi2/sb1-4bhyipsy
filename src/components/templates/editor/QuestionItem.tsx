import React from 'react';
import { GripVertical, Trash } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { QuestionForm } from './QuestionForm';
import type { TemplateQuestion } from '../../../types/template';

interface QuestionItemProps {
  question: TemplateQuestion;
  onUpdate: (updates: Partial<TemplateQuestion>) => void;
  onRemove: () => void;
}

export function QuestionItem({ question, onUpdate, onRemove }: QuestionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 rounded-lg p-4"
    >
      <div className="flex items-start space-x-4">
        <div
          {...attributes}
          {...listeners}
          className="mt-2 cursor-move"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <QuestionForm
            question={question}
            onChange={onUpdate}
          />
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}