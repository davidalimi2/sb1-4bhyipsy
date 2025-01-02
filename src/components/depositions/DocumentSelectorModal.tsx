import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';
import { useDocuments } from '../../hooks/useDocuments';
import { useDebounce } from '../../hooks/ui/useDebounce';

interface DocumentSelectorModalProps {
  onSelect: (documentId: string) => void;
  onClose: () => void;
  selectedIds: string[];
}

export function DocumentSelectorModal({ onSelect, onClose, selectedIds }: DocumentSelectorModalProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { documents, isLoading } = useDocuments();

  const filteredDocuments = React.useMemo(() => {
    if (!documents) return [];
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
      !selectedIds.includes(doc.id)
    );
  }, [documents, debouncedSearch, selectedIds]);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Select Document</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              icon={<Search className="h-5 w-5 text-gray-400" />}
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No documents found</div>
            ) : (
              filteredDocuments.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => onSelect(doc.id)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900">{doc.title}</div>
                  <div className="text-sm text-gray-500">
                    Added {new Date(doc.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}