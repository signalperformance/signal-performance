import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ScheduleEntry {
  id: string;
  day_of_week: string;
  start_time: string;
  duration: number;
  session_type: string;
  max_participants: number;
  class_name: string;
  is_active: boolean;
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
    console.log('Starting migration from schedule_entries to live_schedule_instances');

    // Step 1: Create default schedule template
    const { data: template, error: templateError } = await supabase
      .from('schedule_templates')
      .insert({
        name: 'Default Weekly Schedule',
        description: 'Migrated from existing schedule entries',
        is_active: true
      })
      .select()
      .single();

    if (templateError) {
      console.error('Error creating template:', templateError);
      throw templateError;
    }

    console.log('Created template:', template.id);

    // Step 2: Get all active schedule entries
    const { data: scheduleEntries, error: entriesError } = await supabase
      .from('schedule_entries')
      .select('*')
      .eq('is_active', true);

    if (entriesError) {
      console.error('Error fetching schedule entries:', entriesError);
      throw entriesError;
    }

    console.log('Found schedule entries:', scheduleEntries?.length || 0);

    // Step 3: Create template entries from schedule entries
    if (scheduleEntries && scheduleEntries.length > 0) {
      const templateEntries = scheduleEntries.map(entry => ({
        template_id: template.id,
        day_of_week: entry.day_of_week,
        start_time: entry.start_time,
        duration: entry.duration,
        session_type: entry.session_type,
        max_participants: entry.max_participants,
        class_name: entry.class_name
      }));

      const { error: templateEntriesError } = await supabase
        .from('schedule_template_entries')
        .insert(templateEntries);

      if (templateEntriesError) {
        console.error('Error creating template entries:', templateEntriesError);
        throw templateEntriesError;
      }

      console.log('Created template entries:', templateEntries.length);
    }

    // Step 4: Create schedule period for next 4 weeks
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 28); // 4 weeks

    const { data: period, error: periodError } = await supabase
      .from('schedule_periods')
      .insert({
        template_id: template.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        is_active: true
      })
      .select()
      .single();

    if (periodError) {
      console.error('Error creating period:', periodError);
      throw periodError;
    }

    console.log('Created period:', period.id);

    // Step 5: Generate live schedule instances for the next 4 weeks
    const { data: templateEntries, error: fetchTemplateError } = await supabase
      .from('schedule_template_entries')
      .select('*')
      .eq('template_id', template.id);

    if (fetchTemplateError) {
      console.error('Error fetching template entries:', fetchTemplateError);
      throw fetchTemplateError;
    }

    const liveInstances = [];
    const dayOfWeekMap = {
      'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4,
      'friday': 5, 'saturday': 6, 'sunday': 0
    };

    // Generate instances for each day in the 4-week period
    for (let week = 0; week < 4; week++) {
      for (let day = 0; day < 7; day++) {
        const instanceDate = new Date(startDate);
        instanceDate.setDate(startDate.getDate() + (week * 7) + day);
        
        const dayName = instanceDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        
        // Find template entries for this day
        const dayTemplateEntries = templateEntries?.filter(
          entry => entry.day_of_week === dayName
        ) || [];

        for (const templateEntry of dayTemplateEntries) {
          liveInstances.push({
            template_entry_id: templateEntry.id,
            period_id: period.id,
            class_date: instanceDate.toISOString().split('T')[0],
            start_time: templateEntry.start_time,
            duration: templateEntry.duration,
            session_type: templateEntry.session_type,
            max_participants: templateEntry.max_participants,
            class_name: templateEntry.class_name,
            is_cancelled: false
          });
        }
      }
    }

    console.log('Generated live instances:', liveInstances.length);

    // Insert live instances in batches
    const batchSize = 100;
    for (let i = 0; i < liveInstances.length; i += batchSize) {
      const batch = liveInstances.slice(i, i + batchSize);
      const { error: instancesError } = await supabase
        .from('live_schedule_instances')
        .insert(batch);

      if (instancesError) {
        console.error('Error creating live instances batch:', instancesError);
        throw instancesError;
      }
    }

    console.log('Migration completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Migration completed successfully',
        template_id: template.id,
        period_id: period.id,
        live_instances_created: liveInstances.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Migration failed:', error);
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