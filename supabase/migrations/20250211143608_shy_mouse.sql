/*
  # Update messages table for name-based chat

  1. Changes
    - Remove auth-related columns
    - Add user_name column for simple name identification
    - Remove RLS policies since we're not using auth anymore
  2. Data
    - Existing messages will be preserved with a default user name
*/

-- Ensure tables exist before making changes
-- This is a safety check in case migrations run out of order
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('anonymous', 'authenticated')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  anonymous_name text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

-- Remove existing RLS policies
DROP POLICY IF EXISTS "Anyone can view messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can insert messages in authenticated rooms" ON messages;
DROP POLICY IF EXISTS "Anyone can insert messages in anonymous rooms" ON messages;

-- Update messages table
-- First add the column as nullable
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS user_name text;

-- Update existing messages with a default value
UPDATE messages
SET user_name = 'Anonymous User'
WHERE user_name IS NULL;

-- Now make the column required
ALTER TABLE messages
ALTER COLUMN user_name SET NOT NULL;

-- Remove old columns
ALTER TABLE messages
DROP COLUMN IF EXISTS user_id,
DROP COLUMN IF EXISTS anonymous_name;

-- Update chat_rooms table
ALTER TABLE chat_rooms
DROP COLUMN IF EXISTS type;

-- Create new RLS policy for messages
CREATE POLICY "Anyone can read or write messages"
ON messages FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create new RLS policy for chat rooms
CREATE POLICY "Anyone can read chat rooms"
ON chat_rooms FOR SELECT
TO public
USING (true);