import { useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../hooks/useNotifications';

interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  userType?: 'prose' | 'lawyer';
}

export function useAuthForm(isLogin: boolean) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
    userType: 'prose'
  });
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuthContext();
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        if (!formData.name || !formData.userType) {
          throw new Error('Please fill in all fields');
        }
        await signUp(formData.email, formData.password, formData.userType, formData.name);
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Authentication error',
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    handleSubmit
  };
}