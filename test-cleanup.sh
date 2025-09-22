#!/bin/bash

# Test script for the daily cleanup curl command
# Run this locally to verify the API call works

echo "🧹 Testing daily cleanup API call..."

# Your Supabase credentials (same as in .env)
SUPABASE_URL="https://qfwvsopelafyedxtncxm.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmd3Zzb3BlbGFmeWVkeHRuY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTQ1OTgsImV4cCI6MjA3MzMzMDU5OH0.AXUhpVWSsYmYYNaWM0L4Jm7w6zgOuokniN7BO1VFjKs"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
  echo "❌ Error: Missing Supabase credentials"
  exit 1
fi

echo "📡 Calling cleanup endpoint: $SUPABASE_URL/rest/v1/rpc/trigger_manual_cleanup"

# Make the API call
response=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "apikey: $SUPABASE_KEY" \
  -d '{}' \
  "$SUPABASE_URL/rest/v1/rpc/trigger_manual_cleanup")

# Check if curl succeeded
if [ $? -eq 0 ]; then
  echo "✅ API call successful!"
  echo "Response: $response"

  # Parse the response to show what was cleaned
  if echo "$response" | grep -q "messages_deleted"; then
    messages_deleted=$(echo "$response" | grep -o '"messages_deleted":[0-9]*' | cut -d':' -f2)
    hack_messages_deleted=$(echo "$response" | grep -o '"hack_messages_deleted":[0-9]*' | cut -d':' -f2)
    echo "🧹 Cleaned up: $messages_deleted regular messages, $hack_messages_deleted hack messages"
  fi
else
  echo "❌ API call failed with exit code $?"
  echo "Response: $response"
  exit 1
fi

echo "✅ Test completed successfully!"