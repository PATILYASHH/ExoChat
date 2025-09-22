-- Run this SQL in your Supabase dashboard to enable hack messages cleanup
-- Copy and paste this entire script into the Supabase SQL Editor

-- Update daily cleanup system to include hack_messages table
-- This extends the existing cleanup system to also clear hack page messages

-- First, drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS trigger_manual_cleanup();
DROP FUNCTION IF EXISTS clear_hack_messages();

-- Enhanced cleanup function that clears both regular messages and hack messages
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
  
  -- Log the cleanup operation with counts
  RAISE NOTICE 'Daily cleanup completed at %. Deleted % regular messages and % hack messages', 
    NOW(), regular_messages_count, hack_messages_count;
END;
$$ LANGUAGE plpgsql;

-- Enhanced manual trigger function that includes hack_messages
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
  PERFORM daily_cleanup();
  
  -- Return results
  RETURN QUERY
  SELECT regular_deleted_count, hack_deleted_count, NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to manually clear only hack messages (for the delete button)
CREATE OR REPLACE FUNCTION clear_hack_messages()
RETURNS TABLE(
  messages_deleted bigint,
  cleared_at timestamptz
) AS $$
DECLARE
  deleted_count bigint;
BEGIN
  -- Count messages before deletion
  SELECT COUNT(*) INTO deleted_count FROM hack_messages;
  
  -- Delete all hack messages
  DELETE FROM hack_messages WHERE true;
  
  -- Return results
  RETURN QUERY
  SELECT deleted_count, NOW();
END;
$$ LANGUAGE plpgsql;

-- Test the new functions
SELECT 'Setup completed! Testing functions...' as status;

-- Test clear_hack_messages function
SELECT 'clear_hack_messages function created successfully' as test_result;

-- Show current message counts
SELECT 
  (SELECT COUNT(*) FROM messages) as regular_messages_count,
  (SELECT COUNT(*) FROM hack_messages) as hack_messages_count;