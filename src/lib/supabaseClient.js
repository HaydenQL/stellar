import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT')) {
  console.warn(
    '[Stellar] Supabase not configured. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
)

/** Check if Supabase is actually configured */
export function isSupabaseConfigured() {
  return (
    !!supabaseUrl &&
    !supabaseUrl.includes('YOUR_PROJECT') &&
    !!supabaseAnonKey &&
    !supabaseAnonKey.includes('YOUR_ANON_KEY')
  )
}
