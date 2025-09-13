# Netlify Deployment Guide for ExoChat

## Files Added for Netlify Deployment

### 1. `public/_redirects`
- Tells Netlify to serve `index.html` for all routes that don't match files
- Fixes the "Page Not Found" issue when refreshing or direct navigation

### 2. `netlify.toml`
- Complete Netlify configuration file
- Specifies build settings, redirects, and caching headers
- Optimizes performance with proper cache headers

## Deployment Steps

### 1. Build Locally (Optional - for testing)
```bash
npm run build
```
This creates a `dist` folder with the production build.

### 2. Deploy to Netlify

#### Option A: Drag and Drop
1. Build the project: `npm run build`
2. Go to https://netlify.com/
3. Drag the `dist` folder to Netlify's deploy area

#### Option B: Git Integration (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Netlify
3. Netlify will automatically build and deploy

### 3. Environment Variables on Netlify
Make sure to add these environment variables in Netlify:
1. Go to Site Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL` = `https://qfwvsopelafyedxtncxm.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmd3Zzb3BlbGFmeWVkeHRuY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTQ1OTgsImV4cCI6MjA3MzMzMDU5OH0.AXUhpVWSsYmYYNaWM0L4Jm7w6zgOuokniN7BO1VFjKs`

## What This Fixes

- ✅ **Page refresh issue**: No more "Page Not Found" when refreshing
- ✅ **Direct URL access**: URLs like `/chat/anonymous` work directly
- ✅ **React Router**: All client-side routing works properly
- ✅ **Performance**: Optimized caching for assets
- ✅ **Build optimization**: Proper build configuration

## Testing the Fix

After deployment:
1. Visit your Netlify URL
2. Navigate to different pages (like chat rooms)
3. Refresh the page - should work without "Page Not Found"
4. Try direct URLs like `yoursite.netlify.app/chat/anonymous`
5. Test the admin panel (Ctrl+Shift+Y) and hack page (Ctrl+Shift+H)

## Common Issues and Solutions

### If you still get "Page Not Found":
1. Check that `_redirects` file is in the `dist` folder after build
2. Verify Netlify is using the correct publish directory (`dist`)
3. Make sure the build command is `npm run build`

### If environment variables don't work:
1. Double-check they're added in Netlify dashboard
2. Ensure they start with `VITE_`
3. Redeploy after adding environment variables

## Performance Notes

The `netlify.toml` file includes:
- Long-term caching for static assets
- Proper cache headers for JS/CSS files
- Immutable caching for hashed assets
- Node.js 18 for build environment