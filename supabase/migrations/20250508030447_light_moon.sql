/*
  # Add new user fields and constraints
  
  1. Changes
    - Add username field
    - Add mobile_number field
    - Add role field with type check
    - Add unique constraint on username
*/

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS mobile_number text,
ADD COLUMN IF NOT EXISTS role text CHECK (role IN ('host', 'guest'));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);