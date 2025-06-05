import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FaHome, FaFacebook, FaGoogle, FaApple, FaEnvelope, FaUser, FaBuilding } from 'react-icons/fa'
import { toast } from 'react-toastify'
import supabase from '../supabase/supabase'
import { signInWithGoogle } from '../supabase/supabase'

function AuthPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'guest'
  });
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const redirectPath = location.state?.from || '/'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }
    
    setLoading(true)
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
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

      const { data: userRoleData, error: roleError } = await supabase.rpc('login_user', {
        input_email: formData.email,
        expected_role: formData.role,
      })

      if (roleError) {
        await supabase.auth.signOut()
        toast.error(roleError.message)
        return
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
    e.preventDefault();

    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const { data: exists, error: checkError } = await supabase.rpc('check_user_exists', {
        email_input: resetEmail,
      });

      if (checkError) throw checkError;

      if (!exists) {
        toast.error('No account found with this email. Please sign up first.');
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset link sent to your email!');
      setShowResetPassword(false);
      setResetEmail('');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset password email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <FaHome className="text-green-500 text-4xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold">
            {showResetPassword ? 'Reset Password' : 'Log in to Homyfy'}
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
                className="w-full text-green-500 hover:underline"
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.role === 'guest'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="guest"
                        checked={formData.role === 'guest'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <FaUser className="text-2xl mb-2 text-green-500" />
                      <span className="font-medium">Guest</span>
                      <span className="text-sm text-gray-500 text-center mt-1">
                        Book and experience stays
                      </span>
                    </label>

                    <label
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.role === 'host'
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="host"
                        checked={formData.role === 'host'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <FaBuilding className="text-2xl mb-2 text-green-500" />
                      <span className="font-medium">Host</span>
                      <span className="text-sm text-gray-500 text-center mt-1">
                        List and manage properties
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowResetPassword(true)}
                  className="text-green-500 hover:underline text-sm"
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
                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={signInWithGoogle}>
                  <FaGoogle className="text-green-500 mr-3" />
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
          <Link to="/signup" className="text-green-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;