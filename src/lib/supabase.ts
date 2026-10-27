import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tmlltbcypqidyhigpycc.supabase.co";
const supabaseAnonKey = "sb_publishable_OrJTgVnAWKV0NfvNLucDhA_LxiSVSYq";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
