import React from 'react';
import { Clock, AlertCircle, FileText, Scale } from 'lucide-react';
import { useCaseProgress } from '../../../hooks/cases/useCaseProgress';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { Button } from '../../shared/ui/Button';

interface CaseProgressAnalyzerProps {
  caseId: string;
}

export function CaseProgressAnalyzer({ caseId }: CaseProgressAnalyzerProps) {
  const { analysis, isLoading, refreshAnalysis } = useCaseProgress(caseId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Case Progress</h3>
          <div className="flex items-center">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${analysis.completion_percentage}%` }}
              />
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {analysis.completion_percentage}% Complete
            </span>
          </div>
        </div>
        <p className="mt-2 text-gray-600">{analysis.status_summary}</p>
      </div>

      {/* Next Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-indigo-500" />
          Recommended Next Actions
        </h3>
        <div className="space-y-4">
          {analysis.suggested_actions.map((action, index) => (
            <div 
              key={index}
              className="flex items-start p-4 bg-gray-50 rounded-lg"
            >
              <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm mr-3">
                {index + 1}
              </span>
              <div>
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="mt-1 text-sm text-gray-600">{action.description}</p>
                {action.deadline && (
                  <p className="mt-2 text-sm text-red-600">
                    Due by: {new Date(action.deadline).toLocaleDateString()}
                  </p>
                )}
                {action.url && (
                  <Button
                    href={action.url}
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                  >
                    Take Action
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      {analysis.risk_factors.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            Risk Factors
          </h3>
          <div className="space-y-4">
            {analysis.risk_factors.map((risk, index) => (
              <div 
                key={index}
                className="flex items-start p-4 bg-red-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-red-900">{risk.factor}</p>
                  <p className="mt-1 text-sm text-red-700">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Deadlines */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Scale className="h-5 w-5 mr-2 text-indigo-500" />
          Upcoming Deadlines
        </h3>
        <div className="space-y-4">
          {analysis.next_deadlines.map((deadline, index) => (
            <div 
              key={index}
              className={`
                flex items-center justify-between p-4 rounded-lg
                ${deadline.priority === 'high' ? 'bg-red-50' :
                  deadline.priority === 'medium' ? 'bg-yellow-50' :
                  'bg-green-50'}
              `}
            >
              <div>
                <p className={`
                  font-medium
                  ${deadline.priority === 'high' ? 'text-red-900' :
                    deadline.priority === 'medium' ? 'text-yellow-900' :
                    'text-green-900'}
                `}>
                  {deadline.description}
                </p>
                <p className="text-sm text-gray-600">
                  Due: {new Date(deadline.date).toLocaleDateString()}
                </p>
              </div>
              <span className={`
                px-2 py-1 text-xs font-medium rounded-full
                ${deadline.priority === 'high' ? 'bg-red-100 text-red-800' :
                  deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'}
              `}>
                {deadline.priority} priority
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-indigo-500" />
          Required Documents
        </h3>
        <div className="space-y-4">
          {analysis.required_documents.map((doc, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{doc.title}</p>
                <p className="text-sm text-gray-600">{doc.description}</p>
              </div>
              {doc.template_url && (
                <Button
                  href={doc.template_url}
                  variant="secondary"
                  size="sm"
                >
                  Use Template
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={refreshAnalysis}
          variant="secondary"
        >
          Refresh Analysis
        </Button>
      </div>
    </div>
  );
}