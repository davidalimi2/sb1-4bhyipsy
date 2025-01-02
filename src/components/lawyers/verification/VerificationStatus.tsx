```typescript
import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

interface VerificationStatusProps {
  status: 'pending' | 'verified' | 'rejected';
  message?: string;
  onRetry?: () => void;
}

export function VerificationStatus({ status, message, onRetry }: VerificationStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      title: 'Verification Pending',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800'
    },
    verified: {
      icon: CheckCircle,
      title: 'Verified',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800'
    },
    rejected: {
      icon: XCircle,
      title: 'Verification Failed',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-800'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`rounded-md ${config.bgColor} p-4`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${config.textColor}`}>
            {config.title}
          </h3>
          {message && (
            <div className="mt-2 text-sm text-gray-600">
              {message}
            </div>
          )}
          {status === 'rejected' && onRetry && (
            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={onRetry}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```