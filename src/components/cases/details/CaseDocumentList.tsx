import React from 'react';
import { Plus } from 'lucide-react';
import { DocumentCard } from '../../documents/DocumentCard';
import { EmptyState } from '../../shared/EmptyState';
import { useDocuments } from '../../../hooks/useDocuments';

interface CaseDocumentListProps {
  caseId: string;
}

export function CaseDocumentList({ caseId }: CaseDocumentListProps) {
  const { documents, isLoading } = useDocuments(caseId);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!documents?.length) {
    return (
      <EmptyState
        title="No documents yet"
        description="Upload or create a new document for this case"
        action={{
          label: "Add Document",
          href: `/cases/${caseId}/documents/new`
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Documents</h3>
        <button
          onClick={() => window.location.href = `/cases/${caseId}/documents/new`}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Document
        </button>
      </div>
      <div className="grid gap-4">
        {documents.map(doc => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
}