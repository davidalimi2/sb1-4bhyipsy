```typescript
import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { Question } from '../../../types/deposition';

interface QuestionStatsProps {
  questions: Question[];
}

export function QuestionStats({ questions }: QuestionStatsProps) {
  const stats = React.useMemo(() => ({
    total: questions.length,
    byPriority: questions.reduce((acc, q) => ({
      ...acc,
      [q.priority]: (acc[q.priority] || 0) + 1
    }), {} as Record<string, number>),
    byCategory: questions.reduce((acc, q) => ({
      ...acc,
      [q.category]: (acc[q.category] || 0) + 1
    }), {} as Record<string, number>)
  }), [questions]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-sm font-medium text-blue-900">Total Questions</span>
        </div>
        <p className="mt-1 text-2xl font-semibold text-blue-900">{stats.total}</p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm font-medium text-green-900">High Priority</span>
        </div>
        <p className="mt-1 text-2xl font-semibold text-green-900">
          {stats.byPriority.high || 0}
        </p>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-sm font-medium text-yellow-900">Categories</span>
        </div>
        <p className="mt-1 text-2xl font-semibold text-yellow-900">
          {Object.keys(stats.byCategory).length}
        </p>
      </div>
    </div>
  );
}
```