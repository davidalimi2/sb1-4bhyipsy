```typescript
import { User, Mail, Phone, Building2, Calendar } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { formatDateTime } from '../../../utils/date';
import type { Contact } from '../../../types/contact';

interface ContactDetailsProps {
  contact: Contact;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ContactDetails({ contact, onEdit, onDelete }: ContactDetailsProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">{contact.full_name}</h2>
              <p className="text-sm text-gray-500">{contact.type}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            {onEdit && (
              <Button
                variant="secondary"
                onClick={onEdit}
              >
                Edit Contact
              </Button>
            )}
            {onDelete && (
              <Button
                variant="secondary"
                onClick={onDelete}
              >
                Delete Contact
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          {contact.email && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a href={`mailto:${contact.email}`} className="hover:text-indigo-600">
                  {contact.email}
                </a>
              </dd>
            </div>
          )}

          {contact.phone && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a href={`tel:${contact.phone}`} className="hover:text-indigo-600">
                  {contact.phone}
                </a>
              </dd>
            </div>
          )}

          {contact.organization && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Organization
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {contact.organization}
              </dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Added
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDateTime(contact.created_at)}
            </dd>
          </div>
        </dl>

        {contact.notes && (
          <div className="mt-6">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
              {contact.notes}
            </dd>
          </div>
        )}
      </div>
    </div>
  );
}