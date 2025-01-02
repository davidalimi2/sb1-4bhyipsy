```typescript
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import { validateDocument } from '../../utils/documentValidation';

interface VerificationData {
  barNumber: string;
  barState: string;
  licenseDocument: File;
  additionalDocuments?: File[];
  practiceAreas: string[];
  yearsOfPractice: number;
  references?: {
    name: string;
    email: string;
    phone?: string;
    relationship: string;
  }[];
}

export function useVerification() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const submitVerification = async (data: VerificationData) => {
    try {
      setIsSubmitting(true);

      // Validate documents
      const validationResult = await validateDocument(data.licenseDocument);
      if (!validationResult.valid) {
        throw new Error(validationResult.error);
      }

      // Upload license document
      const timestamp = Date.now();
      const filePath = `verifications/${timestamp}-${data.licenseDocument.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, data.licenseDocument);

      if (uploadError) throw uploadError;

      // Create verification record
      const { error: verificationError } = await supabase
        .from('lawyer_verifications')
        .insert({
          bar_number: data.barNumber,
          bar_state: data.barState,
          license_document: filePath,
          practice_areas: data.practiceAreas,
          years_of_practice: data.yearsOfPractice,
          references: data.references,
          status: 'pending'
        });

      if (verificationError) throw verificationError;

      addNotification({
        type: 'success',
        title: 'Verification submitted',
        message: 'Your verification request has been submitted and is under review'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Verification failed',
        message: error instanceof Error ? error.message : 'Failed to submit verification'
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitVerification,
    isSubmitting
  };
}
```