import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Strictly validate that placeholder keys aren't being used and the vars exist
const isValidConfig = supabaseUrl && supabaseKey && supabaseUrl !== 'your_supabase_project_url_here';

export const supabase = isValidConfig ? createClient(supabaseUrl, supabaseKey) : null;
