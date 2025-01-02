```typescript
import { useParams, useNavigate } from 'react-router-dom';
import { ContactDetails } from '../../components/contacts/details/ContactDetails';
import { useContact } from '../../hooks/contacts/useContact';
import { LoadingSpinner } from '../../components/shared/ui/LoadingSpinner';

export function ContactDetailsPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { contact, isLoading, deleteContact } = useContact(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Contact not found</p>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      await deleteContact();
      navigate('/contacts');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ContactDetails
        contact={contact}
        onEdit={() => navigate(`/contacts/${id}/edit`)}
        onDelete={handleDelete}
      />
    </div>
  );
}