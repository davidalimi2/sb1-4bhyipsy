```typescript
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuestionStatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: 'blue' | 'green' | 'yellow';
}

export function QuestionStatCard({ icon: Icon, label, value, color }: QuestionStatCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-900',
    green: 'bg-green-50 text-green-900',
    yellow: 'bg-yellow-50 text-yellow-900'
  };

  const iconColors = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500'
  };

  return (
    <div className={`p-4 rounded-lg ${colors[color]}`}>
      <div className="flex items-center">
        <Icon className={`h-5 w-5 mr-2 ${iconColors[color]}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
```