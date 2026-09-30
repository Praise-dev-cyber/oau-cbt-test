import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iilxeszdtjhttfmjqxxd.supabase.co';
const supabaseAnonKey = 'sb_publishable_Dtp_EXCrgXfGOA74GnJHVQ_TVRobPKv'; // Paste your full publishable key here

export const supabase = createClient(supabaseUrl, supabaseAnonKey);