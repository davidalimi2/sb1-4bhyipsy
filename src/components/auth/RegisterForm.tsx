import React from 'react';
import { Mail, Lock, User, Scale } from 'lucide-react';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';
import { useAuthForm } from './hooks/useAuthForm';

interface RegisterFormProps {
  onError: (error: string | null) => void;
}

export function RegisterForm({ onError }: RegisterFormProps) {
  const { formData, setFormData, loading, handleSubmit } = useAuthForm(false);

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      // Clear any previous errors
      onError(null);

      // Validate password length
      if (formData.password.length < 6) {
        onError('Password must be at least 6 characters long');
        return;
      }

      // Validate user type selection
      if (!formData.userType) {
        onError('Please select whether you are self-represented or a lawyer');
        return;
      }

      try {
        await handleSubmit(e);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'An error occurred');
        // Clear password field on error
        setFormData(prev => ({ ...prev, password: '' }));
      }
    }} className="space-y-4">
      <Input
        type="text"
        label="Full Name"
        required
        autoFocus
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        icon={<User className="h-5 w-5 text-gray-400" />}
        placeholder="John Doe"
      />

      <Input
        type="email"
        label="Email"
        required
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        icon={<Mail className="h-5 w-5 text-gray-400" />}
      />

      <Input
        type="password"
        label="Password"
        required
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        icon={<Lock className="h-5 w-5 text-gray-400" />}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am a:
        </label>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={formData.userType === 'prose' ? 'primary' : 'secondary'}
            onClick={() => setFormData(prev => ({ ...prev, userType: 'prose' }))}
            icon={<User className="h-4 w-4" />}
          >
            Self-Represented
          </Button>
          <Button
            type="button"
            variant={formData.userType === 'lawyer' ? 'primary' : 'secondary'}
            onClick={() => setFormData(prev => ({ ...prev, userType: 'lawyer' }))}
            icon={<Scale className="h-4 w-4" />}
          >
            Lawyer
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        loading={loading}
        fullWidth
      >
        Create Account
      </Button>
    </form>
  );
}