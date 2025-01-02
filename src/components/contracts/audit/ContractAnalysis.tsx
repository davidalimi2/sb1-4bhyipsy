import React from 'react';
import { AlertCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ContractAnalysisProps {
  analysis: any;
}

export function ContractAnalysis({ analysis }: ContractAnalysisProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Summary</h3>
        <p className="text-gray-600">{analysis.summary}</p>
      </div>

      {/* Key Terms */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Terms</h3>
        <div className="space-y-4">
          {analysis.keyTerms.map((term: any, index: number) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">{term.title}</h4>
                <p className="text-gray-600">{term.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Potential Issues */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Potential Issues</h3>
        <div className="space-y-4">
          {analysis.issues.map((issue: any, index: number) => (
            <div key={index} className="flex items-start">
              {issue.severity === 'high' ? (
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
              )}
              <div>
                <h4 className="font-medium text-gray-900">{issue.title}</h4>
                <p className="text-gray-600">{issue.description}</p>
                {issue.recommendation && (
                  <p className="mt-1 text-sm text-gray-500">
                    Recommendation: {issue.recommendation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h3>
        <div className="space-y-4">
          {analysis.risks.map((risk: any, index: number) => (
            <div key={index} className="flex items-start">
              <AlertCircle className="h-5 w-5 text-indigo-500 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">{risk.title}</h4>
                <p className="text-gray-600">{risk.description}</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      risk.level === 'high' ? 'bg-red-500' :
                      risk.level === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${risk.probability}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}