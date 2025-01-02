import React from 'react';
import { DocumentCard } from '../card/DocumentCard';
import { EmptyState } from '../../shared/EmptyState';
import type { Document } from '../../../types/document';

interface DocumentListContentProps {
  documents: Document[];
  isLoading: boolean;
}

export function DocumentListContent({ documents, isLoading }: DocumentListContentProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!documents.length) {
    return (
      <EmptyState
        title="No documents found"
        description="Get started by creating your first document"
        action={{
          label: "Create Document",
          href: "/documents/new"
        }}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {documents.map(document => (
        <DocumentCard
          key={document.id}
          document={document}
        />
      ))}
    </div>
  );
}