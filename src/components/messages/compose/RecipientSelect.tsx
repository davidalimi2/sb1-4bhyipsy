import { User } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { useRecipientSearch } from '../../../hooks/messages/useRecipientSearch';

interface RecipientSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RecipientSelect({ value, onChange, error }: RecipientSelectProps) {
  const { recipients, isLoading } = useRecipientSearch(value);

  return (
    <div className="relative">
      <Input
        label="To"
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={<User className="h-5 w-5 text-gray-400" />}
        error={error}
        required
      />

      {value && recipients.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="max-h-60 py-1 overflow-auto text-base">
            {recipients.map((recipient) => (
              <li
                key={recipient.id}
                className="cursor-pointer select-none relative py-2 px-3 hover:bg-gray-100"
                onClick={() => onChange(recipient.email)}
              >
                <div className="flex items-center">
                  <span className="font-medium text-gray-900">
                    {recipient.full_name}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {recipient.email}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}