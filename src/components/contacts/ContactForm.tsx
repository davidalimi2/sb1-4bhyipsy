```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../shared/ui/Input';
import { Select } from '../shared/ui/Select';
import { TextArea } from '../shared/ui/TextArea';
import { Button } from '../shared/ui/Button';
import { useContacts } from '../../hooks/contacts/useContacts';
import type { Contact, NewContactData } from '../../types/contact';

interface ContactFormProps {
  initialData?: Contact;
}

export function ContactForm({ initialData }: ContactFormProps) {
  const navigate = useNavigate();
  const { createContact, updateContact } = useContacts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewContactData>({
    full_name: initialData?.full_name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    type: initialData?.type || 'client',
    organization: initialData?.organization || '',
    notes: initialData?.notes || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name) return;

    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updateContact(initialData.id, formData);
      } else {
        await createContact(formData);
      }
      navigate('/contacts');
    } catch (error) {
      console.error('Failed to save contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        required
      />

      <Input
        type="email"
        label="Email"
        value={formData.email || ''}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <Input
        type="tel"
        label="Phone"
        value={formData.phone || ''}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />

      <Select
        label="Type"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value as Contact['type'] })}
        required
      >
        <option value="client">Client</option>
        <option value="opposing_counsel">Opposing Counsel</option>
        <option value="witness">Witness</option>
        <option value="expert">Expert</option>
        <option value="other">Other</option>
      </Select>

      <Input
        label="Organization"
        value={formData.organization || ''}
        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
      />

      <TextArea
        label="Notes"
        value={formData.notes || ''}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        rows={4}
      />

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/contacts')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!formData.full_name}
        >
          {initialData ? 'Update Contact' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
}
```