import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FaHome, FaFacebook, FaGoogle, FaApple, FaEnvelope } from 'react-icons/fa'
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

    console.log('Login response:', data);  // Debug: Log the response data
    
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

    console.log('Authenticated user:', data.user);  // Debug: Log the authenticated user

    const { data: userRoleData, error: roleError } = await supabase.rpc('login_user', {
      input_email: formData.email,
      expected_role: formData.role,
    })

    console.log('Role check response:', userRoleData);  // Debug: Log the role data

    if (roleError) {
      await supabase.auth.signOut()
      toast.error(roleError.message)
      return
    }

    toast.success('Successfully logged in!')
    navigate(redirectPath)
  } catch (err) {
    console.error('Error:', err);  // Debug: Log the error
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

  setLoading(true); // Set loading only once at the beginning

  try {
    // Step 1: Check if user exists
    const { data: exists, error: checkError } = await supabase.rpc('check_user_exists', {
      email_input: resetEmail,
    });

    if (checkError) throw checkError;

    if (!exists) {
      toast.error('No account found with this email. Please sign up first.');
      return;
    }

    // Step 2: Proceed with reset
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
    setLoading(false); // Loading stops whether it fails or succeeds
  }
};

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <FaHome className="text-airbnb-primary text-4xl mx-auto mb-4" />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="guest"
                        checked={formData.role === 'guest'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Guest
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        value="host"
                        checked={formData.role === 'host'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Host
                    </label>
                  </div>
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
                <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={signInWithGoogle}>
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