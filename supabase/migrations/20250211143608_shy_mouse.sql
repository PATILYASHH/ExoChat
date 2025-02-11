/*
  # Update messages table for name-based chat

  1. Changes
    - Remove auth-related columns
    - Add user_name column for simple name identification
    - Remove RLS policies since we're not using auth anymore
  2. Data
    - Existing messages will be preserved with a default user name
*/

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