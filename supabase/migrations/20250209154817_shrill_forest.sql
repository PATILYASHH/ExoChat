/*
  # Create Initial Chat Rooms

  1. New Data
    - Creates two anonymous chat rooms
    - Creates two authenticated chat rooms

  2. Purpose
    - Provide initial chat rooms for users to test both anonymous and authenticated chat
*/

INSERT INTO chat_rooms (name, type)
VALUES 
  ('General Discussion (Anonymous)', 'anonymous'),
  ('Fun Chat (Anonymous)', 'anonymous'),
  ('Members Lounge', 'authenticated'),
  ('Verified Users Chat', 'authenticated')
ON CONFLICT DO NOTHING;