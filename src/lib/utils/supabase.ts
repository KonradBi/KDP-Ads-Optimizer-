import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client-side Supabase client (anon key) for API routes or SSR
export const supabase: SupabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (service role key) only when running on the server
export let supabaseAdmin: SupabaseClient;
if (typeof window === 'undefined') {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for server-side client');
  }
  supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// Re-export the createClient function and public keys
export { createSupabaseClient };

export const publicSupabaseUrl = supabaseUrl;
export const publicSupabaseAnonKey = supabaseAnonKey;
