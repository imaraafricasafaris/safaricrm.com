import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with robust configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'sb-session',
    storage: {
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error('Error accessing localStorage:', error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error setting localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'safari-crm'
    }
  }
});


// Handle Supabase errors with proper error messages
export const handleSupabaseError = (error: any, customMessage?: string) => {
  console.error('Supabase error:', error);
  let errorMessage = customMessage || 'Connection error. Please try again.';

  try {
    // Handle auth session errors
    if (error.name === 'AuthSessionMissingError' || error.name === 'AuthApiError') {
      errorMessage = 'Session expired. Please sign in again.';
      supabase.auth.signOut();
      toast.error(errorMessage);
      return false;
    }
    
    // Handle specific error cases
    if (error.message?.includes('JWT')) {
      errorMessage = 'Your session has expired. Please sign in again.';
      supabase.auth.signOut();
      toast.error(errorMessage);
      return false;
    }

    if (error.message?.includes('network')) {
      errorMessage = 'Network error. Please check your connection.';
      toast.error(errorMessage);
      return false;
    }

    if (error.message?.includes('not found')) {
      errorMessage = 'Resource not found. Please try again.';
      toast.error(errorMessage);
      return false;
    }

    if (error.message?.includes('Failed to fetch')) {
      errorMessage = 'Network error. Please check your connection and try again.';
      toast.error(errorMessage);
      return false;
    }

    return false;
  } catch (e) {
    console.error('Error handling Supabase error:', e);
    toast.error('An unexpected error occurred');
    return false;
  }
  return true;
};

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('module_states')
      .select('count')
      .single();

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Supabase connection error:', error);
    handleSupabaseError(error, 'Failed to connect to database');
    return false;
  }
};