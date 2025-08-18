import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Supabase clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Client for auth check
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } }
    });

    // Service role client for admin operations
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user is admin
    const { data: adminUser, error: adminError } = await supabaseAuth
      .from('admin_users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (adminError || !adminUser) {
      console.error('Admin check error:', adminError);
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Deleting user:', userId);

    // Delete user from auth (this will cascade to user_profiles due to foreign key)
    const { error: authDeleteError } = await supabaseService.auth.admin.deleteUser(userId);

    if (authDeleteError) {
      console.error('Auth delete error:', authDeleteError);
      return new Response(JSON.stringify({ error: 'Failed to delete auth user: ' + authDeleteError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Successfully deleted user:', userId);

    return new Response(JSON.stringify({ success: true, message: 'User deleted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Unexpected error in admin-delete-client:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});