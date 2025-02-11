/*
  # Create cleanup function for daily message purge

  1. New Function
    - `cleanup_messages`: Deletes all messages older than the current day
  2. Changes
    - Creates a function to handle daily message cleanup
*/

CREATE OR REPLACE FUNCTION cleanup_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM messages 
  WHERE DATE(created_at) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;