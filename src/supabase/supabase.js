import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rxwvfkpwweqggzjbvwlz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4d3Zma3B3d2VxZ2d6amJ2d2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTE5MzYsImV4cCI6MjA3OTk2NzkzNn0.Cw9u24yEUkjnNsVE7X2XbeEa1l3jc2kSit5T7E86ASo'

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
