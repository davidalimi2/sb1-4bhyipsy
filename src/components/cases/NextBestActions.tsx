import React from 'react';
import { FileText, AlertCircle, Scale, BookOpen } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { useNextBestActions } from '../../hooks/cases/useNextBestActions';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';

interface NextBestActionsProps {
  caseId: string;
}

export function NextBestActions({ caseId }: NextBestActionsProps) {
  const { actions, isLoading, generateAction } = useNextBestActions(caseId);

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-center py-4">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!actions?.length) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-4">
          <Scale className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No actions needed</h3>
          <p className="mt-1 text-sm text-gray-500">All current tasks are up to date</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
        <Scale className="h-5 w-5 mr-2 text-indigo-500" />
        Next Best Actions
      </h3>

      <div className="space-y-6">
        {actions.map((action, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{action.title}</h4>
                <p className="mt-1 text-sm text-gray-600">{action.description}</p>
                
                {action.deadline && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Due by {new Date(action.deadline).toLocaleDateString()}
                  </p>
                )}

                {action.citations?.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium text-gray-900 flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Legal Authority
                    </h5>
                    <ul className="mt-1 space-y-1">
                      {action.citations.map((citation, i) => (
                        <li key={i} className="text-sm text-indigo-600">
                          {citation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="ml-4">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<FileText className="h-4 w-4" />}
                  onClick={() => generateAction(action.type, action.context)}
                >
                  Generate {action.type}
                </Button>
              </div>
            </div>

            {action.explanation && (
              <div className="mt-4 text-sm text-gray-500">
                <strong>Strategy:</strong> {action.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}