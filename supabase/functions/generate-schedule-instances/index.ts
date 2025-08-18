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
    const { period_id } = await req.json();
    
    if (!period_id) {
      throw new Error('period_id is required');
    }

    console.log('Generating instances for period:', period_id);

    // Get the schedule period details
    const { data: period, error: periodError } = await supabase
      .from('schedule_periods')
      .select(`
        *,
        schedule_templates (
          id,
          name,
          schedule_template_entries (*)
        )
      `)
      .eq('id', period_id)
      .single();

    if (periodError || !period) {
      throw new Error(`Failed to fetch period: ${periodError?.message}`);
    }

    console.log('Period found:', period);
    console.log('Template entries:', period.schedule_templates?.schedule_template_entries);

    const templateEntries = period.schedule_templates?.schedule_template_entries || [];
    
    if (templateEntries.length === 0) {
      throw new Error('No template entries found for this period');
    }

    // Generate instances for each day in the period
    const instances = [];
    const startDate = new Date(period.start_date);
    const endDate = new Date(period.end_date);
    
    // Map day names to numbers (0 = Sunday, 1 = Monday, etc.)
    const dayMap: Record<string, number> = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };

    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      const dayOfWeek = currentDate.getDay();
      const dayName = Object.keys(dayMap).find(key => dayMap[key] === dayOfWeek);
      
      console.log(`Processing date ${currentDate.toISOString().split('T')[0]}, day: ${dayName}`);
      
      // Find template entries for this day
      const dayEntries = templateEntries.filter(entry => entry.day_of_week === dayName);
      
      for (const entry of dayEntries) {
        instances.push({
          template_entry_id: entry.id,
          period_id: period_id,
          class_date: currentDate.toISOString().split('T')[0],
          start_time: entry.start_time,
          duration: entry.duration,
          session_type: entry.session_type,
          max_participants: entry.max_participants,
          class_name: entry.class_name,
          is_cancelled: false
        });
      }
    }

    console.log(`Generated ${instances.length} instances`);

    // Clear existing instances for this period first
    const { error: deleteError } = await supabase
      .from('live_schedule_instances')
      .delete()
      .eq('period_id', period_id);

    if (deleteError) {
      console.warn('Warning: Could not clear existing instances:', deleteError.message);
    }

    // Insert the new instances
    if (instances.length > 0) {
      const { data: insertedInstances, error: insertError } = await supabase
        .from('live_schedule_instances')
        .insert(instances)
        .select();

      if (insertError) {
        throw new Error(`Failed to insert instances: ${insertError.message}`);
      }

      console.log(`Successfully inserted ${insertedInstances?.length} instances`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Generated ${instances.length} schedule instances`,
        instances_count: instances.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Failed to generate schedule instances:', error);
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