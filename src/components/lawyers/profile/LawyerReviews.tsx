```typescript
import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import { Avatar } from '../../shared/ui/Avatar';
import { formatDateTime } from '../../../utils/date';

interface Review {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  rating: number;
  content: string;
  helpful_count: number;
  created_at: string;
}

interface LawyerReviewsProps {
  reviews: Review[];
}

export function LawyerReviews({ reviews }: LawyerReviewsProps) {
  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Client Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Avatar name={review.author.name} src={review.author.avatar} size="sm" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{review.author.name}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDateTime(review.created_at)}
                </span>
              </div>
              <p className="mt-4 text-gray-600">{review.content}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <button className="flex items-center hover:text-gray-700">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({review.helpful_count})
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
```