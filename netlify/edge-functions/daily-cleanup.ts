import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// This edge function runs daily cleanup at midnight
export default async function handler(request: Request) {
  // Only allow POST requests and verify it's a scheduled call
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('VITE_SUPABASE_ANON_KEY')!;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🧹 Starting daily cleanup at:', new Date().toISOString());

    // Call the database cleanup function
    const { data, error } = await supabase.rpc('trigger_manual_cleanup');

    if (error) {
      console.error('❌ Cleanup failed:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const result = data?.[0];
    const response = {
      success: true,
      messagesDeleted: result?.messages_deleted || 0,
      hackMessagesDeleted: result?.hack_messages_deleted || 0,
      timestamp: result?.cleanup_time || new Date().toISOString()
    };

    console.log('✅ Daily cleanup completed:', response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Error during cleanup:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}