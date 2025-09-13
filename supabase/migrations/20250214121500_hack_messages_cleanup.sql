-- Update daily cleanup system to include hack_messages table
-- This extends the existing cleanup system to also clear hack page messages

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
  DELETE FROM messages;
  
  -- Delete all hack page messages
  DELETE FROM hack_messages;
  
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
  DELETE FROM hack_messages;
  
  -- Return results
  RETURN QUERY
  SELECT deleted_count, NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get cleanup statistics
CREATE OR REPLACE FUNCTION get_cleanup_stats()
RETURNS TABLE(
  regular_messages_count bigint,
  hack_messages_count bigint,
  next_cleanup_time timestamptz,
  time_until_cleanup interval
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM messages) as regular_messages,
    (SELECT COUNT(*) FROM hack_messages) as hack_messages,
    (DATE_TRUNC('day', NOW()) + INTERVAL '1 day')::timestamptz as next_cleanup,
    (DATE_TRUNC('day', NOW()) + INTERVAL '1 day' - NOW())::interval as time_until;
END;
$$ LANGUAGE plpgsql;