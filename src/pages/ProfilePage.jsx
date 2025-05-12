import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaCamera, FaLock, FaSignOutAlt, FaTimes, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import supabase from '../supabase/supabase'
import axios from 'axios'

// Memoized DeleteAccountModal Component
const DeleteAccountModal = memo(({ 
  onClose, 
  onDelete, 
  loading, 
  deletePassword,
  onPasswordChange,
  inputRef
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
      <h3 className="text-xl font-semibold mb-4">Delete Account</h3>
      <p className="text-airbnb-light mb-4">
        This action cannot be undone. Please enter your password to confirm.
      </p>
      <input
        type="password"
        ref={inputRef}
        value={deletePassword}
        onChange={onPasswordChange}
        className="input-field mb-4"
        placeholder="Enter your password"
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  </div>
))

// Memoized ImageModal Component
const ImageModal = memo(({ imageUrl, email, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <FaTimes size={24} />
      </button>
      <div className="mt-6">
        <img
          src={imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${email}`}
          alt="Profile"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  </div>
))

function ProfilePage() {
  const [user, setUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  
  const fileInputRef = useRef(null)
  const deletePasswordInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('ProfilePage: Starting to fetch user data')
    const fetchUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        console.log('ProfilePage: Auth user data:', { authUser, authError })

        if (authError || !authUser) {
          console.log('ProfilePage: No authenticated user, redirecting to login')
          navigate('/login')
          return
        }

        const { data: userData, error: userError } = await supabase
          .rpc('get_user_by_id', { uid: authUser.id })
        
        console.log('ProfilePage: User data from RPC:', { userData, userError })

        if (userError) {
          console.error('ProfilePage: Error fetching user data:', userError)
          return
        }

        console.log('ProfilePage: Setting user state with:', userData[0])
        setUser(userData[0])
        setName(userData[0]?.fullname || '')
      } catch (error) {
        console.error('ProfilePage: Unexpected error:', error)
      }
    }

    fetchUser()
  }, [navigate])

  const handleDeletePasswordChange = useCallback((e) => {
    setDeletePassword(e.target.value)
  }, [])

  const handleDeleteAccount = useCallback(async () => {
    try {
      setLoading(true)
      console.log('ProfilePage: Starting account deletion process')

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword
      })

      if (signInError) {
        console.error('ProfilePage: Sign in error during deletion:', signInError)
        toast.error('Incorrect password')
        return
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.error('ProfilePage: Session error during deletion:', sessionError)
        throw new Error('Failed to retrieve access token')
      }

      console.log('ProfilePage: Making delete user request')
      const response = await fetch('https://sxkihvmmokprqrrklnxp.supabase.co/functions/v1/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId: user.id }),
        mode: 'cors',
      })

      const result = await response.json()
      console.log('ProfilePage: Delete user response:', result)

      if (!response.ok) {
        console.error('ProfilePage: Delete user error:', result.error)
        throw new Error(result.error || 'Failed to delete account')
      }

      const { error: deleteUserError } = await supabase.rpc('delete_user_data', {
        user_id: user.id
      })

      if (deleteUserError) {
        console.error('ProfilePage: Error deleting from custom users table:', deleteUserError)
        throw new Error('Failed to delete user from custom table')
      }

      await supabase.auth.signOut()
      toast.success('Account deleted successfully')
      window.location.href = '/'
    } catch (error) {
      console.error('ProfilePage: Delete account error:', error)
      toast.error('Error deleting account: ' + error.message)
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
    }
  }, [deletePassword, user])
  
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      console.log('ProfilePage: No file selected for upload')
      return
    }

    try {
      setLoading(true)
      console.log('ProfilePage: Starting image upload')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'profile_uploads')
      formData.append('folder', 'profile-images')

      const cloudinaryRes = await axios.post(
        'https://api.cloudinary.com/v1_1/tayyab193/image/upload',
        formData
      )

      console.log('ProfilePage: Cloudinary response:', cloudinaryRes.data)
      const imageUrl = cloudinaryRes.data.secure_url

      const { error: updateError } = await supabase.rpc('update_profile_image', {
        user_id: user.id,
        new_image_url: imageUrl
      })

      if (updateError) {
        console.error('ProfilePage: Error updating profile image:', updateError)
        throw updateError
      }

      console.log('ProfilePage: Profile image updated successfully')
      setUser(prev => ({ ...prev, profile_image: imageUrl }))
      toast.success('Profile picture updated successfully!')
    } catch (error) {
      console.error('ProfilePage: Image upload error:', error)
      toast.error('Error uploading image: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNameUpdate = async () => {
    try {
      setLoading(true)
      console.log('ProfilePage: Starting name update')

      const { error: updateError } = await supabase.rpc('update_fullname', {
        user_id: user.id,
        new_name: name
      })

      if (updateError) {
        console.error('ProfilePage: Error updating name:', updateError)
        throw updateError
      }

      console.log('ProfilePage: Name updated successfully')
      setUser(prev => ({ ...prev, fullname: name }))
      setEditing(false)
      toast.success('Name updated successfully!')
    } catch (error) {
      console.error('ProfilePage: Name update error:', error)
      toast.error('Error updating name: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (passwords.new !== passwords.confirm) {
      console.log('ProfilePage: Password mismatch')
      toast.error('New passwords do not match')
      return
    }

    try {
      setLoading(true)
      console.log('ProfilePage: Starting password update')

      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) {
        console.error('ProfilePage: Password update error:', error)
        throw error
      }

      console.log('ProfilePage: Password updated successfully')
      setShowPasswordModal(false)
      setPasswords({ current: '', new: '', confirm: '' })
      toast.success('Password updated successfully!')
    } catch (error) {
      console.error('ProfilePage: Password update error:', error)
      toast.error('Error updating password: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      console.log('ProfilePage: Starting logout')
      await supabase.auth.signOut()
      toast.success('Logged out successfully!')
      window.location.reload()
    } catch (error) {
      console.error('ProfilePage: Logout error:', error)
      toast.error('Error logging out: ' + error.message)
    }
  }

  if (!user) {
    console.log('ProfilePage: No user data, rendering null')
    return null
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-card overflow-hidden">
        <div className="bg-airbnb-primary text-white p-6 relative">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p>Manage your personal information</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full overflow-hidden mb-4 cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                >
                  <img
                    src={user.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                    alt={user.fullname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-0 bg-white rounded-full p-2 shadow-md text-airbnb-primary hover:text-airbnb-secondary transition-colors"
                  disabled={loading}
                >
                  <FaCamera />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-2 w-full max-w-xs">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:border-gray-500 transition-colors text-red-500"
                >
                  <FaTrash className="mr-2" />
                  <span>Delete Account</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:border-gray-500 transition-colors text-red-500"
                >
                  <FaSignOutAlt className="mr-2" />
                  <span>Log out</span>
                </button>
              </div>
            </div>

            <div className="md:w-2/3 md:pl-8">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaUser className="mr-2 text-airbnb-primary" />
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-airbnb-light">Username</p>
                    <p className="font-medium">{user.username}</p>
                  </div>

                  <div>
                    <p className="text-sm text-airbnb-light">Name</p>
                    {editing ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input-field"
                          disabled={loading}
                        />
                        <button
                          onClick={handleNameUpdate}
                          className="px-4 py-2 bg-airbnb-primary text-white rounded-lg hover:bg-opacity-90"
                          disabled={loading}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditing(false)
                            setName(user.fullname || '')
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{user.fullname}</p>
                        <button
                          onClick={() => setEditing(true)}
                          className="text-airbnb-primary hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-airbnb-light">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaLock className="mr-2 text-airbnb-primary" />
                  Password
                </h3>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="text-airbnb-primary hover:underline"
                >
                  Change password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  className="input-field"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  className="input-field"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswords({ current: '', new: '', confirm: '' })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  className="px-4 py-2 bg-airbnb-primary text-white rounded-lg hover:bg-opacity-90"
                  disabled={loading}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <ImageModal
          imageUrl={user.profile_image}
          email={user.email}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteAccount}
          loading={loading}
          deletePassword={deletePassword}
          onPasswordChange={handleDeletePasswordChange}
          inputRef={deletePasswordInputRef}
        />
      )}
    </div>
  )
}

export default ProfilePage