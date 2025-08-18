import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  try {
    console.log('Calling migration function...');
    
    const { data, error } = await supabase.functions.invoke('migrate-schedule-to-live-system', {
      body: {}
    });

    if (error) {
      console.error('Migration failed:', error);
      throw error;
    }

    console.log('Migration result:', data);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Migration triggered successfully',
        data
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Failed to trigger migration:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});