import React, { useState } from 'react';
import { FileText, Clock, MessageSquare } from 'lucide-react';
import { CaseDetailsTab } from './tabs/CaseDetailsTab';
import { CaseTimelineTab } from './tabs/CaseTimelineTab';
import { DocumentList } from '../../documents/DocumentList';
import type { Case, TimelineEvent } from '../../../types';

interface CaseDetailsTabsProps {
  caseData: Case;
  events: TimelineEvent[];
}

type TabType = 'details' | 'documents' | 'timeline';

export function CaseDetailsTabs({ caseData, events }: CaseDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('details');

  const tabs = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'documents', label: 'Documents', icon: MessageSquare },
    { id: 'timeline', label: 'Timeline', icon: Clock },
  ] as const;

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center py-4 px-1 border-b-2 text-sm font-medium
                ${activeTab === id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <Icon className="h-5 w-5 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'details' && <CaseDetailsTab caseData={caseData} />}
        {activeTab === 'documents' && <DocumentList caseId={caseData.id} />}
        {activeTab === 'timeline' && <CaseTimelineTab events={events} />}
      </div>
    </div>
  );
}