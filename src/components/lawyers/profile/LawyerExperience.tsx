```typescript
import React from 'react';
import { Briefcase, Award } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import type { Lawyer } from '../../../types/lawyer';

interface LawyerExperienceProps {
  lawyer: Lawyer;
}

export function LawyerExperience({ lawyer }: LawyerExperienceProps) {
  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Experience</h2>
        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <Briefcase className="h-5 w-5 mr-2" />
            <span>{lawyer.years_experience} years of legal experience</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Award className="h-5 w-5 mr-2" />
            <span>{lawyer.cases_won} cases won</span>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Practice Areas</h3>
            <div className="flex flex-wrap gap-2">
              {lawyer.practice_areas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {lawyer.languages.map((language) => (
                <span
                  key={language}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
```