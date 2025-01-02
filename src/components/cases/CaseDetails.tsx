import React from 'react';
import { FileText, MessageSquare, Calendar, ScrollText, FileSearch } from 'lucide-react';
import type { Case } from '../../types';

interface CaseDetailsProps {
  caseData: Case;
}

export function CaseDetails({ caseData }: CaseDetailsProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {caseData.title}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Case Details and Progress
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span className={`px-2 py-1 text-xs rounded-full ${
                caseData.status === 'open' ? 'bg-green-100 text-green-800' :
                caseData.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {caseData.status}
              </span>
            </dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(caseData.createdAt).toLocaleDateString()}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {caseData.description}
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-gray-200">
        <div className="bg-gray-50 px-4 py-5 sm:px-6">
          <div className="flex space-x-6">
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <FileText className="h-5 w-5 mr-2" />
              Documents
            </button>
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <MessageSquare className="h-5 w-5 mr-2" />
              Messages
            </button>
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <Calendar className="h-5 w-5 mr-2" />
              Timeline
            </button>
            <button 
              onClick={() => window.location.href = `/cases/${caseData.id}/audit-contract`}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FileSearch className="h-5 w-5 mr-2" />
              Audit Contract
            </button>
            <button 
              onClick={() => window.location.href = `/cases/${caseData.id}/draft-contract`}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ScrollText className="h-5 w-5 mr-2" />
              Draft Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}