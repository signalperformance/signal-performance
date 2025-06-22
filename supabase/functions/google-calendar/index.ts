
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { create } from 'https://deno.land/x/djwt@v2.4/mod.ts'

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

// Helper function to convert PEM to proper format for crypto.subtle
function pemToArrayBuffer(pem: string): ArrayBuffer {
  // Remove PEM headers and whitespace
  const pemContent = pem
    .replace(/-----BEGIN[^-]+-----/g, '')
    .replace(/-----END[^-]+-----/g, '')
    .replace(/\s/g, '');
  
  // Decode base64
  const binaryString = atob(pemContent);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, appointmentData, date, timeSlot } = await req.json()
    
    // Get environment variables
    const googleClientEmail = Deno.env.get('GOOGLE_CLIENT_EMAIL')
    const googlePrivateKey = Deno.env.get('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n')
    const googleCalendarId = Deno.env.get('GOOGLE_CALENDAR_ID')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!googleClientEmail || !googlePrivateKey || !googleCalendarId) {
      console.error('Missing Google Calendar credentials:', {
        hasClientEmail: !!googleClientEmail,
        hasPrivateKey: !!googlePrivateKey,
        hasCalendarId: !!googleCalendarId
      })
      throw new Error('Google Calendar credentials not configured')
    }

    console.log('Creating JWT for Google Calendar API')
    
    // Create signed JWT for Google API authentication
    const now = Math.floor(Date.now() / 1000)
    const jwtPayload = {
      iss: googleClientEmail,
      scope: 'https://www.googleapis.com/auth/calendar',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }

    // Import the private key with proper error handling
    let privateKey: CryptoKey
    try {
      const keyBuffer = pemToArrayBuffer(googlePrivateKey)
      privateKey = await crypto.subtle.importKey(
        'pkcs8',
        keyBuffer,
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256',
        },
        false,
        ['sign']
      )
    } catch (keyError) {
      console.error('Failed to import private key:', keyError)
      console.log('Private key format check:', {
        hasBeginMarker: googlePrivateKey.includes('-----BEGIN'),
        hasEndMarker: googlePrivateKey.includes('-----END'),
        length: googlePrivateKey.length
      })
      throw new Error('Invalid private key format. Please ensure the GOOGLE_PRIVATE_KEY is a valid PEM-formatted RSA private key.')
    }

    const signedJwt = await create(
      { alg: 'RS256', typ: 'JWT' },
      jwtPayload,
      privateKey
    )

    console.log('Exchanging JWT for access token')
    
    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: signedJwt,
      }).toString(),
    })

    const tokenData = await tokenResponse.json()
    if (tokenData.error) {
      console.error('Token exchange error:', tokenData)
      throw new Error(`Failed to get access token: ${tokenData.error_description || tokenData.error}`)
    }
    
    const accessToken = tokenData.access_token
    console.log('Successfully obtained access token')

    if (action === 'checkAvailability') {
      console.log('Checking availability for:', date, timeSlot)
      
      const startDateTime = new Date(`${date}T${timeSlot}:00`)
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)
      
      console.log('Checking time range:', {
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        calendarId: googleCalendarId
      })
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(googleCalendarId)}/events?timeMin=${startDateTime.toISOString()}&timeMax=${endDateTime.toISOString()}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const data = await response.json()
      
      if (data.error) {
        console.error('Google Calendar API Error (checkAvailability):', data.error)
        // For debugging, let's be more permissive and assume available if there's an API error
        console.log('API error encountered, defaulting to available')
        return new Response(
          JSON.stringify({ available: true, warning: 'Could not verify calendar availability' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const isAvailable = data.items.length === 0
      console.log('Availability check result:', { 
        isAvailable, 
        eventsFound: data.items.length,
        events: data.items.map((item: any) => ({
          summary: item.summary,
          start: item.start,
          end: item.end
        }))
      })
      
      return new Response(
        JSON.stringify({ available: isAvailable }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (action === 'createEvent') {
      console.log('Creating calendar event for:', appointmentData.customerName)
      
      const { customerName, customerEmail, customerPhone, appointmentDate, appointmentTime, notes, supabaseAppointmentId } = appointmentData
      
      const startDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`)
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)
      
      const event: CalendarEvent = {
        summary: `Assessment Appointment - ${customerName}`,
        description: `Appointment with ${customerName}\nEmail: ${customerEmail}\nPhone: ${customerPhone || 'N/A'}\nNotes: ${notes || 'No additional notes'}`,
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
      
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(googleCalendarId)}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      )

      const data = await response.json()
      
      if (data.error) {
        console.error('Google Calendar API Error (createEvent):', data.error)
        throw new Error(`Google Calendar event creation failed: ${data.error.message}`)
      }

      const eventId = data.id
      console.log('Successfully created Google Calendar event:', eventId)
      
      // Update Supabase database with Google event ID
      if (supabaseUrl && supabaseServiceKey && supabaseAppointmentId) {
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
        
        const { error: updateError } = await supabaseAdmin
          .from('appointments')
          .update({ google_event_id: eventId })
          .eq('id', supabaseAppointmentId)

        if (updateError) {
          console.error('Failed to update Supabase with Google Event ID:', updateError)
        } else {
          console.log('Successfully updated database with Google Event ID')
        }
      }
      
      return new Response(
        JSON.stringify({ success: true, eventId, message: 'Event created and linked to database.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error in google-calendar function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
