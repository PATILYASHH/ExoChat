-- SAFE HACK MESSAGES CLEANUP SETUP
-- This script safely drops and recreates all functions to avoid conflicts

-- Step 1: Drop all existing functions that might conflict
DROP FUNCTION IF EXISTS trigger_manual_cleanup();
DROP FUNCTION IF EXISTS clear_hack_messages();
DROP FUNCTION IF EXISTS daily_cleanup();

-- Step 2: Create the enhanced daily cleanup function
CREATE FUNCTION daily_cleanup()
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

-- Step 3: Create the manual cleanup trigger function
CREATE FUNCTION trigger_manual_cleanup()
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

-- Step 4: Create the hack messages only clear function
CREATE FUNCTION clear_hack_messages()
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

-- Step 5: Test the setup
SELECT 'All functions created successfully!' as status;

-- Step 6: Show current counts
SELECT 
  'Current message counts:' as info,
  (SELECT COUNT(*) FROM messages) as regular_messages,
  (SELECT COUNT(*) FROM hack_messages) as hack_messages;

-- Step 7: Test the clear_hack_messages function (optional)
-- Uncomment the line below to test clearing hack messages
-- SELECT * FROM clear_hack_messages();