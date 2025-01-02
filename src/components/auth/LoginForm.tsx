import React from 'react';
import { Mail, Lock } from 'lucide-react';
import { Input } from '../shared/ui/Input';
import { Button } from '../shared/ui/Button';
import { useAuthForm } from './hooks/useAuthForm';

interface LoginFormProps {
  onError: (error: string | null) => void;
}

export function LoginForm({ onError }: LoginFormProps) {
  const { formData, setFormData, loading, handleSubmit } = useAuthForm(true);

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      // Clear any previous errors
      onError(null);
      
      try {
        await handleSubmit(e);
      } catch (error) {
        // Display user-friendly error message
        onError(error instanceof Error ? error.message : 'An error occurred');
        // Clear password field on error
        setFormData(prev => ({ ...prev, password: '' }));
      }
    }} className="space-y-4">
      <Input
        type="email"
        label="Email"
        required
        autoFocus
        autoComplete="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        icon={<Mail className="h-5 w-5 text-gray-400" />}
        placeholder="you@example.com"
      />

      <Input
        type="password"
        label="Password"
        required
        autoComplete="current-password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        placeholder="Enter your password"
      />

      <Button
        type="submit"
        loading={loading}
        disabled={!formData.email || !formData.password}
        fullWidth
      >
        Sign in
      </Button>
    </form>
  );
}