```typescript
import React, { useState } from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { LawyerMessageForm } from './LawyerMessageForm';
import { Dialog } from '../../shared/ui/Dialog';

interface LawyerContactCardProps {
  lawyerId: string;
  name: string;
  email: string;
  phone?: string;
  hourlyRate: number;
  availability: string;
}

export function LawyerContactCard({
  lawyerId,
  name,
  email,
  phone,
  hourlyRate,
  availability
}: LawyerContactCardProps) {
  const [showMessageForm, setShowMessageForm] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          <span className="text-lg font-semibold text-gray-900">
            ${hourlyRate}/hr
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Mail className="h-5 w-5 mr-3" />
            <a href={`mailto:${email}`} className="hover:text-indigo-600">
              {email}
            </a>
          </div>

          {phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-5 w-5 mr-3" />
              <a href={`tel:${phone}`} className="hover:text-indigo-600">
                {phone}
              </a>
            </div>
          )}

          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-3" />
            <span className="capitalize">{availability.replace('_', ' ')} Availability</span>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            onClick={() => setShowMessageForm(true)}
            fullWidth
            icon={<Mail className="h-4 w-4" />}
          >
            Send Message
          </Button>
          
          <Button
            variant="secondary"
            fullWidth
            icon={<Calendar className="h-4 w-4" />}
          >
            Schedule Consultation
          </Button>
        </div>
      </div>

      <Dialog
        open={showMessageForm}
        onClose={() => setShowMessageForm(false)}
        title={`Message ${name}`}
        maxWidth="md"
      >
        <LawyerMessageForm
          lawyerId={lawyerId}
          lawyerName={name}
          onSuccess={() => setShowMessageForm(false)}
        />
      </Dialog>
    </>
  );
}
```