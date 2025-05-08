import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaAirbnb } from 'react-icons/fa'
import { toast } from 'react-toastify'
import supabase from '../supabase/supabase'

function HostAuthPage({ mode = 'login' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const isLogin = mode === 'login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password || (!isLogin && (!fullname || !username || !phone))) {
      toast.error('Please fill in all fields')
      return
    }

    // Basic phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    if (!isLogin && !phoneRegex.test(phone)) {
      toast.error('Please enter a valid phone number')
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (loginError) throw loginError

        // Verify if the user is a host
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('email', email)
          .single()

        if (userError) throw userError

        if (userData.role !== 'host') {
          await supabase.auth.signOut()
          throw new Error('This account is not registered as a host')
        }

        toast.success('Successfully logged in!')
        navigate('/hosting')
      } else {
        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              fullname,
              username,
              role: 'host',
              phone
            }
          }
        })
        const user = data?.user;
        if (signupError) throw signupError

        // Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email,
            fullname,
            username,
            phone,
            role: 'host',
            profile_image: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
          }])

        if (profileError) throw profileError

        toast.success('Successfully signed up! Please check your email for verification.')
        navigate('/hosting')
      }
    } catch (err) {
      toast.error(err.message)
      setError(err.message)
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
            {isLogin ? 'Log in as a Host' : 'Become a Host'}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field"
                    placeholder="Choose a username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                  <p className="text-sm text-airbnb-light mt-1">
                    Format: +1234567890 or 123-456-7890
                  </p>
                </div>
              </>
            )}

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
                placeholder={isLogin ? "Enter your password" : "Create a password"}
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Log in' : 'Sign up'}
            </button>
          </form>
        </div>

        <p className="text-center">
          {isLogin ? (
            <>
              New to hosting?{' '}
              <Link to="/host/signup" className="text-airbnb-primary hover:underline font-medium">
                Become a Host
              </Link>
            </>
          ) : (
            <>
              Already a host?{' '}
              <Link to="/host/login" className="text-airbnb-primary hover:underline font-medium">
                Log in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

export default HostAuthPage