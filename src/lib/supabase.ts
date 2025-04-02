
import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Create a custom error handler to show warning but not crash the app
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials are missing. Please connect to Supabase from the Lovable interface.');
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey)

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);
}
