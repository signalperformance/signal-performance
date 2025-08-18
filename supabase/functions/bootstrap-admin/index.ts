import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create service role client for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if admin user already exists in auth
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail('admin@example.com');
    
    if (existingUser.user) {
      console.log('Admin user already exists in auth');
      return new Response(
        JSON.stringify({ success: true, message: 'Admin user already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if admin exists in admin_users table
    const { data: adminRecord, error: adminCheckError } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', 'admin@example.com')
      .single();

    if (adminCheckError || !adminRecord) {
      console.log('Admin record not found in admin_users table');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Admin record not found in database. Please contact system administrator.' 
        }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create the admin user in Supabase Auth
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'admin123',
      email_confirm: true // Skip email confirmation for admin
    });

    if (createError) {
      console.error('Error creating admin user:', createError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to create admin user: ' + createError.message 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Admin user created successfully:', newUser.user?.email);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Admin user created successfully. You can now log in.' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error in bootstrap-admin:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred: ' + error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});