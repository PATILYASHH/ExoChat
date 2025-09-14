import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async (request: Request) => {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Verify the request is from a trusted source (optional security)
  const authHeader = request.headers.get('Authorization')
  const expectedToken = Deno.env.get('CLEANUP_TOKEN') || 'exochat-cleanup-2025'
  
  if (authHeader !== `Bearer ${expectedToken}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('VITE_SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Perform the cleanup operations
    console.log('Starting midnight cleanup...')
    
    // 1. Clear all chat messages
    const { error: messagesError, count: messagesDeleted } = await supabase
      .from('messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (messagesError) {
      console.error('Error deleting messages:', messagesError)
      throw messagesError
    }

    // 2. Clear hack messages
    const { error: hackError, count: hackDeleted } = await supabase
      .from('hack_messages')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (hackError) {
      console.error('Error deleting hack messages:', hackError)
      throw hackError
    }

    // 3. Try to call the database cleanup function if it exists
    try {
      const { error: functionError } = await supabase.rpc('daily_cleanup')
      if (functionError) {
        console.warn('Database function call failed:', functionError)
        // Don't throw - direct deletion above should have worked
      }
    } catch (funcErr) {
      console.warn('Database function not available:', funcErr)
      // Continue - direct deletion is sufficient
    }

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      messagesDeleted: messagesDeleted || 0,
      hackMessagesDeleted: hackDeleted || 0,
      message: 'Daily cleanup completed successfully'
    }

    console.log('Cleanup completed:', result)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Cleanup failed:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}