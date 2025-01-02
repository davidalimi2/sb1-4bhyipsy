```typescript
import { Plus } from 'lucide-react';
import { useTemplateStore } from '../../../stores/templateStore';
import { TemplateItem } from './TemplateItem';
import { Button } from '../../shared/ui/Button';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { EmptyState } from '../../shared/EmptyState';

export function TemplateList() {
  const { templates, isLoading } = useTemplateStore();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!templates.length) {
    return (
      <EmptyState
        title="No templates"
        description="Create message templates to save time"
        action={{
          label: "Create Template",
          href: "/settings/templates/new"
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Message Templates</h2>
        <Button
          href="/settings/templates/new"
          icon={<Plus className="h-4 w-4" />}
        >
          New Template
        </Button>
      </div>

      <div className="space-y-4">
        {templates.map((template) => (
          <TemplateItem
            key={template.id}
            template={template}
          />
        ))}
      </div>
    </div>
  );
}
```