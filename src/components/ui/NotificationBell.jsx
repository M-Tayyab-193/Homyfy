import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheck, FaCheckDouble, FaTimes } from 'react-icons/fa';
import { useNotificationsContext } from '../../contexts/NotificationsContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function NotificationBell({ userId, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotificationsContext();
  const dropdownRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('NotificationBell rendered with:', {
      userId,
      notificationCount: notifications.length,
      unreadCount,
      loading
    });
  }, [userId, notifications.length, unreadCount, loading]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FaBell className={`text-xl ${className}`} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0F1520] to-[#1a2332] px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <motion.button
                  onClick={markAllAsRead}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <FaCheckDouble className="text-xs" />
                  Mark all read
                </motion.button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F1520] mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-3">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FaBell className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="font-medium">No notifications yet</p>
                  <p className="text-sm mt-1">We'll notify you when something arrives</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.is_read ? 'bg-gray-50' : ''
                    }`}
                    whileHover={{ x: 2 }}
                  >
                    <div className="flex gap-3">
                      {notification.listing_image && (
                        <img
                          src={notification.listing_image}
                          alt={notification.listing_title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-[#0F1520] rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <Link
                to="/notifications"
                className="block p-3 text-center text-sm text-[#0F1520] hover:bg-gray-50 font-medium border-t border-gray-200"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NotificationBell;