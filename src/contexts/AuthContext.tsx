import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNotifications } from '../hooks/useNotifications';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: 'prose' | 'lawyer', name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Clear any existing session first
      await supabase.auth.signOut();
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Auth error:', error);
        addNotification({
          type: 'error',
          title: 'Sign in failed',
          message: error.message === 'Invalid login credentials' 
            ? 'Invalid email or password. Please try again.'
            : error.message
        });
        throw error;
      }
      
      addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'Successfully signed in'
      });
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userType: 'prose' | 'lawyer', name: string) => {
    try {
      // Clear any existing session first
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        // Wait a moment for auth to settle
        await new Promise(resolve => setTimeout(resolve, 500));

        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            full_name: name,
            user_type: userType,
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          await supabase.auth.signOut();
          throw new Error('Failed to create user profile');
        }

        addNotification({
          type: 'success',
          title: 'Account created',
          message: 'Your account has been created successfully'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Sign up failed',
        message: error instanceof Error ? error.message : 'Failed to create account'
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      addNotification({
        type: 'success',
        title: 'Signed out',
        message: 'You have been signed out successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Sign out failed',
        message: error instanceof Error ? error.message : 'Failed to sign out'
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}