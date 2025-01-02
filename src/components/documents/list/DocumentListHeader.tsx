import React from 'react';
import { Plus, Filter } from 'lucide-react';
import { SearchBar } from '../../search/SearchBar';

interface DocumentListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddDocument: () => void;
}

export function DocumentListHeader({ searchQuery, onSearchChange, onAddDocument }: DocumentListHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Documents</h3>
        <button
          onClick={onAddDocument}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Document
        </button>
      </div>
      <div className="flex space-x-4">
        <SearchBar 
          value={searchQuery} 
          onChange={onSearchChange}
          placeholder="Search documents..."
        />
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Filter className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}