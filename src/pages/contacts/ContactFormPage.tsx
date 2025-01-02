```typescript
import { useParams } from 'react-router-dom';
import { ContactForm } from '../../components/contacts/ContactForm';
import { useContact } from '../../hooks/contacts/useContact';
import { LoadingSpinner } from '../../components/shared/ui/LoadingSpinner';

export default function ContactFormPage() {
  const { id } = useParams();
  const { contact, isLoading } = useContact(id);

  if (id && isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {id ? 'Edit Contact' : 'New Contact'}
      </h1>
      <div className="bg-white shadow rounded-lg p-6">
        <ContactForm initialData={contact} />
      </div>
    </div>
  );
}
```