import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting cleanup of orphaned live schedule instances');

    // Find and delete instances that belong to inactive periods
    const { data: orphanedInstances, error: findError } = await supabase
      .from('live_schedule_instances')
      .select(`
        id,
        period_id,
        class_date,
        schedule_periods!inner(id, is_active)
      `)
      .eq('schedule_periods.is_active', false);

    if (findError) {
      throw new Error(`Failed to find orphaned instances: ${findError.message}`);
    }

    console.log(`Found ${orphanedInstances?.length || 0} orphaned instances`);

    let cleanedCount = 0;

    if (orphanedInstances && orphanedInstances.length > 0) {
      const instanceIds = orphanedInstances.map(instance => instance.id);
      
      const { error: deleteError } = await supabase
        .from('live_schedule_instances')
        .delete()
        .in('id', instanceIds);

      if (deleteError) {
        throw new Error(`Failed to delete orphaned instances: ${deleteError.message}`);
      }

      cleanedCount = instanceIds.length;
      console.log(`Successfully cleaned up ${cleanedCount} orphaned instances`);
    }

    // Also clean up any instances that don't have a valid period reference
    const { data: invalidInstances, error: invalidError } = await supabase
      .from('live_schedule_instances')
      .select('id, period_id')
      .not('period_id', 'in', `(
        SELECT id FROM schedule_periods WHERE is_active = true
      )`);

    if (invalidError) {
      console.warn('Could not check for invalid instances:', invalidError.message);
    } else if (invalidInstances && invalidInstances.length > 0) {
      const invalidIds = invalidInstances.map(instance => instance.id);
      
      const { error: deleteInvalidError } = await supabase
        .from('live_schedule_instances')
        .delete()
        .in('id', invalidIds);

      if (deleteInvalidError) {
        console.warn('Could not delete invalid instances:', deleteInvalidError.message);
      } else {
        cleanedCount += invalidIds.length;
        console.log(`Also cleaned up ${invalidIds.length} instances with invalid period references`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Cleaned up ${cleanedCount} orphaned instances`,
        cleaned_count: cleanedCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Failed to cleanup orphaned instances:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});