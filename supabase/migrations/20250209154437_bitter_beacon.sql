/*
  # Chat Application Schema

  1. New Tables
    - `chat_rooms`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text) - 'anonymous' or 'authenticated'
      - `created_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `room_id` (uuid, foreign key)
      - `user_id` (uuid, nullable)
      - `anonymous_name` (text, nullable)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for reading and writing messages
    - Add policies for reading chat rooms
*/

-- Create chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('anonymous', 'authenticated')),
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  anonymous_name text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for chat rooms
CREATE POLICY "Anyone can view chat rooms"
  ON chat_rooms
  FOR SELECT
  TO public
  USING (true);

-- Policies for messages
CREATE POLICY "Anyone can view messages"
  ON messages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert messages in authenticated rooms"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT type FROM chat_rooms WHERE id = room_id) = 'authenticated'
    AND user_id = auth.uid()
    AND anonymous_name IS NULL
  );

CREATE POLICY "Anyone can insert messages in anonymous rooms"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (
    (SELECT type FROM chat_rooms WHERE id = room_id) = 'anonymous'
    AND user_id IS NULL
    AND anonymous_name IS NOT NULL
  );