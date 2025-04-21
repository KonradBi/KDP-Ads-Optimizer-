import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Re-export the createClient function
export { createSupabaseClient };

// Export the keys needed by the provider
export const publicSupabaseUrl = supabaseUrl;
export const publicSupabaseAnonKey = supabaseAnonKey;
