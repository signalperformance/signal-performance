
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CalendarEvent {
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  attendees?: Array<{ email: string }>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, appointmentData, date, timeSlot } = await req.json()
    
    // You'll need to set these secrets in Supabase
    const googleClientEmail = Deno.env.get('GOOGLE_CLIENT_EMAIL')
    const googlePrivateKey = Deno.env.get('GOOGLE_PRIVATE_KEY')
    const googleCalendarId = Deno.env.get('GOOGLE_CALENDAR_ID')
    
    if (!googleClientEmail || !googlePrivateKey || !googleCalendarId) {
      throw new Error('Google Calendar credentials not configured')
    }

    // Simple JWT creation for Google service account
    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
    const now = Math.floor(Date.now() / 1000)
    const payload = btoa(JSON.stringify({
      iss: googleClientEmail,
      scope: 'https://www.googleapis.com/auth/calendar',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    }))

    // For this demo, we'll use a simplified approach
    // In production, you'd need proper JWT signing with the private key
    
    if (action === 'checkAvailability') {
      // Check if the time slot is available
      const startDateTime = new Date(`${date}T${timeSlot}:00`)
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) // 1 hour appointment
      
      // Here you would make a request to Google Calendar API to check for conflicts
      // For now, we'll simulate availability checking
      const isAvailable = Math.random() > 0.2 // 80% chance of being available
      
      return new Response(
        JSON.stringify({ available: isAvailable }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (action === 'createEvent') {
      const { customerName, customerEmail, appointmentDate, appointmentTime, notes } = appointmentData
      
      const startDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`)
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)
      
      const event: CalendarEvent = {
        summary: `Assessment Appointment - ${customerName}`,
        description: `Appointment with ${customerName}\nEmail: ${customerEmail}\nNotes: ${notes || 'No additional notes'}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Asia/Taipei'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Asia/Taipei'
        },
        attendees: [{ email: customerEmail }]
      }
      
      // Here you would create the event in Google Calendar
      // For now, we'll simulate event creation
      const eventId = 'simulated_event_' + Date.now()
      
      return new Response(
        JSON.stringify({ success: true, eventId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
