```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useNotifications } from '../../useNotifications';

interface LawyerVerification {
  id: string;
  lawyer: {
    id: string;
    name: string;
    email: string;
  };
  barNumber: string;
  barState: string;
  licenseDocument: string;
  createdAt: string;
}

export function useVerificationQueue() {
  const [pendingVerifications, setPendingVerifications] = useState<LawyerVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('lawyer_verifications')
          .select(`
            *,
            lawyer:lawyers(id, name, email)
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: true });

        if (error) throw error;
        setPendingVerifications(data || []);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Failed to fetch verifications'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifications();

    // Subscribe to changes
    const subscription = supabase
      .channel('lawyer_verifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'lawyer_verifications' },
        () => {
          fetchVerifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [addNotification]);

  const approveVerification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lawyer_verifications')
        .update({ 
          status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setPendingVerifications(prev => prev.filter(v => v.id !== id));
      addNotification({
        type: 'success',
        title: 'Verification approved',
        message: 'Lawyer has been verified successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to approve verification'
      });
    }
  };

  const rejectVerification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lawyer_verifications')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setPendingVerifications(prev => prev.filter(v => v.id !== id));
      addNotification({
        type: 'success',
        title: 'Verification rejected',
        message: 'Lawyer verification has been rejected'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to reject verification'
      });
    }
  };

  const downloadDocument = async (id: string) => {
    try {
      const verification = pendingVerifications.find(v => v.id === id);
      if (!verification) return;

      const { data, error } = await supabase.storage
        .from('documents')
        .download(verification.licenseDocument);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `license-${verification.barNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to download document'
      });
    }
  };

  return {
    pendingVerifications,
    isLoading,
    approveVerification,
    rejectVerification,
    downloadDocument
  };
}
```