import React from 'react';
import { Input } from '../shared/ui/Input';
import { Select } from '../shared/ui/Select';
import type { Question } from '../../types/lawsuit';

interface QuestionFormProps {
  questions: Question[];
  answers: Record<string, any>;
  onAnswer: (questionId: string, value: any) => void;
}

export function QuestionForm({ questions, answers, onAnswer }: QuestionFormProps) {
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            label={question.text}
            value={answers[question.id] || ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            placeholder={question.placeholder}
            required={question.required}
            helperText={question.helpText}
          />
        );
      
      case 'select':
        return (
          <Select
            label={question.text}
            value={answers[question.id] || ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            required={question.required}
            helperText={question.helpText}
          >
            <option value="">Select an option</option>
            {question.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );
      
      case 'date':
        return (
          <Input
            type="date"
            label={question.text}
            value={answers[question.id] || ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            required={question.required}
            helperText={question.helpText}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            label={question.text}
            value={answers[question.id] || ''}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            min={question.validation?.min}
            max={question.validation?.max}
            required={question.required}
            helperText={question.helpText}
          />
        );
      
      case 'boolean':
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.text}
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="true"
                  checked={answers[question.id] === true}
                  onChange={() => onAnswer(question.id, true)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="false"
                  checked={answers[question.id] === false}
                  onChange={() => onAnswer(question.id, false)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            {question.helpText && (
              <p className="text-sm text-gray-500">{question.helpText}</p>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {questions.map(question => (
        <div key={question.id}>
          {renderQuestion(question)}
        </div>
      ))}
    </div>
  );
}