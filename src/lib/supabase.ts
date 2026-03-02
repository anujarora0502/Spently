import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'spently-auth-token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'implicit',
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
