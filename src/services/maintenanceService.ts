import { supabase } from '../lib/supabase';

/**
 * Service functions for maintenance operations
 */

export interface CleanupResult {
  success: boolean;
  messagesDeleted: number;
  timestamp: string;
  error?: string;
}

/**
 * Trigger manual cleanup of all chat messages
 */
export async function triggerCleanup(): Promise<CleanupResult> {
  try {
    // Call the database function to perform cleanup
    const { data, error } = await supabase
      .rpc('trigger_manual_cleanup');

    if (error) {
      throw error;
    }

    const result = data?.[0];
    
    return {
      success: true,
      messagesDeleted: result?.messages_deleted || 0,
      timestamp: result?.cleanup_time || new Date().toISOString()
    };
  } catch (error: any) {
    return {
      success: false,
      messagesDeleted: 0,
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}

/**
 * Check if maintenance is currently active via database
 */
export async function checkMaintenanceStatus() {
  try {
    const { data, error } = await supabase
      .from('maintenance_status')
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return {
      inMaintenance: data.in_maintenance,
      statusMessage: data.status_message,
      checkTime: data.check_time
    };
  } catch (error: any) {
    // Fallback to client-side check if database query fails
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    const inMaintenance = (hour === 23 && minute >= 55) || (hour === 0 && minute <= 1);
    
    return {
      inMaintenance,
      statusMessage: inMaintenance ? 'System is under maintenance' : 'System is operational',
      checkTime: now.toISOString()
    };
  }
}

/**
 * Get cleanup schedule information
 */
export async function getCleanupSchedule() {
  try {
    const { data, error } = await supabase
      .rpc('get_cleanup_schedule_info');

    if (error) {
      throw error;
    }

    return data?.[0] || null;
  } catch (error: any) {
    console.error('Error getting cleanup schedule:', error);
    return null;
  }
}