
// This file is now deprecated - use the one from integrations/supabase/client instead
import { supabase as supabaseClient } from "@/integrations/supabase/client";

// Re-export for backward compatibility
export const supabaseClient = supabaseClient;
export const isSupabaseConfigured = () => true;
