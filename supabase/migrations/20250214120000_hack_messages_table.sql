-- Create hack_messages table for code sharing functionality
-- This table stores code snippets shared through the hack page (Ctrl+Shift+H)

CREATE TABLE IF NOT EXISTS hack_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS hack_messages_created_at_idx ON hack_messages(created_at DESC);

-- Add RLS (Row Level Security) policy to allow anonymous access
ALTER TABLE hack_messages ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read hack messages
CREATE POLICY "Allow anonymous read access to hack messages"
ON hack_messages FOR SELECT
USING (true);

-- Policy to allow anyone to insert hack messages
CREATE POLICY "Allow anonymous insert access to hack messages"
ON hack_messages FOR INSERT
WITH CHECK (true);

-- Policy to allow anyone to delete hack messages (for clearing functionality)
CREATE POLICY "Allow anonymous delete access to hack messages"
ON hack_messages FOR DELETE
USING (true);

-- Add a function to automatically clean up old hack messages (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_hack_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM hack_messages 
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup every hour (if pg_cron is available)
-- Note: This requires pg_cron extension which may not be available in all environments
-- SELECT cron.schedule('cleanup-hack-messages', '0 * * * *', 'SELECT cleanup_old_hack_messages();');

-- Alternative: Add a trigger to limit the number of messages (keep only latest 100)
CREATE OR REPLACE FUNCTION limit_hack_messages()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old messages if we have more than 100
  DELETE FROM hack_messages 
  WHERE id IN (
    SELECT id FROM hack_messages 
    ORDER BY created_at DESC 
    OFFSET 100
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER limit_hack_messages_trigger
  AFTER INSERT ON hack_messages
  FOR EACH ROW
  EXECUTE FUNCTION limit_hack_messages();

-- Add comments for documentation
COMMENT ON TABLE hack_messages IS 'Stores code snippets shared through the hack page (Ctrl+Shift+H)';
COMMENT ON COLUMN hack_messages.content IS 'The actual code/text content shared by the user';
COMMENT ON COLUMN hack_messages.language IS 'Programming language for syntax highlighting (default: text)';
COMMENT ON COLUMN hack_messages.created_at IS 'Timestamp when the message was created';