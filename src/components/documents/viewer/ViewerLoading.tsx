import React from 'react';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';

export function ViewerLoading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  );
}