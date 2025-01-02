import React, { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { DocumentCard } from './DocumentCard';
import { EmptyState } from '../shared/EmptyState';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { Input } from '../shared/ui/Input';
import { Select } from '../shared/ui/Select';
import { Search, Plus } from 'lucide-react';
import { useActiveCases } from '../../hooks/cases/useActiveCases';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/ui/Button';

export function DocumentList() {
  const navigate = useNavigate();
  const { documents, isLoading } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCase, setFilterCase] = useState<string>('all');
  const { cases } = useActiveCases();
  const { documents, isLoading } = useDocuments();

  const filteredAndSortedDocs = React.useMemo(() => {
    if (!documents) return [];
    
    let filtered = [...documents];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.type.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(doc => doc.type === filterType);
    }
    
    // Apply case filter
    if (filterCase !== 'all') {
      filtered = filtered.filter(doc => doc.case_id === filterCase);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

    return filtered;
  }, [documents, searchQuery, sortBy, filterType]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!documents?.length) {
    return (
      <EmptyState
        title="No documents"
        description="Upload or create a new document to get started"
        action={{
          label: "New Document",
          href: "/documents/new"
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Documents</h2>
        <div className="flex space-x-4">
          <Button
            href="/documents/new"
            icon={<Plus className="h-4 w-4" />}
          >
            New Document
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="h-5 w-5 text-gray-400" />}
          />
        </div>
        <div className="flex gap-4">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-40"
          >
            <option value="all">All Types</option>
            <option value="filing">Court Filings</option>
            <option value="evidence">Evidence</option>
            <option value="correspondence">Correspondence</option>
          </Select>
          <Select
            value={filterCase}
            onChange={(e) => setFilterCase(e.target.value)}
            className="w-48"
          >
            <option value="all">All Cases</option>
            {cases?.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-40"
          >
            <option value="date">Most Recent</option>
            <option value="title">Title A-Z</option>
            <option value="type">Type</option>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedDocs.map(doc => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
}