# Daily Maintenance and Cleanup System

## Overview
This system automatically clears all chat messages at midnight (12:00 AM) every day and shows a maintenance mode during the cleanup window (11:55 PM - 12:01 AM).

## Features
- ✅ Automatic daily cleanup of all chat messages at midnight
- ✅ Maintenance mode UI during cleanup window
- ✅ Warning notifications 15 minutes before maintenance
- ✅ Database functions for scheduled cleanup
- ✅ Manual cleanup trigger for testing
- ✅ Reduced server load by preventing data accumulation

## Setup Instructions

### 1. Database Migration
The following migration has been created: `20250214000000_daily_cleanup_system.sql`

Run this migration in your Supabase database to set up:
- `daily_cleanup()` function
- `is_maintenance_time()` function  
- `maintenance_status` view
- Manual cleanup functions

### 2. Automated Scheduling Options

#### Option A: External Cron Job (Recommended)
Set up a cron job on your server or hosting platform:

```bash
# Add to crontab (crontab -e)
0 0 * * * curl -X POST https://your-app-domain.com/api/cleanup
```

#### Option B: Supabase pg_cron (If Available)
If your Supabase instance supports pg_cron extension:

```sql
-- Enable extension (requires superuser)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily cleanup
SELECT cron.schedule(
  'daily-cleanup',
  '0 0 * * *',  -- Every day at midnight
  'SELECT daily_cleanup();'
);
```

#### Option C: Vercel/Netlify Functions
Create a serverless function that calls the cleanup:

```javascript
// api/cleanup.js (Vercel) or .netlify/functions/cleanup.js (Netlify)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data, error } = await supabase.rpc('daily_cleanup')
    
    if (error) throw error
    
    res.status(200).json({ success: true, timestamp: new Date().toISOString() })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

Then use a service like cron-job.org to call your endpoint daily at midnight.

### 3. Testing the System

#### Manual Cleanup Test
```javascript
import { triggerCleanup } from './src/services/maintenanceService'

// Test the cleanup function
const result = await triggerCleanup()
console.log(result)
```

#### Test Maintenance Mode
Temporarily modify the maintenance time check in `src/utils/maintenance.ts` to test the UI:

```javascript
// For testing - set maintenance time to current time
export function isMaintenanceTime(): boolean {
  return true; // This will always show maintenance mode
}
```

### 4. Configuration

#### Maintenance Window
Current setting: 11:55 PM - 12:01 AM (6 minutes)

To modify, update `src/utils/maintenance.ts`:
```javascript
// Change these conditions to adjust the maintenance window
if (hour === 23 && minute >= 55) { // Start time: 11:55 PM
if (hour === 0 && minute <= 1) {   // End time: 12:01 AM
```

#### Warning Time
Current setting: 15 minutes before maintenance

To modify, update `shouldShowMaintenanceWarning()` in `src/utils/maintenance.ts`:
```javascript
const fifteenMinutes = 15 * 60 * 1000; // Change to desired minutes
```

## Database Functions Reference

### Core Functions
- `daily_cleanup()` - Clears all messages
- `is_maintenance_time()` - Checks if in maintenance window
- `trigger_manual_cleanup()` - Manual cleanup with return data
- `get_cleanup_schedule_info()` - Gets next cleanup time info

### Views
- `maintenance_status` - Current maintenance status

## Monitoring

### Check Maintenance Status
```javascript
import { checkMaintenanceStatus } from './src/services/maintenanceService'

const status = await checkMaintenanceStatus()
console.log(status)
```

### Check Next Cleanup Time
```javascript
import { getCleanupSchedule } from './src/services/maintenanceService'

const schedule = await getCleanupSchedule()
console.log('Next cleanup:', schedule?.next_cleanup_time)
```

## Benefits

1. **Reduced Server Load**: No accumulation of chat data
2. **Privacy**: All conversations are automatically cleared
3. **Performance**: Database stays optimized with minimal data
4. **User Experience**: Clear communication about maintenance
5. **Reliability**: Automatic daily reset ensures consistent performance

## Troubleshooting

### If Maintenance Mode Doesn't Show
1. Check system time is correct
2. Verify `isMaintenanceTime()` function logic
3. Check browser timezone vs server timezone

### If Cleanup Doesn't Run
1. Verify cron job is properly configured
2. Check database function permissions
3. Test manual cleanup function
4. Review server/function logs

### If Database Connection Fails During Cleanup
The system gracefully falls back to client-side time checking for maintenance mode display.