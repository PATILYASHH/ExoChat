-- CLEAN SETUP FOR HACK PAGE - Run this if you get errors
-- This script will clean up any existing setup and recreate everything fresh

-- Step 1: Drop everything if it exists (ignore errors if they don't exist)
DROP TRIGGER IF EXISTS limit_hack_messages_trigger ON hack_messages;
DROP FUNCTION IF EXISTS limit_hack_messages();
DROP FUNCTION IF EXISTS cleanup_old_hack_messages();
DROP POLICY IF EXISTS "Allow anonymous read access to hack messages" ON hack_messages;
DROP POLICY IF EXISTS "Allow anonymous insert access to hack messages" ON hack_messages;
DROP POLICY IF EXISTS "Allow anonymous delete access to hack messages" ON hack_messages;
DROP TABLE IF EXISTS hack_messages;

-- Step 2: Create the table fresh
CREATE TABLE hack_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create index
CREATE INDEX hack_messages_created_at_idx ON hack_messages(created_at DESC);

-- Step 4: Enable RLS
ALTER TABLE hack_messages ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies
CREATE POLICY "Allow anonymous read access to hack messages"
ON hack_messages FOR SELECT
USING (true);

CREATE POLICY "Allow anonymous insert access to hack messages"
ON hack_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to hack messages"
ON hack_messages FOR DELETE
USING (true);

-- Step 6: Create cleanup function
CREATE FUNCTION cleanup_old_hack_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM hack_messages 
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create message limit function and trigger
CREATE FUNCTION limit_hack_messages()
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

-- Step 8: Insert test message
INSERT INTO hack_messages (content, language) VALUES 
('// Welcome to Hack Page!
console.log("Database setup successful!");

function testConnection() {
    return "✅ Ready to share code!";
}', 'javascript');

-- Step 9: Verify setup
SELECT 
  'Setup completed successfully!' as status,
  COUNT(*) as message_count 
FROM hack_messages;