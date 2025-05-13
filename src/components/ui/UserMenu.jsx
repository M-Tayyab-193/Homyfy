import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import supabase from '../../supabase/supabase'
import useCurrentUser from '../../hooks/useCurrentUser'
import { FaCalendar } from 'react-icons/fa'

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
        window.location.reload()
      }, 300)
    } catch (error) {
      toast.error('Error logging out: ' + error.message)
    }
  }

  const handleAuthentication = (path) => {
    onClose()
    navigate(path)
  }

  return (
    <div 
      className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-2">
        {currentUser && (
  <>
    <div className="px-4 py-2 border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <div>
          <p className="font-medium">{currentUser.email}</p>
          <p className="text-sm text-airbnb-light">
            {currentUser.user_metadata?.role === 'host' ? 'Host' : 'Guest'}
          </p>
        </div>
      </div>
    </div>

    {currentUser.user_metadata?.role === 'host' ? (
      <>
        <Link 
          to="/hosting" 
          className="block w-full text-left px-4 py-3 hover:bg-gray-100"
          onClick={onClose}
        >
          Manage Listings
        </Link>
        <Link 
          to="/profile" 
          className="block w-full text-left px-4 py-3 hover:bg-gray-100"
          onClick={onClose}
        >
          Profile
        </Link>
      </>
    ) : (
      <Link 
        to="/profile" 
        className="block w-full text-left px-4 py-3 hover:bg-gray-100"
        onClick={onClose}
      >
        Profile
      </Link>
    )}
  </>
)}


        <div className="border-t border-gray-200 mt-1">
          <Link 
            to="/wishlist" 
            className="block w-full text-left px-4 py-3 hover:bg-gray-100"
            onClick={onClose}
          >
            Wishlist
          </Link>
          {currentUser?.user_metadata?.role === 'guest' && (
  <Link 
    to="/bookings" 
    className="block w-full text-left px-4 py-3 hover:bg-gray-100"
    onClick={onClose}
  >
    <div className="flex items-center">
      <FaCalendar className="mr-2" />
      Your Bookings
    </div>
  </Link>
)}


        </div>

        <div className="border-t border-gray-200">
          <Link 
            to="/help" 
            className="block w-full text-left px-4 py-3 hover:bg-gray-100"
            onClick={onClose}
          >
            Help
          </Link>
          {currentUser && (
            <button 
              className="w-full text-left px-4 py-3 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserMenu