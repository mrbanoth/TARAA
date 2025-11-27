import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration
const isValidConfig =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseUrl !== '';

// Configure auth options for persistent sessions
export const supabase = createClient(
    isValidConfig ? supabaseUrl : 'https://placeholder.supabase.co',
    isValidConfig ? supabaseAnonKey : 'placeholder',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            storage: window.localStorage,
            storageKey: 'sb-auth-token',
            flowType: 'pkce',
            debug: process.env.NODE_ENV === 'development',
        },
    }
);

export const isSupabaseConfigured = () => isValidConfig;
