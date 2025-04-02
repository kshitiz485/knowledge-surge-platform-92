
import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials are missing. Please connect to Supabase from the Lovable interface.');
}

export const supabaseClient = createClient(supabaseUrl, supabaseKey)
