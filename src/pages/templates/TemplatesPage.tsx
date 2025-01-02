import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { TemplateList } from '../../components/templates/TemplateList';
import { TemplateFilters } from '../../components/templates/TemplateFilters';
import { Button } from '../../components/shared/ui/Button';
import { LoadingSpinner } from '../../components/shared/ui/LoadingSpinner';
import { useTemplates } from '../../hooks/templates/useTemplates';
import type { TemplateCategory } from '../../types/template';

export function TemplatesPage() {
  const { templates, isLoading } = useTemplates();
  const [category, setCategory] = useState<TemplateCategory>();
  const [jurisdiction, setJurisdiction] = useState<string>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
        <Button
          href="/templates/new"
          icon={<Plus className="h-4 w-4" />}
        >
          Create Template
        </Button>
      </div>

      <TemplateFilters
        category={category}
        jurisdiction={jurisdiction}
        onCategoryChange={setCategory}
        onJurisdictionChange={setJurisdiction}
      />

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <TemplateList 
            templates={templates.filter(template => {
              if (category && template.category !== category) return false;
              if (jurisdiction && template.jurisdiction !== jurisdiction) return false;
              return true;
            })} 
          />
        )}
      </div>
    </div>
  );
}