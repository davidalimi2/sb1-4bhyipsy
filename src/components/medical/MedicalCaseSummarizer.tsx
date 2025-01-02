import React from 'react';
import { Plus } from 'lucide-react';
import { MedicalRecordUploader } from './MedicalRecordUploader';
import { MedicalSummary } from './MedicalSummary';
import { Button } from '../shared/ui/Button';
import { useMedicalSummary } from '../../hooks/medical/useMedicalSummary';

interface MedicalCaseSummarizerProps {
  caseId: string;
}

export function MedicalCaseSummarizer({ caseId }: MedicalCaseSummarizerProps) {
  const { 
    summary, 
    isAnalyzing,
    analyzeMedicalRecords,
    generateReport
  } = useMedicalSummary(caseId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Medical Case Summary</h2>
        {summary && (
          <Button
            onClick={generateReport}
            icon={<Plus className="h-4 w-4" />}
          >
            Generate Report
          </Button>
        )}
      </div>

      {!summary ? (
        <MedicalRecordUploader onUpload={analyzeMedicalRecords} />
      ) : (
        <MedicalSummary 
          summary={summary}
          isLoading={isAnalyzing}
        />
      )}
    </div>
  );
}