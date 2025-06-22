
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { date } = await req.json();
    
    const apiKey = Deno.env.get('GOOGLE_CALENDAR_API_KEY');
    const calendarId = Deno.env.get('GOOGLE_CALENDAR_ID');
    
    if (!apiKey || !calendarId) {
      throw new Error('Missing Google Calendar credentials');
    }

    // Set time range for business hours (9am-6pm)
    const startOfDay = new Date(date);
    startOfDay.setHours(9, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(18, 0, 0, 0);

    const timeMin = startOfDay.toISOString();
    const timeMax = endOfDay.toISOString();

    console.log(`Checking hourly availability for ${date}`);
    console.log(`Time range: ${timeMin} to ${timeMax}`);

    // Fetch events from Google Calendar
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      `key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Calendar API error:', errorText);
      throw new Error(`Google Calendar API error: ${response.status}`);
    }

    const data = await response.json();
    const events = data.items || [];
    
    console.log(`Found ${events.length} events for ${date}`);

    // Generate hourly slots from 9am to 6pm
    const hourlyAvailability = [];
    for (let hour = 9; hour < 18; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(date);
      slotEnd.setHours(hour + 1, 0, 0, 0);

      // Check if any event conflicts with this hour
      const isConflict = events.some(event => {
        const eventStart = new Date(event.start.dateTime || event.start.date);
        const eventEnd = new Date(event.end.dateTime || event.end.date);
        
        // Check if event overlaps with this hour slot
        return (eventStart < slotEnd && eventEnd > slotStart);
      });

      hourlyAvailability.push({
        hour: hour,
        time: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        available: !isConflict
      });
    }

    return new Response(
      JSON.stringify({ 
        date: date,
        hourlyAvailability: hourlyAvailability
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error checking availability:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hourlyAvailability: []
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
