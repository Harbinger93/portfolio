import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://zvpglltzybizcsldbrer.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uEyeC9MzoM-KJMJCpgAOTw_nJ1k1m6-';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
