```typescript
import { Plus } from 'lucide-react';
import { useContacts } from '../../hooks/contacts/useContacts';
import { ContactCard } from './ContactCard';
import { Button } from '../shared/ui/Button';
import { LoadingSpinner } from '../shared/ui/LoadingSpinner';
import { EmptyState } from '../shared/EmptyState';

export function ContactList() {
  const { contacts, isLoading } = useContacts();

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
        description="Add your first contact to get started"
        action={{
          label: "Add Contact",
          href: "/contacts/new"
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Contacts</h2>
        <Button
          href="/contacts/new"
          icon={<Plus className="h-4 w-4" />}
        >
          Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
          />
        ))}
      </div>
    </div>
  );
}
```