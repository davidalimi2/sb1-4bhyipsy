import React, { useState, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { CaseCard } from './CaseCard';
import { CaseListHeader } from './CaseListHeader';
import { useActiveCases } from '../../hooks/useActiveCases';
import { EmptyState } from '../shared/EmptyState';
import { filterCases } from '../../utils/filterUtils';
import { sortCases } from '../../utils/sortUtils';
import type { Case } from '../../types';

export function CaseList() {
  const { cases, isLoading, error } = useActiveCases();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<Case['type']>();
  const [selectedStatus, setSelectedStatus] = useState<Case['status']>();
  const [sortField, setSortField] = useState<'createdAt' | 'updatedAt' | 'title'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedCases = useMemo(() => {
    if (!cases) return [];
    
    const filtered = filterCases(cases, {
      type: selectedType,
      status: selectedStatus,
      search: searchQuery,
    });
    
    return sortCases(filtered, sortField, sortOrder);
  }, [cases, selectedType, selectedStatus, searchQuery, sortField, sortOrder]);

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading cases</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <CaseListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        onTypeChange={setSelectedType}
        onStatusChange={setSelectedStatus}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
      />

      {filteredAndSortedCases.length === 0 ? (
        <EmptyState
          title="No cases found"
          description={searchQuery || selectedType || selectedStatus 
            ? "Try adjusting your filters"
            : "Create your first case to get started"}
          action={{
            label: "Create Case",
            href: "/cases/new"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCases.map(caseData => (
            <CaseCard 
              key={caseData.id} 
              caseData={caseData}
              onEdit={() => window.location.href = `/cases/${caseData.id}/edit`}
              onDelete={() => {
                // Implement delete functionality
                console.log('Delete case:', caseData.id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}