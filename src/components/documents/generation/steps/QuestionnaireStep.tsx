```typescript
import React from 'react';
import { Input } from '../../../shared/ui/Input';
import { Select } from '../../../shared/ui/Select';
import { AIAssistant } from '../../ai/AIAssistant';
import type { DocumentTemplate, GenerationAnswers, TemplateQuestion } from '../../../../types/generation';

interface QuestionnaireStepProps {
  template: DocumentTemplate;
  answers: GenerationAnswers;
  onAnswersChange: (answers: GenerationAnswers) => void;
}

export function QuestionnaireStep({ 
  template, 
  answers, 
  onAnswersChange 
}: QuestionnaireStepProps) {
  const handleAnswerChange = (questionId: string, value: any) => {
    onAnswersChange({
      ...answers,
      [questionId]: value
    });
  };

  const renderQuestion = (question: TemplateQuestion) => {
    // Skip questions that depend on unmet conditions
    if (question.dependsOn && answers[question.dependsOn.questionId] !== question.dependsOn.value) {
      return null;
    }

    switch (question.type) {
      case 'text':
        return (
          <Input
            label={question.text}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
          />
        );

      case 'select':
        return (
          <Select
            label={question.text}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
        );

      case 'date':
        return (
          <Input
            type="date"
            label={question.text}
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-6">
        {template.questions.map(question => (
          <div key={question.id}>
            {renderQuestion(question)}
          </div>
        ))}
      </div>
      
      <div>
        <AIAssistant
          context={{
            templateType: template.type,
            answers,
            jurisdiction: template.jurisdiction
          }}
          onSuggestion={(suggestion) => {
            // Handle AI suggestions
          }}
        />
      </div>
    </div>
  );
}
```