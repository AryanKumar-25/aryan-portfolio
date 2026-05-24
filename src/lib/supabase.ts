import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Verify setup status
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Public client for fetching data (anon access)
export const supabasePublic = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Admin client for bypass-RLS operations on API routes (service role access)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
      })
    : null;

export function checkSupabaseStatus() {
    return {
        configured: !!isSupabaseConfigured,
        hasAdmin: !!supabaseServiceKey,
        url: supabaseUrl,
    };
}
