```typescript
import React from 'react';
import { Star, MapPin, Briefcase, Award } from 'lucide-react';
import { Avatar } from '../shared/ui/Avatar';
import { Badge } from '../shared/ui/Badge';
import { Button } from '../shared/ui/Button';
import type { Lawyer } from '../../types/lawyer';

interface LawyerCardProps {
  lawyer: Lawyer;
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar
            name={lawyer.name}
            src={lawyer.avatar_url}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {lawyer.name}
              </h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">{lawyer.rating}</span>
              </div>
            </div>
            
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              {lawyer.location}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {lawyer.practice_areas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase className="h-4 w-4 mr-2" />
            {lawyer.years_experience} years experience
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Award className="h-4 w-4 mr-2" />
            {lawyer.cases_won} cases won
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium text-gray-900">${lawyer.hourly_rate}</span>
            <span className="text-gray-500">/hour</span>
          </div>
          <Button href={`/lawyers/${lawyer.id}`}>
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
```