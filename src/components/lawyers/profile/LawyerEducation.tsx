```typescript
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import type { Lawyer } from '../../../types/lawyer';

interface LawyerEducationProps {
  lawyer: Lawyer;
}

export function LawyerEducation({ lawyer }: LawyerEducationProps) {
  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Education</h2>
        <div className="space-y-4">
          {lawyer.education.map((edu, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <p className="font-medium text-gray-900">{edu.school}</p>
                <p className="text-gray-600">{edu.degree}</p>
              </div>
              <p className="text-gray-500">{edu.year}</p>
            </div>
          ))}
        </div>

        {lawyer.certifications?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Certifications</h3>
            <div className="space-y-3">
              {lawyer.certifications.map((cert, index) => (
                <div key={index}>
                  <p className="font-medium text-gray-900">{cert.name}</p>
                  <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
```