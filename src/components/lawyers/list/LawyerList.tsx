import React from 'react';
import { LawyerCard } from '../LawyerCard';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { EmptyState } from '../../shared/EmptyState';
import type { Lawyer } from '../../../types/lawyer';

interface LawyerListProps {
  lawyers: Lawyer[];
  isLoading: boolean;
  searchQuery: string;
}

export function LawyerList({ lawyers, isLoading, searchQuery }: LawyerListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!lawyers.length) {
    return (
      <EmptyState
        title="No lawyers found"
        description={searchQuery ? "Try adjusting your search criteria" : "No lawyers are currently available"}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lawyers.map((lawyer) => (
        <LawyerCard key={lawyer.id} lawyer={lawyer} />
      ))}
    </div>
  );
}