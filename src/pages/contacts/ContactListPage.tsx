```typescript
import { ContactList } from '../../components/contacts/ContactList';
import { PageHeader } from '../../components/shared/ui/PageHeader';

export default function ContactListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Contacts"
        description="Manage your contacts and their case associations"
        action={{
          label: "Add Contact",
          href: "/contacts/new",
          icon: <Plus className="h-4 w-4" />
        }}
      />
      <div className="mt-8">
        <ContactList />
      </div>
    </div>
  );
}
```