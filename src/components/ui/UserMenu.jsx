import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import supabase from '../../supabase/supabase'
import useCurrentUser from '../../hooks/useCurrentUser'
import NotificationBadge from './NotificationBadge'
import { FaCalendar, FaHeart, FaUser, FaHome, FaSignOutAlt, FaQuestionCircle, FaCrown } from 'react-icons/fa'

function UserMenu({ onClose }) {
  const { user: currentUser, loading } = useCurrentUser()
  const navigate = useNavigate()

  if (loading) return null

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      onClose()
      toast.success('Logged out successfully!')
      setTimeout(() => {
        navigate('/') 
      }, 300)
    } catch (error) {
      toast.error('Error logging out: ' + error.message)
    }
  }

  const handleAuthentication = (path) => {
    onClose()
    navigate(path)
  }

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div 
      className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
      onClick={(e) => e.stopPropagation()}
      variants={menuVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="py-2">
        {currentUser && (
  <>
    <motion.div 
      className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 py-4"
      variants={itemVariants}
    >
      <div className="flex items-center space-x-3">
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <div className="absolute inset-0 bg-white rounded-full blur-md opacity-30"></div>
          <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <FaUser className="text-blue-500 text-lg" />
          </div>
        </motion.div>
        <div className="flex-1">
          <p className="font-semibold text-white truncate">{currentUser.email}</p>
          <div className="flex items-center gap-1.5 mt-1">
            {currentUser.user_metadata?.role === 'host' ? (
              <>
                <FaCrown className="text-yellow-300 text-xs" />
                <span className="text-xs text-blue-100 font-medium">Host Account</span>
              </>
            ) : (
              <span className="text-xs text-blue-100 font-medium">Guest Account</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>

    <div className="py-2">
      {currentUser.user_metadata?.role === 'host' ? (
        <>
          <motion.div variants={itemVariants}>
            <Link 
              to="/hosting" 
              className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors group"
              onClick={onClose}
            >
              <FaHome className="text-blue-500 group-hover:text-blue-600" />
              <span className="font-medium text-gray-700 group-hover:text-blue-600">Manage Listings</span>
            </Link>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link 
              to="/profile" 
              className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors group"
              onClick={onClose}
            >
              <FaUser className="text-blue-500 group-hover:text-blue-600" />
              <span className="font-medium text-gray-700 group-hover:text-blue-600">Profile</span>
            </Link>
          </motion.div>
        </>
      ) : (
        <motion.div variants={itemVariants}>
          <Link 
            to="/profile" 
            className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors group"
            onClick={onClose}
          >
            <FaUser className="text-blue-500 group-hover:text-blue-600" />
            <span className="font-medium text-gray-700 group-hover:text-blue-600">Profile</span>
          </Link>
        </motion.div>
      )}
    </div>
  </>
)}


        <div className="border-t border-gray-200 py-2">
          <motion.div variants={itemVariants}>
            <Link 
              to="/wishlist" 
              className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-red-50 transition-colors group relative"
              onClick={onClose}
            >
              <FaHeart className="text-red-500 group-hover:text-red-600" />
              <span className="font-medium text-gray-700 group-hover:text-red-600">Wishlist</span>
              <NotificationBadge count={0} position="top-right" color="red" />
            </Link>
          </motion.div>
          {currentUser?.user_metadata?.role === 'guest' && (
            <motion.div variants={itemVariants}>
              <Link 
                to="/bookings" 
                className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors group"
                onClick={onClose}
              >
                <FaCalendar className="text-blue-500 group-hover:text-blue-600" />
                <span className="font-medium text-gray-700 group-hover:text-blue-600">Your Bookings</span>
              </Link>
            </motion.div>
          )}
        </div>

        <div className="border-t border-gray-200 py-2">
          <motion.div variants={itemVariants}>
            <Link 
              to="/help" 
              className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors group"
              onClick={onClose}
            >
              <FaQuestionCircle className="text-gray-500 group-hover:text-gray-600" />
              <span className="font-medium text-gray-700 group-hover:text-gray-900">Help Center</span>
            </Link>
          </motion.div>
          {currentUser && (
            <motion.div variants={itemVariants}>
              <button 
                className="flex items-center gap-3 w-full text-left px-5 py-3 hover:bg-red-50 transition-colors group"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="text-red-500 group-hover:text-red-600" />
                <span className="font-medium text-gray-700 group-hover:text-red-600">Log out</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default UserMenu