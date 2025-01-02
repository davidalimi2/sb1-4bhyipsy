```typescript
import React from 'react';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { useVerificationQueue } from '../../../hooks/lawyers/admin/useVerificationQueue';

export function VerificationQueue() {
  const { 
    pendingVerifications, 
    isLoading,
    approveVerification,
    rejectVerification,
    downloadDocument
  } = useVerificationQueue();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Verification Queue</h2>
        <span className="bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-sm font-medium">
          {pendingVerifications.length} Pending
        </span>
      </div>

      {pendingVerifications.length === 0 ? (
        <Card>
          <div className="p-6 text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending verifications</h3>
            <p className="mt-1 text-sm text-gray-500">All verification requests have been processed</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingVerifications.map((verification) => (
            <Card key={verification.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{verification.lawyer.name}</h3>
                    <div className="mt-1 text-sm text-gray-500">
                      <p>Bar Number: {verification.barNumber}</p>
                      <p>State: {verification.barState}</p>
                      <p>Submitted: {new Date(verification.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<FileText className="h-4 w-4" />}
                    onClick={() => downloadDocument(verification.id)}
                  >
                    View Document
                  </Button>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<XCircle className="h-4 w-4" />}
                    onClick={() => rejectVerification(verification.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    icon={<CheckCircle className="h-4 w-4" />}
                    onClick={() => approveVerification(verification.id)}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```