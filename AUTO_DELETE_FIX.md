# Auto-Delete System Fix

## Problem
The midnight auto-delete was not working because there was no automatic scheduler triggering the cleanup function.

## Solution Implemented

### 1. Client-Side Auto-Cleanup Monitor ✅
- **File**: `src/services/autoCleanupService.ts`
- **Function**: Monitors the app and automatically triggers cleanup between 12:00-12:05 AM
- **Frequency**: Checks every minute when app is open
- **Backup**: If server-side scheduling fails, this ensures cleanup happens

### 2. Netlify Edge Function for Scheduled Cleanup ✅
- **File**: `netlify/edge-functions/cleanup.ts`
- **Purpose**: Server-side endpoint that can be called by external schedulers
- **Security**: Requires Bearer token authentication
- **URL**: `https://your-app.netlify.app/.netlify/edge-functions/cleanup`

### 3. External Scheduling Options

#### Option A: Cron-job.org (Recommended - Free)
1. Go to [cron-job.org](https://cron-job.org/)
2. Create free account
3. Add new cron job:
   - **URL**: `https://your-app.netlify.app/.netlify/edge-functions/cleanup`
   - **Schedule**: `0 0 * * *` (daily at midnight)
   - **Method**: POST
   - **Headers**: `Authorization: Bearer exochat-cleanup-2025`

#### Option B: UptimeRobot (Free with monitoring)
1. Go to [uptimerobot.com](https://uptimerobot.com/)
2. Create free account
3. Add "Heartbeat Monitor"
4. Set interval to 24 hours
5. Use webhook to call cleanup endpoint

#### Option C: GitHub Actions (Free)
Create `.github/workflows/cleanup.yml`:
```yaml
name: Daily Cleanup
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cleanup
        run: |
          curl -X POST \
            -H "Authorization: Bearer exochat-cleanup-2025" \
            https://your-app.netlify.app/.netlify/edge-functions/cleanup
```

### 4. Environment Variables Needed in Netlify

Add these in Netlify dashboard → Site Settings → Environment Variables:

- `VITE_SUPABASE_URL`: Your Supabase URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (optional, falls back to anon key)
- `CLEANUP_TOKEN`: `exochat-cleanup-2025` (for security)

## How It Works Now

### Automatic Client-Side Cleanup
1. **App Monitor**: When users have the app open, it checks every minute
2. **Time Check**: Between 12:00-12:05 AM, if messages exist, cleanup triggers
3. **Direct Cleanup**: Deletes all messages and hack_messages directly
4. **Fallback**: If database functions fail, uses direct SQL deletion

### Server-Side Scheduled Cleanup
1. **External Service**: Calls the Netlify edge function at midnight
2. **Authentication**: Verifies the Bearer token
3. **Database Cleanup**: Uses both direct deletion and database functions
4. **Error Handling**: Graceful fallback if any method fails

### Maintenance Mode UI
- **Shows**: 11:55 PM - 12:01 AM (as before)
- **Purpose**: Informs users of the cleanup window
- **Auto-Hide**: Disappears after 12:01 AM

## Testing the Fix

### Test Client-Side Cleanup
1. Change the time check in `autoCleanupService.ts` to current time
2. Add some test messages
3. Watch console for cleanup logs
4. Verify messages are deleted

### Test Server-Side Cleanup
```bash
# Test the edge function directly
curl -X POST \
  -H "Authorization: Bearer exochat-cleanup-2025" \
  https://your-app.netlify.app/.netlify/edge-functions/cleanup
```

### Verify Database Functions
```javascript
// In browser console on your app
const { data, error } = await supabase.rpc('trigger_manual_cleanup')
console.log(data, error)
```

## Deployment Steps

1. **Push Code** ✅ (files already created)
2. **Deploy to Netlify** ✅ (automatic on git push)
3. **Add Environment Variables** (in Netlify dashboard)
4. **Set Up External Scheduler** (cron-job.org recommended)
5. **Test the System** (see testing steps above)

## Monitoring

### Check if Cleanup is Working
- Admin panel shows real message counts
- Messages should be 0 every morning
- Check browser console for cleanup logs
- Monitor external scheduler success

### Troubleshooting
- **No cleanup**: Check external scheduler is running
- **Client-side only**: Add server-side scheduler
- **Database errors**: Verify Supabase permissions
- **Edge function fails**: Check environment variables

## Benefits

✅ **Dual redundancy**: Client-side + server-side cleanup
✅ **No dependency**: Works without special database permissions
✅ **Reliable**: Multiple fallback mechanisms
✅ **Secure**: Bearer token authentication
✅ **Monitored**: Can track success/failure
✅ **Free**: Using free external schedulers