#!/bin/bash

# Test the cleanup function with proper error handling
echo "🧹 Testing database cleanup function..."

# Supabase credentials
SUPABASE_URL="https://qfwvsopelafyedxtncxm.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmd3Zzb3BlbGFmeWVkeHRuY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTQ1OTgsImV4cCI6MjA3MzMzMDU5OH0.AXUhpVWSsYmYYNaWM0L4Jm7w6zgOuokniN7BO1VFjKs"

echo "📡 Calling trigger_manual_cleanup..."

# Use curl with proper PowerShell syntax
$response = Invoke-WebRequest -Method POST `
  -Uri "$SUPABASE_URL/rest/v1/rpc/trigger_manual_cleanup" `
  -Headers @{
    "Content-Type"="application/json";
    "Authorization"="Bearer $SUPABASE_KEY";
    "apikey"="$SUPABASE_KEY"
  } `
  -Body "{}"

if ($response.StatusCode -eq 200) {
    echo "✅ Cleanup successful!"
    echo "Response: $($response.Content)"
} else {
    echo "❌ Cleanup failed with status: $($response.StatusCode)"
    echo "Response: $($response.Content)"
}