import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create and export the client-side instance
export const supabase: SupabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Create and export the admin instance (for server-side operations)
export const supabaseAdmin: SupabaseClient = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Re-export the createClient function if needed elsewhere (optional)
export { createSupabaseClient };

// Export the public keys if needed elsewhere (optional)
export const publicSupabaseUrl = supabaseUrl;
export const publicSupabaseAnonKey = supabaseAnonKey;
