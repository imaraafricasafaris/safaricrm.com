import { createClient } from '@supabase/supabase-js';
import { AuthApiError } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const handleSupabaseError = (error: unknown, defaultMessage: string = 'An error occurred') => {
  console.error('Supabase error:', error);

  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        if (error.message.includes('User already registered')) {
          toast.error('An account with this email already exists');
        } else if (error.message.includes('Password')) {
          toast.error('Password must be at least 8 characters long');
        } else {
          toast.error(error.message);
        }
        break;
      case 401:
        toast.error('Invalid credentials');
        break;
      case 422:
        toast.error('Invalid email format');
        break;
      default:
        toast.error(defaultMessage);
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(defaultMessage);
  }
};

export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('companies').select('id').limit(1);
    if (error) throw error;
    console.log('Supabase connection test:', { data });
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};