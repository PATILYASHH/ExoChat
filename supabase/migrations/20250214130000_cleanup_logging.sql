-- Add cleanup logging functionality to track when cleanups run
-- This helps prevent duplicate cleanups and provides audit trail

-- Create cleanup log table
CREATE TABLE IF NOT EXISTS cleanup_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  messages_deleted bigint DEFAULT 0,
  hack_messages_deleted bigint DEFAULT 0,
  cleanup_type text DEFAULT 'manual', -- 'manual', 'auto', 'scheduled'
  created_at timestamptz DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cleanup_log_created_at ON cleanup_log(created_at DESC);

-- Function to create cleanup log table if it doesn't exist (for client-side fallback)
CREATE OR REPLACE FUNCTION create_cleanup_log_table_if_not_exists()
RETURNS void AS $$
BEGIN
  -- This function exists to allow client-side code to ensure table exists
  -- The table is already created above, so this is mostly a no-op
  -- But it prevents errors if called from client code
  NULL;
END;
$$ LANGUAGE plpgsql;

-- Enhanced daily cleanup function that logs the cleanup
CREATE OR REPLACE FUNCTION daily_cleanup()
RETURNS void AS $$
DECLARE
  regular_messages_count bigint;
  hack_messages_count bigint;
BEGIN
  -- Count messages before deletion for logging
  SELECT COUNT(*) INTO regular_messages_count FROM messages;
  SELECT COUNT(*) INTO hack_messages_count FROM hack_messages;
  
  -- Delete all regular chat messages
  DELETE FROM messages WHERE true;
  
  -- Delete all hack page messages
  DELETE FROM hack_messages WHERE true;
  
  -- Log the cleanup operation
  INSERT INTO cleanup_log (messages_deleted, hack_messages_deleted, cleanup_type)
  VALUES (regular_messages_count, hack_messages_count, 'scheduled');
  
  -- Log to system as well
  RAISE NOTICE 'Daily cleanup completed at %. Deleted % regular messages and % hack messages', 
    NOW(), regular_messages_count, hack_messages_count;
END;
$$ LANGUAGE plpgsql;

-- Enhanced manual trigger function that logs the cleanup
DROP FUNCTION IF EXISTS trigger_manual_cleanup();

CREATE OR REPLACE FUNCTION trigger_manual_cleanup()
RETURNS TABLE(
  messages_deleted bigint,
  hack_messages_deleted bigint,
  cleanup_time timestamptz
) AS $$
DECLARE
  regular_deleted_count bigint;
  hack_deleted_count bigint;
BEGIN
  -- Count messages before deletion
  SELECT COUNT(*) INTO regular_deleted_count FROM messages;
  SELECT COUNT(*) INTO hack_deleted_count FROM hack_messages;
  
  -- Perform cleanup
  DELETE FROM messages WHERE true;
  DELETE FROM hack_messages WHERE true;
  
  -- Log the cleanup operation
  INSERT INTO cleanup_log (messages_deleted, hack_messages_deleted, cleanup_type)
  VALUES (regular_deleted_count, hack_deleted_count, 'manual');
  
  -- Return results
  RETURN QUERY
  SELECT regular_deleted_count, hack_deleted_count, NOW();
END;
$$ LANGUAGE plpgsql;