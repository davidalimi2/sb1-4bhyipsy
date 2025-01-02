import React from 'react';
import { FileText, Clock, AlertCircle, BookOpen } from 'lucide-react';
import { useLawsuitAnalysis } from '../../../hooks/lawsuits/useLawsuitAnalysis';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { Button } from '../../shared/ui/Button';

interface LawsuitAnalyzerProps {
  content: string;
  jurisdiction: string;
  onGenerateResponse?: (response: string) => void;
}

export function LawsuitAnalyzer({
  content,
  jurisdiction,
  onGenerateResponse
}: LawsuitAnalyzerProps) {
  const { analyzeLawsuit, generateResponse, isAnalyzing } = useLawsuitAnalysis();
  const [analysis, setAnalysis] = React.useState<LawsuitAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!content) return;
    
    // Create a File object from content for analysis
    const file = new File([content], 'lawsuit.txt', { type: 'text/plain' });
    const result = await analyzeLawsuit(file);
    setAnalysis(result);
  };

  const handleGenerateResponse = async () => {
    if (!analysis) return;
    
    const response = await generateResponse(analysis.id);
    onGenerateResponse?.(response);
  };

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-500">Analyzing lawsuit...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!analysis ? (
        <div className="text-center">
          <Button onClick={handleAnalyze}>
            Analyze Lawsuit
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {/* Summary */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Summary</h3>
              <p className="mt-2 text-gray-600">{analysis.summary}</p>
            </div>

            {/* Next Steps */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                Next Steps
              </h3>
              <ul className="mt-2 space-y-2">
                {analysis.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-5 w-5 text-indigo-500">
                      {index + 1}
                    </span>
                    <span className="ml-2 text-gray-600">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                Required Documents
              </h3>
              <ul className="mt-2 space-y-2">
                {analysis.requiredDocuments.map((doc, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Deadlines */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-indigo-500" />
                Important Deadlines
              </h3>
              <div className="mt-2 space-y-3">
                {analysis.deadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 rounded-lg ${
                      deadline.priority === 'high'
                        ? 'bg-red-50 text-red-700'
                        : deadline.priority === 'medium'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    <span className="font-medium">{deadline.date}:</span>
                    <span className="ml-2">{deadline.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Citations */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                Relevant Legal Citations
              </h3>
              <div className="mt-2 space-y-4">
                {analysis.legalCitations.map((citation, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{citation.citation}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {citation.relevance}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleGenerateResponse}
              size="lg"
            >
              Generate Response
            </Button>
          </div>
        </>
      )}
    </div>
  );
}