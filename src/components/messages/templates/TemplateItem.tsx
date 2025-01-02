```typescript
import { FileText, Edit, Trash } from 'lucide-react';
import { useTemplateStore } from '../../../stores/templateStore';
import { Button } from '../../shared/ui/Button';
import type { MessageTemplate } from '../../../types/message';

interface TemplateItemProps {
  template: MessageTemplate;
}

export function TemplateItem({ template }: TemplateItemProps) {
  const { deleteTemplate } = useTemplateStore();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.subject}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            href={`/settings/templates/${template.id}/edit`}
            icon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => deleteTemplate(template.id)}
            icon={<Trash className="h-4 w-4" />}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
```