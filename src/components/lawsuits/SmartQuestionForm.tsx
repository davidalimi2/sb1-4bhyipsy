```typescript
import React from 'react';
import { useAIAssistant } from '../../hooks/lawsuits/useAIAssistant';
import { QuestionForm } from './QuestionForm';
import { AIAssistant } from './AIAssistant';
import type { Question } from '../../types/lawsuit';

interface SmartQuestionFormProps {
  questions: Question[];
  answers: Record<string, any>;
  onAnswer: (questionId: string, value: any) => void;
}

export function SmartQuestionForm({
  questions,
  answers,
  onAnswer
}: SmartQuestionFormProps) {
  const [currentContent, setCurrentContent] = React.useState('');

  // Update content when answers change
  React.useEffect(() => {
    const content = Object.entries(answers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    setCurrentContent(content);
  }, [answers]);

  const handleSuggestionSelect = (suggestion: string) => {
    // Find the most relevant question for this suggestion
    const relevantQuestion = questions.find(q => 
      suggestion.toLowerCase().includes(q.text.toLowerCase())
    );

    if (relevantQuestion) {
      onAnswer(relevantQuestion.id, suggestion);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <QuestionForm
          questions={questions}
          answers={answers}
          onAnswer={onAnswer}
        />
      </div>
      <div>
        <AIAssistant
          content={currentContent}
          onSuggestionSelect={handleSuggestionSelect}
        />
      </div>
    </div>
  );
}
```