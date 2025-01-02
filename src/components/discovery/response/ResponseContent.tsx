import React from 'react';
import { FileText } from 'lucide-react';
import { formatDateTime } from '../../../utils/date';
import type { DiscoveryResponse } from '../../../types/discovery';

interface ResponseContentProps {
  response: DiscoveryResponse;
}

export function ResponseContent({ response }: ResponseContentProps) {
  return (
    <div>
      <div className="prose max-w-none text-gray-600">
        {response.content}
      </div>

      {response.documents?.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Supporting Documents
          </h4>
          <div className="grid gap-2">
            {response.documents.map((docId) => (
              <div
                key={docId}
                className="flex items-center p-2 bg-white rounded border border-gray-200"
              >
                <FileText className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Document ID: {docId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Submitted {formatDateTime(response.created_at)} by {response.created_by?.full_name}
      </div>
    </div>
  );
}