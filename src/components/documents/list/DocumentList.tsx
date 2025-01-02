import React, { useState, useMemo } from 'react';
import { DocumentListHeader } from './DocumentListHeader';
import { DocumentListContent } from './DocumentListContent';
import { useDocuments } from '../../../hooks/useDocuments';
import { filterDocuments } from '../../../utils/documentUtils';

interface DocumentListProps {
  caseId: string;
}

export function DocumentList({ caseId }: DocumentListProps) {
  const { documents, isLoading } = useDocuments(caseId);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = useMemo(() => {
    if (!documents) return [];
    return filterDocuments(documents, searchQuery);
  }, [documents, searchQuery]);

  return (
    <div className="space-y-6">
      <DocumentListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddDocument={() => window.location.href = `/cases/${caseId}/documents/new`}
      />
      <DocumentListContent
        documents={filteredDocuments}
        isLoading={isLoading}
      />
    </div>
  );
}