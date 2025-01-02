import React from 'react';
import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { AIAssistant } from '../../../lawsuits/ai/AIAssistant';
import type { Template } from '../../../../types/template';

interface QuestionnaireStepProps {
  template: Template | null;
  answers: Record<string, any>;
  onAnswersChange: (answers: Record<string, any>) => void;
}

export function QuestionnaireStep({ 
  template, 
  answers, 
  onAnswersChange 
}: QuestionnaireStepProps) {
  if (!template) return null;

  const handleAnswerChange = (questionId: string, value: any) => {
    onAnswersChange({
      ...answers,
      [questionId]: value
    });
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-6">
        {template.questions.map(question => (
          <div key={question.id}>
            {question.type === 'text' && (
              <Input
                label={question.text}
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                required={question.required}
                helperText={question.helpText}
              />
            )}

            {question.type === 'select' && (
              <Select
                label={question.text}
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                required={question.required}
                helperText={question.helpText}
              >
                <option value="">Select an option</option>
                {question.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            )}

            {question.type === 'date' && (
              <Input
                type="date"
                label={question.text}
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                required={question.required}
                helperText={question.helpText}
              />
            )}
          </div>
        ))}
      </div>
      
      <div>
        <AIAssistant
          content={JSON.stringify(answers)}
          onSuggestion={(suggestion) => {
            // Handle AI suggestions
          }}
        />
      </div>
    </div>
  );
}