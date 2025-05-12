import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxkihvmmokprqrrklnxp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4a2lodm1tb2twcnFycmtsbnhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMjg3NzIsImV4cCI6MjA2MTcwNDc3Mn0.d_kr4ppLINvUnAOT8v5fB43qCpDfy08a2R4ZJJbv0UI'

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
