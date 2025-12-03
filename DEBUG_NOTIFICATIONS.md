# Notification System Debugging Guide

## Issue: Notifications not appearing in bell icon

### Step 1: Check if notifications exist in database

Run this in Supabase SQL Editor:

```sql
-- Check all notifications in the system
SELECT 
  n.id,
  n.user_id,
  n.title,
  n.message,
  n.is_read,
  n.created_at,
  u.email as user_email
FROM notifications n
LEFT JOIN auth.users u ON u.id = n.user_id
ORDER BY n.created_at DESC
LIMIT 10;
```

### Step 2: Verify RPC function exists

```sql
-- Check if get_user_notifications function exists
SELECT 
  proname as function_name,
  prokind as function_type,
  proargnames as argument_names
FROM pg_proc 
WHERE proname = 'get_user_notifications';
```

If this returns empty, the function doesn't exist! You need to create it:

```sql
CREATE OR REPLACE FUNCTION get_user_notifications(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  message TEXT,
  type VARCHAR(50),
  listing_id UUID,
  listing_title TEXT,
  listing_image TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.user_id,
    n.title,
    n.message,
    n.type,
    n.listing_id,
    l.title as listing_title,
    (
      SELECT li.image_url 
      FROM listing_images li 
      WHERE li.listing_id = l.id 
      LIMIT 1
    ) as listing_image,
    n.is_read,
    n.created_at
  FROM notifications n
  LEFT JOIN listings l ON n.listing_id = l.id
  WHERE n.user_id = p_user_id
  ORDER BY n.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;
```

### Step 3: Check RLS Policies

```sql
-- Check if RLS is enabled on notifications table
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'notifications';

-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'notifications';
```

If no policies exist or they're too restrictive, add these:

```sql
-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" 
ON notifications FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow inserting notifications (for the booking function)
DROP POLICY IF EXISTS "Allow notification creation" ON notifications;
CREATE POLICY "Allow notification creation" 
ON notifications FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow users to update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" 
ON notifications FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);
```

### Step 4: Test the RPC function directly

```sql
-- Replace 'YOUR_HOST_USER_ID' with the actual host's UUID
SELECT * FROM get_user_notifications(
  p_user_id := 'YOUR_HOST_USER_ID'::uuid,
  p_limit := 20,
  p_offset := 0
);
```

### Step 5: Check browser console

Open browser DevTools (F12) → Console tab and look for:
- Red error messages when clicking the bell icon
- Network tab: Check if the RPC call is being made and what response it gets
- Look for CORS errors or authentication errors

### Step 6: Verify real-time subscriptions are enabled

In Supabase Dashboard → Database → Replication:
- Make sure `notifications` table has replication enabled
- If not, enable it for real-time updates to work

### Step 7: Check if booking actually created a notification

After making a booking, run:

```sql
-- Check the most recent bookings
SELECT 
  b.id,
  b.listing_id,
  b.guest_id,
  b.host_id,
  b.created_at,
  l.title as listing_title
FROM bookings b
LEFT JOIN listings l ON l.id = b.listing_id
ORDER BY b.created_at DESC
LIMIT 5;

-- Check if notification was created for these bookings
SELECT 
  n.*,
  b.id as booking_id
FROM notifications n
LEFT JOIN bookings b ON b.listing_id = n.listing_id
ORDER BY n.created_at DESC
LIMIT 5;
```

### Step 8: Verify the create_booking_with_payment function

```sql
-- Check if the function exists and has the notification insert
SELECT 
  proname,
  prosrc
FROM pg_proc 
WHERE proname = 'create_booking_with_payment';
```

The function should have this notification INSERT:

```sql
INSERT INTO notifications (user_id, title, message, type, listing_id, listing_title, listing_image)
VALUES (
  v_host_id,
  'New Booking Received!',
  v_guest_username || ' has booked ' || v_listing_title || ' from ' || p_check_in || ' to ' || p_check_out,
  'booking',
  p_listing_id,
  v_listing_title,
  v_listing_image
);
```

### Common Issues and Solutions

**Issue 1: "function does not exist"**
- Solution: Run Step 2 to create the `get_user_notifications` function

**Issue 2: "permission denied for table notifications"**
- Solution: Run Step 3 to fix RLS policies

**Issue 3: No notifications in database**
- Solution: The booking function might not be creating notifications. Check Step 8 and update the function.

**Issue 4: userId is null/undefined**
- Check: Console log in NotificationBell to verify userId prop
- Add this temporarily to NotificationBell.jsx:
```javascript
useEffect(() => {
  console.log('NotificationBell userId:', userId);
}, [userId]);
```

**Issue 5: Empty array returned but notifications exist**
- Check: RLS policies might be filtering out rows
- Test: Temporarily disable RLS to verify:
```sql
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
-- Test, then re-enable:
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

### Quick Test Command

Run this to manually insert a test notification:

```sql
-- Get your host user ID first
SELECT id, email, raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE raw_user_meta_data->>'role' = 'host';

-- Insert test notification (replace YOUR_HOST_ID)
INSERT INTO notifications (
  user_id, 
  title, 
  message, 
  type, 
  is_read
) VALUES (
  'YOUR_HOST_ID'::uuid,
  'Test Notification',
  'This is a test notification to verify the system works',
  'booking',
  false
);
```

After inserting, refresh your app and click the bell icon. If it appears, the frontend works and the issue is with the booking function not creating notifications.
