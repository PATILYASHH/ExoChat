-- MANUAL DATABASE SETUP FOR HACK PAGE
-- Copy and paste this SQL into your Supabase SQL Editor

-- 1. Create the hack_messages table
CREATE TABLE IF NOT EXISTS hack_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create index for better performance
CREATE INDEX IF NOT EXISTS hack_messages_created_at_idx ON hack_messages(created_at DESC);

-- 3. Enable Row Level Security
ALTER TABLE hack_messages ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Allow anonymous read access to hack messages" ON hack_messages;
DROP POLICY IF EXISTS "Allow anonymous insert access to hack messages" ON hack_messages;
DROP POLICY IF EXISTS "Allow anonymous delete access to hack messages" ON hack_messages;

-- Create policies for anonymous access
CREATE POLICY "Allow anonymous read access to hack messages"
ON hack_messages FOR SELECT
USING (true);

CREATE POLICY "Allow anonymous insert access to hack messages"
ON hack_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to hack messages"
ON hack_messages FOR DELETE
USING (true);

-- 5. Create cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_hack_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM hack_messages 
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- 6. Drop existing trigger and function if they exist, then recreate
DROP TRIGGER IF EXISTS limit_hack_messages_trigger ON hack_messages;
DROP FUNCTION IF EXISTS limit_hack_messages();

-- Create trigger to limit messages (keep only latest 100)
CREATE OR REPLACE FUNCTION limit_hack_messages()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM hack_messages 
  WHERE id IN (
    SELECT id FROM hack_messages 
    ORDER BY created_at DESC 
    OFFSET 100
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER limit_hack_messages_trigger
  AFTER INSERT ON hack_messages
  FOR EACH ROW
  EXECUTE FUNCTION limit_hack_messages();

-- 7. Insert a test message to verify everything works
INSERT INTO hack_messages (content, language) VALUES 
('console.log("Hello, Hack Page!");', 'javascript');

-- 8. Verify the table was created successfully
SELECT * FROM hack_messages;