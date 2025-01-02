import React from 'react';
import { Activity, Calendar, AlertCircle, FileText } from 'lucide-react';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import type { MedicalSummary as MedicalSummaryType } from '../../types/medical';

interface MedicalSummaryProps {
  summary: MedicalSummaryType;
  isLoading: boolean;
}

export function MedicalSummary({ summary, isLoading }: MedicalSummaryProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Findings */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-indigo-500" />
          Key Medical Findings
        </h3>
        <div className="space-y-4">
          {summary.keyFindings.map((finding, index) => (
            <div key={index} className="border-l-4 border-indigo-500 pl-4">
              <p className="font-medium text-gray-900">{finding.condition}</p>
              <p className="mt-1 text-gray-600">{finding.description}</p>
              {finding.severity && (
                <span className={`
                  mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${finding.severity === 'high' ? 'bg-red-100 text-red-800' :
                    finding.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'}
                `}>
                  {finding.severity} severity
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
          Medical Timeline
        </h3>
        <div className="flow-root">
          <ul className="-mb-8">
            {summary.timeline.map((event, idx) => (
              <li key={idx}>
                <div className="relative pb-8">
                  {idx !== summary.timeline.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                      <FileText className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-900">{event.description}</p>
                        {event.provider && (
                          <p className="text-sm text-gray-500">{event.provider}</p>
                        )}
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        {event.date}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      {summary.recommendations.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-indigo-500" />
            Legal Recommendations
          </h3>
          <ul className="space-y-4">
            {summary.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-600">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}