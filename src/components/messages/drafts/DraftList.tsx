import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit2 } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useDrafts } from '../../../hooks/messages/useDrafts';
import { formatDateTime } from '../../../utils/date';
import { EmptyState } from '../../shared/EmptyState';

export function DraftList() {
  const navigate = useNavigate();
  const { drafts, deleteDraft } = useDrafts();

  if (!drafts.length) {
    return (
      <EmptyState
        title="No drafts"
        description="You don't have any saved drafts"
        action={{
          label: "Compose Message",
          href: "/messages/new"
        }}
      />
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {drafts.map((draft) => (
        <div key={draft.id} className="p-4 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900">
                {draft.subject || '(No subject)'}
              </h3>
              {draft.content && (
                <p className="mt-1 text-sm text-gray-500 truncate">
                  {draft.content}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Last edited {formatDateTime(draft.last_edited)}
              </p>
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<Edit2 className="h-4 w-4" />}
                onClick={() => navigate(`/messages/drafts/${draft.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => deleteDraft(draft.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}