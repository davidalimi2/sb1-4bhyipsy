import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { CaseContactList } from './CaseContactList';
import { ContactSelector } from './ContactSelector';
import { AssignContactDialog } from './AssignContactDialog';
import { useCaseContacts } from '../../../hooks/contacts/useCaseContacts';
import type { Contact } from '../../../types/contact';

interface CaseContactManagerProps {
  caseId: string;
}

export function CaseContactManager({ caseId }: CaseContactManagerProps) {
  const { contacts, isLoading } = useCaseContacts(caseId);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Case Contacts</h2>
        <Button
          onClick={() => setShowSelector(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Contact
        </Button>
      </div>

      <CaseContactList
        contacts={contacts}
        isLoading={isLoading}
      />

      {showSelector && (
        <ContactSelector
          onSelect={(contact) => {
            setSelectedContact(contact);
            setShowSelector(false);
          }}
          onClose={() => setShowSelector(false)}
          excludeIds={contacts.map(c => c.contact_id)}
        />
      )}

      {selectedContact && (
        <AssignContactDialog
          caseId={caseId}
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onAssigned={() => {
            setSelectedContact(null);
            // Refresh contacts list
          }}
        />
      )}
    </div>
  );
}