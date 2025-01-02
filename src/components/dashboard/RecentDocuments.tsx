import React from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { DocumentCard } from '../documents/DocumentCard';
import { Plus } from 'lucide-react';

export function RecentDocuments() {
  const { documents, isLoading } = useDocuments('all');
  const recentDocuments = documents?.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
        <button
          onClick={() => window.location.href = '/documents/new'}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Document
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {recentDocuments?.map(document => (
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
    </div>
  );
}