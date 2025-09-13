/*
  # Create Initial Chat Rooms

  1. New Data
    - Creates two anonymous chat rooms
    - Creates two authenticated chat rooms

  2. Purpose
    - Provide initial chat rooms for users to test both anonymous and authenticated chat
*/

-- Ensure chat_rooms table exists before inserting data
-- This is a safety check in case migrations run out of order
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('anonymous', 'authenticated')),
  created_at timestamptz DEFAULT now()
);

INSERT INTO chat_rooms (name, type)
VALUES 
  ('General Discussion (Anonymous)', 'anonymous'),
  ('Fun Chat (Anonymous)', 'anonymous'),
  ('Members Lounge', 'authenticated'),
  ('Verified Users Chat', 'authenticated')
ON CONFLICT DO NOTHING;