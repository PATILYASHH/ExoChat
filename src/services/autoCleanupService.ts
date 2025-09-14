import { supabase } from '../lib/supabase';

interface AutoCleanupResult {
  success: boolean;
  messagesDeleted: number;
  hackMessagesDeleted: number;
  timestamp: string;
  error?: string;
  source: 'client' | 'server';
}

/**
 * Check if cleanup is needed and trigger it
 * This runs client-side as a backup if server-side scheduling fails
 */
export async function checkAndTriggerAutoCleanup(): Promise<AutoCleanupResult | null> {
  try {
    // Check if we need cleanup (it's past midnight and there are messages)
    const shouldCleanup = await shouldPerformCleanup();
    
    if (!shouldCleanup) {
      return null; // No cleanup needed
    }

    console.log('🧹 Auto-cleanup triggered - performing midnight cleanup...');

    // Perform cleanup
    return await performAutoCleanup();

  } catch (error: any) {
    console.error('Auto-cleanup check failed:', error);
    return {
      success: false,
      messagesDeleted: 0,
      hackMessagesDeleted: 0,
      timestamp: new Date().toISOString(),
      error: error.message,
      source: 'client'
    };
  }
}

/**
 * Check if we should perform cleanup
 */
async function shouldPerformCleanup(): Promise<boolean> {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Only run cleanup between 12:00 AM and 12:05 AM
  if (hour !== 0 || minute > 5) {
    return false;
  }

  try {
    // Check if there are any messages (if no messages, cleanup already happened)
    const { count: messageCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true });

    const { count: hackCount } = await supabase
      .from('hack_messages')
      .select('*', { count: 'exact', head: true });

    // If there are messages and it's past midnight, we need cleanup
    return (messageCount || 0) > 0 || (hackCount || 0) > 0;

  } catch (error) {
    console.error('Error checking message counts:', error);
    return false;
  }
}

/**
 * Perform the actual cleanup
 */
async function performAutoCleanup(): Promise<AutoCleanupResult> {
  try {
    let messagesDeleted = 0;
    let hackMessagesDeleted = 0;

    // Try database function first
    try {
      const { data, error } = await supabase.rpc('trigger_manual_cleanup');
      
      if (error) throw error;
      
      const result = data?.[0];
      messagesDeleted = result?.messages_deleted || 0;
      hackMessagesDeleted = result?.hack_messages_deleted || 0;
      
    } catch (dbError) {
      console.log('Database function failed, using direct deletion:', dbError);
      
      // Fallback to direct deletion
      const { count: msgCount } = await supabase
        .from('messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      const { count: hackCount } = await supabase
        .from('hack_messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      messagesDeleted = msgCount || 0;
      hackMessagesDeleted = hackCount || 0;
    }

    const result: AutoCleanupResult = {
      success: true,
      messagesDeleted,
      hackMessagesDeleted,
      timestamp: new Date().toISOString(),
      source: 'client'
    };

    console.log('✅ Auto-cleanup completed:', result);
    return result;

  } catch (error: any) {
    console.error('❌ Auto-cleanup failed:', error);
    return {
      success: false,
      messagesDeleted: 0,
      hackMessagesDeleted: 0,
      timestamp: new Date().toISOString(),
      error: error.message,
      source: 'client'
    };
  }
}

/**
 * Start the auto-cleanup monitor
 * This will check every minute if cleanup is needed
 */
export function startAutoCleanupMonitor() {
  // Check immediately
  checkAndTriggerAutoCleanup();

  // Then check every minute
  const interval = setInterval(async () => {
    await checkAndTriggerAutoCleanup();
  }, 60000); // Check every minute

  return () => clearInterval(interval);
}