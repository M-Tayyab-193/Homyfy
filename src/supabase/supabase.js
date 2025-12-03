import { createClient } from '@supabase/supabase-js'


export const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  if (error) {
    console.error('Google sign-in error:', error.message)
  } else {
    console.log('Redirecting to Google OAuth:', data?.url)
  }
}
export default supabase
