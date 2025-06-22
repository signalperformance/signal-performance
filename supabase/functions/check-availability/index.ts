
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

    console.log(`🔍 Checking availability for date: ${date}`);
    console.log(`📅 Calendar ID: ${calendarId}`);

    // Create date range for the entire day in the user's timezone
    // We'll use a wider range to ensure we catch all events
    const targetDate = new Date(date + 'T00:00:00');
    const dayBefore = new Date(targetDate);
    dayBefore.setDate(dayBefore.getDate() - 1);
    const dayAfter = new Date(targetDate);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const timeMin = dayBefore.toISOString();
    const timeMax = dayAfter.toISOString();

    console.log(`⏰ Expanded time range: ${timeMin} to ${timeMax}`);

    // Fetch events from Google Calendar with expanded time range
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      `key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=50`;

    console.log(`🌐 Making request to Google Calendar API...`);

    const response = await fetch(calendarUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Google Calendar API error:', response.status, errorText);
      throw new Error(`Google Calendar API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const allEvents = data.items || [];
    
    console.log(`📊 Found ${allEvents.length} total events in expanded range`);

    // Log all events for debugging
    allEvents.forEach((event, index) => {
      console.log(`📋 Event ${index + 1}: "${event.summary}"`);
      if (event.start.dateTime) {
        console.log(`   DateTime: ${event.start.dateTime} - ${event.end.dateTime}`);
      } else if (event.start.date) {
        console.log(`   All-day: ${event.start.date} - ${event.end.date}`);
      }
    });

    // Filter events that occur on the target date
    const dateString = date; // YYYY-MM-DD format
    const relevantEvents = allEvents.filter(event => {
      if (event.start.dateTime) {
        // Regular timed event
        const eventStartDate = new Date(event.start.dateTime).toISOString().split('T')[0];
        const eventEndDate = new Date(event.end.dateTime).toISOString().split('T')[0];
        return eventStartDate <= dateString && eventEndDate >= dateString;
      } else if (event.start.date) {
        // All-day event
        const eventStartDate = event.start.date;
        const eventEndDate = event.end.date;
        return eventStartDate <= dateString && eventEndDate > dateString;
      }
      return false;
    });

    console.log(`🎯 Found ${relevantEvents.length} events for target date ${dateString}`);

    relevantEvents.forEach((event, index) => {
      console.log(`✅ Relevant Event ${index + 1}: "${event.summary}"`);
    });

    // Generate hourly slots from 9am to 6pm (business hours)
    const hourlyAvailability = [];
    for (let hour = 9; hour < 18; hour++) {
      // Create slot time range for the target date
      const slotStart = new Date(date + `T${hour.toString().padStart(2, '0')}:00:00`);
      const slotEnd = new Date(date + `T${(hour + 1).toString().padStart(2, '0')}:00:00`);

      console.log(`⏱️  Checking hour ${hour}:00 (${slotStart.toISOString()} - ${slotEnd.toISOString()})`);

      // Check if any relevant event conflicts with this hour slot
      const isConflict = relevantEvents.some(event => {
        if (event.start.dateTime && event.end.dateTime) {
          // Regular timed event
          const eventStart = new Date(event.start.dateTime);
          const eventEnd = new Date(event.end.dateTime);
          
          // Check if event overlaps with this hour slot
          const hasOverlap = eventStart < slotEnd && eventEnd > slotStart;
          
          if (hasOverlap) {
            console.log(`🚫 Conflict found: "${event.summary}" (${eventStart.toISOString()} - ${eventEnd.toISOString()}) overlaps with ${hour}:00`);
          }
          
          return hasOverlap;
        } else if (event.start.date) {
          // All-day event - blocks the entire day
          const eventStartDate = event.start.date;
          const eventEndDate = event.end.date;
          const hasOverlap = eventStartDate <= dateString && eventEndDate > dateString;
          
          if (hasOverlap) {
            console.log(`🚫 All-day conflict: "${event.summary}" blocks ${hour}:00`);
          }
          
          return hasOverlap;
        }
        return false;
      });

      const timeDisplay = hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
      
      hourlyAvailability.push({
        hour: hour,
        time: timeDisplay,
        available: !isConflict
      });

      console.log(`${!isConflict ? '✅' : '❌'} ${hour}:00 - ${!isConflict ? 'Available' : 'Busy'}`);
    }

    const availableCount = hourlyAvailability.filter(slot => slot.available).length;
    console.log(`📈 Summary: ${availableCount}/${hourlyAvailability.length} hours available`);

    return new Response(
      JSON.stringify({ 
        date: dateString,
        hourlyAvailability: hourlyAvailability,
        totalEvents: allEvents.length,
        relevantEvents: relevantEvents.length,
        timezone: 'Local timezone (browser-based)',
        debugInfo: {
          searchRange: `${timeMin} to ${timeMax}`,
          calendarId: calendarId
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Error checking availability:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hourlyAvailability: [],
        debugInfo: {
          message: 'Check the function logs for detailed error information',
          suggestedFixes: [
            'Verify Google Calendar API key is valid',
            'Check that Calendar ID is correct (should be email@gmail.com format)',
            'Ensure calendar is accessible/public',
            'Verify calendar has events in the requested date range'
          ]
        }
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
