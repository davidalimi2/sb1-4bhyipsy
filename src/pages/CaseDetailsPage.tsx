import { useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { CaseDetailsHeader } from '../components/cases/details/CaseDetailsHeader';
import { CaseDocumentList } from '../components/cases/details/CaseDocumentList';
import { CaseTimeline } from '../components/cases/details/CaseTimeline'; 
import { NextBestActions } from '../components/cases/NextBestActions';
import { CaseContactManager } from '../components/contacts/case/CaseContactManager';
import { TaskManager } from '../components/tasks/TaskManager';
import { useCase } from '../hooks/useCase';
import { useCaseTimeline } from '../hooks/useCaseTimeline';
import { Button } from '../components/shared/ui/Button'; 
import { FileText, Reply, Users, ScrollText, FileSearch, Mail } from 'lucide-react';

export function CaseDetailsPage() {
  const { id = '' } = useParams();
  const { caseData, isLoading: caseLoading, error: caseError } = useCase(id);
  const { events, isLoading: timelineLoading } = useCaseTimeline(id);

  if (caseError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading case</h3>
            <div className="mt-2 text-sm text-red-700">{caseError}</div>
          </div>
        </div>
      </div>
    );
  }

  if (caseLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-32 bg-gray-200 rounded-lg" />
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Case Details</h1>

      <div className="mb-8 flex justify-between items-start">
        <CaseDetailsHeader
          caseData={caseData}
          onEdit={() => window.location.href = `/cases/${id}/edit`}
          onClose={() => {
            // TODO: Implement case closure
            console.log('Close case:', id);
          }}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Case Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="secondary"
                href={`/cases/${id}/draft-contract`}
                fullWidth
                icon={<ScrollText className="h-4 w-4" />}
              >
                Draft Contract
              </Button>
              <Button
                variant="secondary"
                href={`/cases/${id}/draft-letter`}
                fullWidth
                icon={<Mail className="h-4 w-4" />}
              >
                Draft Letter
              </Button>
              <Button
                variant="secondary"
                href={`/cases/${id}/audit-contract`}
                fullWidth
                icon={<FileSearch className="h-4 w-4" />}
              >
                Audit Contract
              </Button>
              <Button
                variant="secondary"
                href={`/cases/${id}/draft-lawsuit`}
                fullWidth
                icon={<FileText className="h-4 w-4" />}
              >
                Draft Lawsuit
              </Button>
              <Button
                variant="secondary"
                href={`/cases/${id}/answer-lawsuit`}
                fullWidth
                icon={<Reply className="h-4 w-4" />}
              >
                Answer Lawsuit
              </Button>
              <Button
                variant="secondary"
                href={`/cases/${id}/deposition`}
                fullWidth
                icon={<Users className="h-4 w-4" />}
              >
                Deposition Prep
              </Button>
            </div>
          </div>
          <NextBestActions caseId={id} />

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Documents</h3>
            <CaseDocumentList caseId={id} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <TaskManager caseId={id} />
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Discovery</h3>
            <Button
              href={`/cases/${id}/discovery`}
              variant="secondary"
              fullWidth
            >
              Go to Discovery Hub
            </Button>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Contacts</h3>
            <CaseContactManager caseId={id} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Case Analysis</h3>
              <Button
                href={`/cases/${id}/analysis`}
                variant="secondary"
                fullWidth
              >
                View Analysis
              </Button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Medical Summary</h3>
              <Button
                href={`/cases/${id}/medical`}
                variant="secondary"
                fullWidth
              >
                View Medical Summary
              </Button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Timeline</h3>
              {timelineLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-lg" />
                  ))}
                </div>
              ) : (
                <CaseTimeline events={events} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}