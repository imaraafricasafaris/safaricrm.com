import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase, handleSupabaseError, testConnection } from '../lib/supabase';
import { UserRole } from '../lib/api/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: UserRole | null;
  error: string | null;
  signIn: (email: string, password: string, role?: UserRole) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { companyName?: string; fullName?: string }) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [initialized, setInitialized] = useState(false);

  const getUserRole = (metadata: any): UserRole => {
    return (metadata?.role || 'company') as UserRole;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user) {
          setUser(session.user);
          const role = getUserRole(session.user.user_metadata);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (session?.user) {
        setUser(session.user);
        setUserRole(getUserRole(session.user.user_metadata));
      } else {
        setUser(null);
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: { companyName?: string; fullName?: string }) => {
    try {
      setError(null);
      setLoading(true);

      // First check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();

      if (checkError && !checkError.message.includes('No rows found')) {
        throw checkError;
      }

      if (existingUser) {
        throw new Error('User already exists');
      }

      // Attempt signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: metadata?.companyName || 'My Company',
            full_name: metadata?.fullName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      if (!data?.user) throw new Error('No user data returned');

      // Wait a bit to ensure user is created
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Account created! Please check your email.');
      return data;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      if (error.message === 'User already exists') {
        toast.error('An account with this email already exists');
      } else {
        handleSupabaseError(error, 'Failed to create account');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (data?.user) {
        setUser(data.user);
        setUserRole(getUserRole(data.user.user_metadata));
        toast.success('Signed in successfully');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      handleSupabaseError(error, 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      setUser(null);
      setUserRole(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      handleSupabaseError(error, 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      setLoading(true);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) throw resetError;

      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      console.error('Password reset error:', error);
      handleSupabaseError(error, 'Failed to send reset instructions');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setError(null);
      setLoading(true);

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Password update error:', error);
      handleSupabaseError(error, 'Failed to update password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    userRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}