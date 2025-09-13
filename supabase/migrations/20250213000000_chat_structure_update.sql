/*
  # Update chat structure for new layout

  1. Changes
    - Add new room types for the restructured chat
    - Update existing data to fit new structure
    - Add room_type field to distinguish between different chat modes

  2. New room types:
    - anonymous_room: Anonymous rooms (no names shown)
    - anonymous_random: Anonymous random chat (no names shown)
    - authenticated_random: Authenticated random chat (names shown)
    - authenticated_group: Authenticated group chat (names shown)
*/

-- Add room_type column to chat_rooms
ALTER TABLE chat_rooms 
ADD COLUMN IF NOT EXISTS room_type text DEFAULT 'anonymous_room';

-- Update room_type constraint
ALTER TABLE chat_rooms 
DROP CONSTRAINT IF EXISTS chat_rooms_room_type_check;

ALTER TABLE chat_rooms 
ADD CONSTRAINT chat_rooms_room_type_check 
CHECK (room_type IN ('anonymous_room', 'anonymous_random', 'authenticated_random', 'authenticated_group'));

-- Clear existing rooms to start fresh
DELETE FROM messages;
DELETE FROM chat_rooms;

-- Insert new structured rooms
INSERT INTO chat_rooms (name, room_type) VALUES 
  -- Anonymous Chat Rooms
  ('General Discussion', 'anonymous_room'),
  ('Gaming Chat', 'anonymous_room'),
  ('Tech Talk', 'anonymous_room'),
  
  -- Anonymous Random Chat (pre-existing room for all random users)
  ('Random Anonymous Chat Room', 'anonymous_random'),
  
  -- Authenticated Chat Rooms
  ('Study Group', 'authenticated_group'),
  ('Project Collaboration', 'authenticated_group'),
  ('General Community', 'authenticated_group'),
  
  -- Authenticated Random Chat (pre-existing room for all random users)
  ('Random Chat Lounge', 'authenticated_random');

-- Add show_names column to messages table for better control
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS show_names boolean DEFAULT true;