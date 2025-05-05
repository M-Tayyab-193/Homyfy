import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaAirbnb } from 'react-icons/fa'
import { toast } from 'react-toastify'
import supabase from '../supabase/supabase'

function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleRecovery = async () => {
      const hash = window.location.hash
      const params = new URLSearchParams(hash.substring(1)) // fix here
  
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
  
      console.log('Access Token:', access_token)
      console.log('Refresh Token:', refresh_token)
  
      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })
  
        if (error) {
          toast.error('Invalid or expired reset link')
          navigate('/login')
          return
        }
      }
  
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Invalid or expired reset link')
        navigate('/login')
      }
    }
  
    handleRecovery()
  }, [navigate])
  
    
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      toast.success('Password updated successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <FaAirbnb className="text-airbnb-primary text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage