import { Plus } from 'lucide-react';
import { useCaseContacts } from '../../../hooks/contacts/useCaseContacts';
import { CaseContactCard } from './CaseContactCard';
import { Button } from '../../shared/ui/Button';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { EmptyState } from '../../shared/EmptyState';

interface CaseContactListProps {
  caseId: string;
  onAddContact?: () => void;
}

export function CaseContactList({ caseId, onAddContact }: CaseContactListProps) {
  const { contacts, isLoading, removeContact } = useCaseContacts(caseId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!contacts.length) {
    return (
      <EmptyState
        title="No contacts"
        description="Add contacts to this case"
        action={{
          label: "Add Contact",
          onClick: onAddContact
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Case Contacts</h3>
        <Button
          onClick={onAddContact}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((caseContact) => (
          <CaseContactCard
            key={caseContact.contact_id}
            caseContact={caseContact}
            onRemove={() => removeContact(caseContact.contact_id)}
          />
        ))}
      </div>
    </div>
  );
}