import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Only the public/publishable key belongs in browser code; never a secret key.
export const supabase = url && key ? createClient(url, key) : null;
