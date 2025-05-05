import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FaAirbnb, FaFacebook, FaGoogle, FaApple, FaEnvelope } from 'react-icons/fa'
import { toast } from 'react-toastify'
import supabase from '../supabase/supabase'

function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const redirectPath = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        if (loginError.message === 'Invalid login credentials') {
          toast.error('Incorrect email or password. Please try again.')
        } else if (loginError.message === 'Email not confirmed') {
          toast.error('Please confirm your email before logging in.')
        } else {
          toast.error('Authentication failed. Please try again later.')
        }
        setError(loginError.message)
        return
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('email', email)
        .single()

      if (userError) throw userError

      if (location.pathname === '/host/login' && userData.role !== 'host') {
        await supabase.auth.signOut()
        throw new Error('This account is not registered as a host. Please use the regular login.')
      }

      if (location.pathname === '/login' && userData.role !== 'guest') {
        await supabase.auth.signOut()
        throw new Error('This account is registered as a host. Please use the host login.')
      }

      toast.success('Successfully logged in!')
      navigate(redirectPath)

    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please try again.')
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!resetEmail) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast.success('Password reset link sent to your email!')
      setShowResetPassword(false)
      setResetEmail('')
    } catch (err) {
      toast.error(err.message || 'Failed to send reset password email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <FaAirbnb className="text-airbnb-primary text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold">
            {showResetPassword ? 'Reset Password' : 'Log in to Airbnb'}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {showResetPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => setShowResetPassword(false)}
                className="w-full text-airbnb-primary hover:underline"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-airbnb-primary hover:underline text-sm"
                >
                  Forgot password?
                </button>

                <button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </form>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <div className="px-3 text-gray-500 text-sm">or</div>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaFacebook className="text-blue-600 mr-3" />
                  <span>Continue with Facebook</span>
                </button>
                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaGoogle className="text-red-500 mr-3" />
                  <span>Continue with Google</span>
                </button>
                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaApple className="mr-3" />
                  <span>Continue with Apple</span>
                </button>
                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaEnvelope className="text-gray-500 mr-3" />
                  <span>Continue with Email</span>
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-airbnb-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthPage