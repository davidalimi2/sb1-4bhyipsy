import React from 'react';
import { FileText, AlertCircle, Clock } from 'lucide-react';
import { Button } from '../shared/ui/Button';

interface AIAnalysisResultsProps {
  analysis: any;
  onGenerateResponse?: () => void;
}

export function AIAnalysisResults({ analysis, onGenerateResponse }: AIAnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Summary</h3>
        <p className="text-gray-600">{analysis.summary}</p>
      </div>

      {/* Key Points */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-indigo-500" />
          Key Points
        </h3>
        <div className="space-y-4">
          {analysis.keyPoints.map((point: any, index: number) => (
            <div key={index} className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm mr-3">
                {index + 1}
              </span>
              <div>
                <p className="text-gray-900 font-medium">{point.title}</p>
                <p className="mt-1 text-sm text-gray-600">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deadlines */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-indigo-500" />
          Important Deadlines
        </h3>
        <div className="space-y-4">
          {analysis.deadlines.map((deadline: any, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                deadline.priority === 'high' ? 'bg-red-50' :
                deadline.priority === 'medium' ? 'bg-yellow-50' :
                'bg-green-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{deadline.description}</p>
                  <p className="mt-1 text-sm text-gray-600">Due: {deadline.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                  deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {deadline.priority} priority
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-indigo-500" />
          Recommendations
        </h3>
        <div className="space-y-4">
          {analysis.recommendations.map((rec: any, index: number) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm mr-3">
                {index + 1}
              </div>
              <p className="text-gray-600">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {onGenerateResponse && (
        <div className="flex justify-center">
          <Button
            onClick={onGenerateResponse}
            icon={<FileText className="h-5 w-5" />}
          >
            Generate Response Document
          </Button>
        </div>
      )}
    </div>
  );
}