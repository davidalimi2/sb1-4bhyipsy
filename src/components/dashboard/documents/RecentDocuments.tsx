import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { useDocuments } from '../../../hooks/useDocuments';
import { DocumentCard } from '../../documents/DocumentCard';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import type { Document } from '../../../types';

export function RecentDocuments() {
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const { documents, isLoading, error } = useDocuments();

  useEffect(() => {
    if (documents) {
      setRecentDocs(documents.slice(0, 3));
    }
  }, [documents]);

  if (error) {
    return (
      <Card>
        <div className="p-4 text-red-600">
          <p>Error loading documents: {error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
        <Button
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => window.location.href = '/documents/new'}
        >
          New Document
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-4">
          {recentDocs.map(document => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      )}

      <div className="mt-6">
        <a
          href="/documents"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all documents →
        </a>
      </div>
    </Card>
  );
}