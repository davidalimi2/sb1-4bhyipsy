import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useContractAnalysis } from '../../../hooks/contracts/useContractAnalysis';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';

interface ContractUploaderProps {
  caseId: string;
  onAnalysisComplete: (analysis: any) => void;
}

export function ContractUploader({ caseId, onAnalysisComplete }: ContractUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { analyzeContract, isAnalyzing } = useContractAnalysis();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    const analysis = await analyzeContract(selectedFile, caseId);
    if (analysis) {
      onAnalysisComplete(analysis);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Upload Contract</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload a contract document for AI-powered analysis
          </p>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Contract Document
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX or TXT up to 10MB
              </p>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-900">{selectedFile.name}</span>
              <span className="ml-2 text-xs text-gray-500">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button
              onClick={handleAnalyze}
              loading={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Analyzing...
                </>
              ) : (
                'Analyze Contract'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}