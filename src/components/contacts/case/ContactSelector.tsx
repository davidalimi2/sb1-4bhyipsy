import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';
import { useContacts } from '../../../hooks/contacts/useContacts';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import type { Contact } from '../../../types/contact';

interface ContactSelectorProps {
  onSelect: (contact: Contact) => void;
  onClose: () => void;
  excludeIds?: string[];
}

export function ContactSelector({ onSelect, onClose, excludeIds = [] }: ContactSelectorProps) {
  const { contacts, isLoading } = useContacts();
  const [search, setSearch] = useState('');

  const filteredContacts = contacts.filter(contact => {
    if (excludeIds.includes(contact.id)) return false;
    
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        contact.full_name.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.organization?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Select Contact</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            icon={<Search className="h-5 w-5 text-gray-400" />}
          />

          <div className="mt-4 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : filteredContacts.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                No contacts found
              </p>
            ) : (
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => onSelect(contact)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-900">
                      {contact.full_name}
                    </div>
                    {contact.email && (
                      <div className="text-sm text-gray-500">
                        {contact.email}
                      </div>
                    )}
                    {contact.organization && (
                      <div className="text-sm text-gray-500">
                        {contact.organization}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}