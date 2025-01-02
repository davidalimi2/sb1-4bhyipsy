import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Button } from '../../shared/ui/Button';
import { useCaseContactAssignment } from '../../../hooks/contacts/useCaseContactAssignment';
import type { Contact } from '../../../types/contact';

interface AssignContactDialogProps {
  caseId: string;
  contact: Contact;
  onClose: () => void;
  onAssigned?: () => void;
}

export function AssignContactDialog({ 
  caseId, 
  contact, 
  onClose,
  onAssigned 
}: AssignContactDialogProps) {
  const { assignContact, isAssigning } = useCaseContactAssignment(caseId);
  const [role, setRole] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    await assignContact({
      contactId: contact.id,
      role,
      notes: notes.trim() || undefined
    });

    onAssigned?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Assign Contact to Case</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <div className="text-sm text-gray-900">{contact.full_name}</div>
            <div className="text-sm text-gray-500">{contact.email}</div>
          </div>

          <Select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select a role...</option>
            <option value="client">Client</option>
            <option value="opposing_counsel">Opposing Counsel</option>
            <option value="witness">Witness</option>
            <option value="expert">Expert</option>
            <option value="other">Other</option>
          </Select>

          <Input
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any relevant notes about this contact's role"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isAssigning}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isAssigning}
              disabled={!role}
            >
              Assign Contact
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}