/*
  # Daily Maintenance and Data Cleanup System

  1. Functions
    - `daily_cleanup()`: Clears all messages and resets the chat system
    - `schedule_daily_cleanup()`: Sets up automatic daily cleanup at midnight

  2. Features
    - Automatic deletion of all messages at midnight (12:00 AM)
    - Maintains chat rooms but clears all conversation history
    - Reduces server load by preventing data accumulation
    - Scheduled maintenance window from 11:55 PM to 12:01 AM

  3. Scheduling
    - Uses PostgreSQL's pg_cron extension for scheduled tasks
    - Runs cleanup automatically every day at midnight
*/

-- Enable pg_cron extension for scheduled tasks (if available)
-- Note: This requires superuser privileges and may need to be enabled by hosting provider
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create enhanced cleanup function that clears all chat data
CREATE OR REPLACE FUNCTION daily_cleanup()
RETURNS void AS $$
BEGIN
  -- Delete all messages (this clears all chat history)
  DELETE FROM messages;
  
  -- Delete all hack messages (if table exists)
  DELETE FROM hack_messages WHERE true;
  
  -- Log the cleanup operation
  RAISE NOTICE 'Daily cleanup completed at %', NOW();
  
  -- Optional: Reset any other data that should be cleared daily
  -- You can add more cleanup operations here if needed
END;
$$ LANGUAGE plpgsql;

-- Create a function to check if we're in maintenance window
CREATE OR REPLACE FUNCTION is_maintenance_time()
RETURNS boolean AS $$
BEGIN
  -- Check if current time is between 11:55 PM and 12:01 AM
  RETURN EXTRACT(HOUR FROM NOW()) = 23 AND EXTRACT(MINUTE FROM NOW()) >= 55
      OR EXTRACT(HOUR FROM NOW()) = 0 AND EXTRACT(MINUTE FROM NOW()) <= 1;
END;
$$ LANGUAGE plpgsql;

-- Create a view to check maintenance status
CREATE OR REPLACE VIEW maintenance_status AS
SELECT 
  is_maintenance_time() as in_maintenance,
  CASE 
    WHEN is_maintenance_time() THEN 'System is under maintenance. Data cleanup in progress.'
    ELSE 'System is operational.'
  END as status_message,
  NOW() as check_time;

-- Schedule daily cleanup at midnight (commented out as it requires pg_cron extension)
-- This would need to be set up by the database administrator or hosting provider
/*
SELECT cron.schedule(
  'daily-cleanup',
  '0 0 * * *',  -- Every day at midnight
  'SELECT daily_cleanup();'
);
*/

-- Alternative: Create a function that can be called by an external scheduler
CREATE OR REPLACE FUNCTION get_cleanup_schedule_info()
RETURNS TABLE(
  next_cleanup_time timestamptz,
  time_until_cleanup interval,
  is_cleanup_time boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (DATE_TRUNC('day', NOW()) + INTERVAL '1 day')::timestamptz as next_cleanup,
    (DATE_TRUNC('day', NOW()) + INTERVAL '1 day' - NOW())::interval as time_until,
    (EXTRACT(HOUR FROM NOW()) = 0 AND EXTRACT(MINUTE FROM NOW()) = 0)::boolean as is_cleanup;
END;
$$ LANGUAGE plpgsql;

-- Drop existing function if it exists (to avoid return type conflicts)
DROP FUNCTION IF EXISTS trigger_manual_cleanup();

-- Create a manual trigger function for testing cleanup
CREATE OR REPLACE FUNCTION trigger_manual_cleanup()
RETURNS TABLE(
  messages_deleted bigint,
  cleanup_time timestamptz
) AS $$
DECLARE
  deleted_count bigint;
BEGIN
  -- Count messages before deletion
  SELECT COUNT(*) INTO deleted_count FROM messages;
  
  -- Perform cleanup
  PERFORM daily_cleanup();
  
  -- Return results
  RETURN QUERY
  SELECT deleted_count, NOW();
END;
$$ LANGUAGE plpgsql;