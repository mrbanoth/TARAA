import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate configuration
const isValidConfig =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseUrl !== '';

export const supabase = createClient(
    isValidConfig ? supabaseUrl : 'https://placeholder.supabase.co',
    isValidConfig ? supabaseAnonKey : 'placeholder'
);

export const isSupabaseConfigured = () => isValidConfig;
