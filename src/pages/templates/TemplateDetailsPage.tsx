import React from 'react';
import { useParams } from 'react-router-dom';
import { TemplatePreview } from '../../components/templates/preview/TemplatePreview';
import { VersionHistory } from '../../components/templates/versions/VersionHistory';
import { LoadingSpinner } from '../../components/shared/ui/LoadingSpinner';
import { Button } from '../../components/shared/ui/Button';
import { Edit, Download } from 'lucide-react';
import { useTemplate } from '../../hooks/templates/useTemplate';

export function TemplateDetailsPage() {
  const { id = '' } = useParams();
  const { template, isLoading } = useTemplate(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Template not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{template.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{template.description}</p>
          <div className="mt-2 flex items-center space-x-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {template.category}
            </span>
            {template.jurisdiction && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {template.jurisdiction}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            href={`/templates/${id}/edit`}
            icon={<Edit className="h-4 w-4" />}
          >
            Edit Template
          </Button>
          <Button
            variant="secondary"
            icon={<Download className="h-4 w-4" />}
            onClick={() => {
              // Handle template export
            }}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TemplatePreview template={template} />
        </div>
        <div>
          <VersionHistory 
            versions={template.versions || []}
            currentVersion={template.current_version_id}
            onRestore={(versionId) => {
              // Handle version restore
            }}
            onCompare={(sourceId, targetId) => {
              // Handle version comparison
            }}
          />
        </div>
      </div>
    </div>
  );
}