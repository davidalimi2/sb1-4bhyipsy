import React from 'react';
import { ComparisonHeader } from './ComparisonHeader';
import { ComparisonContent } from './ComparisonContent';
import { ComparisonSummary } from './ComparisonSummary';
import type { ComparisonResult } from '../../types/comparison';

interface ComparisonViewProps {
  result: ComparisonResult;
  onClose: () => void;
}

export function ComparisonView({ result, onClose }: ComparisonViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
      <ComparisonHeader result={result} onClose={onClose} />
      <ComparisonSummary changes={result.changes} />
      <ComparisonContent result={result} />
    </div>
  );
}