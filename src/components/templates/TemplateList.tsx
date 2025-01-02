import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../shared/ui/Badge';
import type { Template } from '../../types/template';

interface TemplateListProps {
  templates: Template[];
  category?: string;
}

export function TemplateList({ templates, category }: TemplateListProps) {
  const filteredTemplates = category 
    ? templates.filter(t => t.category === category)
    : templates;

  return (
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      {filteredTemplates.map((template) => (
        <Link
          key={template.id}
          to={'/templates/' + template.id}
          className="block hover:bg-gray-50"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400" />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    {template.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {template.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {template.jurisdiction && (
                  <Badge variant="default">
                    {template.jurisdiction}
                  </Badge>
                )}
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}