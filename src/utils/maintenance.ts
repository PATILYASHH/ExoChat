/**
 * Utility functions for maintenance mode and time checking
 */

export interface MaintenanceInfo {
  isMaintenanceTime: boolean;
  timeUntilMaintenance: number; // milliseconds
  timeUntilEnd: number; // milliseconds
  nextMaintenanceStart: Date;
  currentMaintenanceEnd: Date | null;
}

/**
 * Check if current time is within maintenance window (11:55 PM - 12:01 AM)
 */
export function isMaintenanceTime(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // Between 11:55 PM and 11:59 PM
  if (hour === 23 && minute >= 55) {
    return true;
  }
  
  // Between 12:00 AM and 12:01 AM
  if (hour === 0 && minute <= 1) {
    return true;
  }
  
  return false;
}

/**
 * Get detailed maintenance information
 */
export function getMaintenanceInfo(): MaintenanceInfo {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  const isCurrentlyMaintenance = isMaintenanceTime();
  
  // Calculate next maintenance start time (11:55 PM)
  const nextMaintenanceStart = new Date();
  if (hour < 23 || (hour === 23 && minute < 55)) {
    // Today at 11:55 PM
    nextMaintenanceStart.setHours(23, 55, 0, 0);
  } else {
    // Tomorrow at 11:55 PM
    nextMaintenanceStart.setDate(nextMaintenanceStart.getDate() + 1);
    nextMaintenanceStart.setHours(23, 55, 0, 0);
  }
  
  // Calculate current maintenance end time if in maintenance
  let currentMaintenanceEnd: Date | null = null;
  let timeUntilEnd = 0;
  
  if (isCurrentlyMaintenance) {
    currentMaintenanceEnd = new Date();
    if (hour === 23) {
      // Currently in 11:55-11:59 PM, end is at 12:01 AM next day
      currentMaintenanceEnd.setDate(currentMaintenanceEnd.getDate() + 1);
      currentMaintenanceEnd.setHours(0, 1, 0, 0);
    } else {
      // Currently in 12:00-12:01 AM, end is at 12:01 AM today
      currentMaintenanceEnd.setHours(0, 1, 0, 0);
    }
    timeUntilEnd = currentMaintenanceEnd.getTime() - now.getTime();
  }
  
  const timeUntilMaintenance = nextMaintenanceStart.getTime() - now.getTime();
  
  return {
    isMaintenanceTime: isCurrentlyMaintenance,
    timeUntilMaintenance,
    timeUntilEnd,
    nextMaintenanceStart,
    currentMaintenanceEnd
  };
}

/**
 * Format time duration to human readable string
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Check if we should show maintenance warning (15 minutes before maintenance)
 */
export function shouldShowMaintenanceWarning(): boolean {
  const info = getMaintenanceInfo();
  const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
  
  return !info.isMaintenanceTime && info.timeUntilMaintenance <= fifteenMinutes && info.timeUntilMaintenance > 0;
}

/**
 * Get maintenance warning message
 */
export function getMaintenanceWarningMessage(): string {
  const info = getMaintenanceInfo();
  const timeLeft = formatDuration(info.timeUntilMaintenance);
  
  return `⚠️ Maintenance starts in ${timeLeft}. All chats will be cleared at midnight.`;
}