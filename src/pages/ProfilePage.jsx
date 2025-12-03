import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUser, FaCamera, FaLock, FaTimes, FaTrash, FaEdit, FaEnvelope, FaUserTag, FaCrown } from 'react-icons/fa'
import { toast } from 'react-toastify'
import supabase from '../supabase/supabase'
import axios from 'axios'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Memoized DeleteAccountModal Component
const DeleteAccountModal = memo(({ 
  onClose, 
  onDelete, 
  loading, 
  deletePassword,
  onPasswordChange,
  inputRef
}) => (
  <motion.div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div 
      className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Delete Account</h3>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={20} />
        </motion.button>
      </div>
      <p className="text-gray-600 mb-4">
        This action cannot be undone. Please enter your password to confirm account deletion.
      </p>
      <input
        type="password"
        ref={inputRef}
        value={deletePassword}
        onChange={onPasswordChange}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
        placeholder="Enter your password"
      />
      <div className="flex gap-3">
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          onClick={onDelete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete Account'}
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
))

// Memoized ImageModal Component
const ImageModal = memo(({ imageUrl, email, onClose }) => (
  <motion.div 
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div 
      className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 relative"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors"
      >
        <FaTimes size={20} />
      </motion.button>
      <div className="mt-6">
        <img
          src={imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${email}`}
          alt="Profile"
          className="w-full h-auto rounded-xl shadow-lg"
        />
      </div>
    </motion.div>
  </motion.div>
))

function ProfilePage() {
  const [user, setUser] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
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
    const fetchUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError || !authUser) {
          navigate('/login')
          return
        }

        const { data: userData, error: userError } = await supabase
          .rpc('get_user_by_id', { uid: authUser.id })

        if (userError) {
          console.error('Error fetching user data:', userError)
          return
        }

        setUser(userData[0])
        setName(userData[0]?.fullname || '')
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        // Add a small delay to ensure smooth transition
        setTimeout(() => setPageLoading(false), 300)
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

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword
      })

      if (signInError) {
        console.error('Sign in error during deletion:', signInError)
        toast.error('Incorrect password')
        return
      }

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.error('Session error during deletion:', sessionError)
        throw new Error('Failed to retrieve access token')
      }

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

      if (!response.ok) {
        console.error('Delete user error:', result.error)
        throw new Error(result.error || 'Failed to delete account')
      }

      const { error: deleteUserError } = await supabase.rpc('delete_user_data', {
        user_id: user.id
      })

      if (deleteUserError) {
        console.error('Error deleting from custom users table:', deleteUserError)
        throw new Error('Failed to delete user from custom table')
      }

      await supabase.auth.signOut()
      toast.success('Account deleted successfully')
      window.location.href = '/'
    } catch (error) {
      console.error('Delete account error:', error)
      toast.error('Error deleting account: ' + error.message)
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
    }
  }, [deletePassword, user])
  
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'profile_uploads')
      formData.append('folder', 'profile-images')

      const cloudinaryRes = await axios.post(
        'https://api.cloudinary.com/v1_1/tayyab193/image/upload',
        formData
      )

      const imageUrl = cloudinaryRes.data.secure_url

      const { error: updateError } = await supabase.rpc('update_profile_image', {
        user_id: user.id,
        new_image_url: imageUrl
      })

      if (updateError) {
        console.error('Error updating profile image:', updateError)
        throw updateError
      }

      setUser(prev => ({ ...prev, profile_image: imageUrl }))
      toast.success('Profile picture updated successfully!')
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Error uploading image: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNameUpdate = async () => {
    try {
      setLoading(true)

      const { error: updateError } = await supabase.rpc('update_fullname', {
        user_id: user.id,
        new_name: name
      })

      if (updateError) {
        console.error('Error updating name:', updateError)
        throw updateError
      }

      setUser(prev => ({ ...prev, fullname: name }))
      setEditing(false)
      toast.success('Name updated successfully!')
    } catch (error) {
      console.error('Name update error:', error)
      toast.error('Error updating name: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match')
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      })

      if (error) {
        console.error('Password update error:', error)
        throw error
      }

      setShowPasswordModal(false)
      setPasswords({ current: '', new: '', confirm: '' })
      toast.success('Password updated successfully!')
    } catch (error) {
      console.error('Password update error:', error)
      toast.error('Error updating password: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return <LoadingSpinner fullScreen />
  }

  if (!user) {
    return null
  }

  return (
    <motion.div 
      className="container-custom py-8 min-h-screen mt-[98px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-[#0F1520] via-[#1a2332] to-[#253549] text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-gray-200">Manage your personal information and account settings</p>
          </motion.div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Picture & Account Actions */}
            <motion.div 
              className="flex flex-col items-center space-y-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Profile Picture */}
              <div className="relative group">
                <motion.div 
                  className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-xl cursor-pointer relative"
                  onClick={() => setShowImageModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F1520] to-[#1a2332] opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <img
                    src={user.profile_image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.email}`}
                    alt={user.fullname}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.button 
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute bottom-2 right-2 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  disabled={loading}
                >
                  <FaCamera size={18} />
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Account Role Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full border-2 border-gray-300 flex items-center gap-2"
              >
                {user.role === 'host' ? (
                  <>
                    <FaCrown className="text-yellow-500" />
                    <span className="font-semibold text-[#0F1520]">Host Account</span>
                  </>
                ) : (
                  <>
                    <FaUser className="#0F1520" />
                    <span className="font-semibold text-[#0F1520]">Guest Account</span>
                  </>
                )}
              </motion.div>

              {/* Delete Account Button */}
              <motion.button
                onClick={() => setShowDeleteModal(true)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <FaTrash />
                <span>Delete Account</span>
              </motion.button>
            </motion.div>

            {/* Right Column - Personal Information */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Personal Information Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#0F1520] to-[#1a2332] rounded-lg flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <span>Personal Information</span>
                </h2>

                <div className="space-y-5">
                  {/* Username */}
                  <motion.div 
                    className="bg-white p-4 rounded-xl border border-gray-200"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaUserTag className="#0F1520" />
                      <p className="text-sm font-semibold text-gray-600">Username</p>
                    </div>
                    <p className="font-medium text-gray-900 ml-6">{user.username}</p>
                  </motion.div>

                  {/* Name */}
                  <motion.div 
                    className="bg-white p-4 rounded-xl border border-gray-200"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser className="#0F1520" />
                      <p className="text-sm font-semibold text-gray-600">Full Name</p>
                    </div>
                    {editing ? (
                      <div className="flex items-center gap-2 ml-6">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F1520] focus:border-transparent"
                          disabled={loading}
                        />
                        <motion.button
                          onClick={handleNameUpdate}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                          disabled={loading}
                        >
                          Save
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setEditing(false)
                            setName(user.fullname || '')
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          disabled={loading}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between ml-6">
                        <p className="font-medium text-gray-900">{user.fullname}</p>
                        <motion.button
                          onClick={() => setEditing(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-3 py-1.5 text-[#0F1520] hover:bg-gray-50 rounded-lg transition-colors font-medium"
                        >
                          <FaEdit />
                          <span>Edit</span>
                        </motion.button>
                      </div>
                    )}
                  </motion.div>

                  {/* Email */}
                  <motion.div 
                    className="bg-white p-4 rounded-xl border border-gray-200"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <FaEnvelope className="#0F1520" />
                      <p className="text-sm font-semibold text-gray-600">Email Address</p>
                    </div>
                    <p className="font-medium text-gray-900 ml-6">{user.email}</p>
                  </motion.div>
                </div>
              </div>

              {/* Password Section */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#0F1520] to-[#1a2332] rounded-lg flex items-center justify-center">
                    <FaLock className="text-white" />
                  </div>
                  <span>Security</span>
                </h3>

                <motion.button
                  onClick={() => setShowPasswordModal(true)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <FaLock />
                  <span>Change Password</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                <motion.button
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswords({ current: '', new: '', confirm: '' })
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={20} />
                </motion.button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F1520] focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F1520] focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button
                    onClick={() => {
                      setShowPasswordModal(false)
                      setPasswords({ current: '', new: '', confirm: '' })
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handlePasswordUpdate}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showImageModal && (
          <ImageModal
            imageUrl={user.profile_image}
            email={user.email}
            onClose={() => setShowImageModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
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
      </AnimatePresence>
    </motion.div>
  )
}

export default ProfilePage