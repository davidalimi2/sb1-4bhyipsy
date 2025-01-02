```typescript
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Avatar } from '../../shared/ui/Avatar';
import { Badge } from '../../shared/ui/Badge';
import type { Lawyer } from '../../../types/lawyer';

interface LawyerHeaderProps {
  lawyer: Lawyer;
}

export function LawyerHeader({ lawyer }: LawyerHeaderProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <div className="flex items-start space-x-6">
          <Avatar name={lawyer.name} src={lawyer.avatar_url} size="xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{lawyer.name}</h1>
                <div className="mt-1 flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">{lawyer.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 text-lg font-medium text-gray-900">{lawyer.rating}</span>
                </div>
                <Badge variant="success">Available</Badge>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {lawyer.practice_areas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```