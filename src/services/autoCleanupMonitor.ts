import { supabase } from '../lib/supabase';
import { triggerCleanup } from './maintenanceService';

/**
 * Client-side automatic cleanup monitor
 * Runs cleanup if it's past midnight and hasn't been done today
 */

let cleanupCheckInterval: NodeJS.Timeout | null = null;

/**
 * Check if cleanup needs to run and trigger it
 */
export async function checkAndRunAutoCleanup(): Promise<boolean> {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Only check between midnight and 1 AM
    if (currentHour !== 0) {
      return false;
    }

    console.log('🕐 Checking if auto-cleanup is needed...');

    // Check when was the last cleanup
    const { data: lastCleanup, error } = await supabase
      .from('cleanup_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error && error.code !== 'PGRST116') { // Ignore table not found error
      console.error('Error checking last cleanup:', error);
      return false;
    }

    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const lastCleanupDate = lastCleanup?.[0]?.created_at?.split('T')[0];

    // If cleanup already ran today, skip
    if (lastCleanupDate === today) {
      console.log('✅ Cleanup already ran today');
      return false;
    }

    // If it's past midnight and no cleanup today, run it
    if (currentMinute >= 5) { // Wait 5 minutes after midnight to avoid conflicts
      console.log('🧹 Running automatic cleanup...');
      
      const result = await triggerCleanup();
      
      if (result.success) {
        console.log('✅ Auto-cleanup completed:', result);
        
        // Log the cleanup
        await logCleanup(result.messagesDeleted, result.hackMessagesDeleted);
        return true;
      } else {
        console.error('❌ Auto-cleanup failed:', result.error);
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error('Error in auto-cleanup check:', error);
    return false;
  }
}

/**
 * Log cleanup operation to database
 */
async function logCleanup(messagesDeleted: number, hackMessagesDeleted: number) {
  try {
    // Create cleanup_log table if it doesn't exist (will fail silently if exists)
    await supabase.rpc('create_cleanup_log_table_if_not_exists');
    
    // Insert cleanup record
    const { error } = await supabase
      .from('cleanup_log')
      .insert({
        messages_deleted: messagesDeleted,
        hack_messages_deleted: hackMessagesDeleted,
        cleanup_type: 'auto',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error logging cleanup:', error);
    }
  } catch (error) {
    // Silently fail if logging doesn't work
    console.error('Error logging cleanup:', error);
  }
}

/**
 * Start monitoring for auto-cleanup (call this in your main App component)
 */
export function startAutoCleanupMonitor() {
  // Clear any existing interval
  if (cleanupCheckInterval) {
    clearInterval(cleanupCheckInterval);
  }

  // Check every 10 minutes
  cleanupCheckInterval = setInterval(async () => {
    await checkAndRunAutoCleanup();
  }, 10 * 60 * 1000); // 10 minutes

  // Also check immediately
  setTimeout(() => {
    checkAndRunAutoCleanup();
  }, 5000); // Wait 5 seconds after app start

  console.log('🤖 Auto-cleanup monitor started');
}

/**
 * Stop the auto-cleanup monitor
 */
export function stopAutoCleanupMonitor() {
  if (cleanupCheckInterval) {
    clearInterval(cleanupCheckInterval);
    cleanupCheckInterval = null;
    console.log('🤖 Auto-cleanup monitor stopped');
  }
}