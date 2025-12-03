import { motion } from 'framer-motion';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import { useNotificationsContext } from '../contexts/NotificationsContext';
import useCurrentUser from '../hooks/useCurrentUser';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

function NotificationsPage() {
  const { user } = useCurrentUser();
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotificationsContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F1520] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 mt-[98px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <motion.button
              onClick={markAllAsRead}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-[#0F1520] to-[#1a2332] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <FaCheckDouble />
              Mark all as read
            </motion.button>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">No notifications yet</p>
              <p className="text-sm mt-2">We'll notify you when something arrives</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
                className={`p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.is_read ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex gap-4">
                  {notification.listing_image && (
                    <img
                      src={notification.listing_image}
                      alt={notification.listing_title}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-gray-900">{notification.title}</h3>
                      {!notification.is_read && (
                        <div className="w-3 h-3 bg-[#0F1520] rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{notification.message}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <p className="text-sm text-gray-400">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                      {notification.listing_id && (
                        <Link
                          to={`/listings/${notification.listing_id}`}
                          className="text-sm text-[#0F1520] hover:text-[#0F1520] font-medium"
                        >
                          View listing →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default NotificationsPage;