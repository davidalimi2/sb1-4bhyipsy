import { User, Mail, Phone, Building2, X } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import type { CaseContact } from '../../../types/contact';

interface CaseContactCardProps {
  caseContact: CaseContact;
  onRemove?: () => void;
}

export function CaseContactCard({ caseContact, onRemove }: CaseContactCardProps) {
  const contact = caseContact.contact;
  if (!contact) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">{contact.full_name}</h3>
            <p className="text-sm text-gray-500">{caseContact.role}</p>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {contact.email && (
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-gray-400 mr-2" />
            <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-gray-900">
              {contact.email}
            </a>
          </div>
        )}
        
        {contact.phone && (
          <div className="flex items-center text-sm">
            <Phone className="h-4 w-4 text-gray-400 mr-2" />
            <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-gray-900">
              {contact.phone}
            </a>
          </div>
        )}

        {contact.organization && (
          <div className="flex items-center text-sm">
            <Building2 className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">{contact.organization}</span>
          </div>
        )}
      </div>

      {caseContact.notes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">{caseContact.notes}</p>
        </div>
      )}
    </div>
  );
}