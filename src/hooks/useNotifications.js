import { useState, useEffect } from 'react';
import supabase from '../supabase/supabase';
import { toast } from 'react-toastify';

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    console.log('fetchNotifications called with userId:', userId);
    if (!userId) {
      console.log('No userId provided, skipping fetch');
      return;
    }
    
    try {
      const { data, error } = await supabase.rpc('get_user_notifications', {
        p_user_id: userId,
        p_limit: 20,
        p_offset: 0
      });

      if (error) throw error;
      
      console.log('Notifications fetched:', data);
      console.log('Number of notifications:', data?.length || 0);
      
      setNotifications(data || []);
      
      // Count unread
      const unread = data?.filter(n => !n.is_read).length || 0;
      console.log('Unread count:', unread);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      console.error('Error details:', error.message, error.details, error.hint);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase.rpc('mark_notification_read', {
        p_notification_id: notificationId
      });

      if (error) throw error;

      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase.rpc('mark_all_notifications_read', {
        p_user_id: userId
      });

      if (error) throw error;

      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Show toast notification for new notification
          toast.info(payload.new.title, {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};