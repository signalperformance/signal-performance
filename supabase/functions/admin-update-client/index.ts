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
    const { 
      userId, 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      membershipPlan, 
      monthlyRenewalDate, 
      notes, 
      isActive 
    } = body;

    console.log('Updating user:', userId, 'with data:', body);

    // Update auth user if email or password provided
    if (email || password) {
      const updateData: any = {};
      if (email) updateData.email = email;
      if (password) updateData.password = password;

      const { error: authUpdateError } = await supabaseService.auth.admin.updateUserById(
        userId,
        updateData
      );

      if (authUpdateError) {
        console.error('Auth update error:', authUpdateError);
        return new Response(JSON.stringify({ error: 'Failed to update auth user: ' + authUpdateError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Update user profile
    const { data: updatedProfile, error: profileError } = await supabaseService
      .from('user_profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        membership_plan: membershipPlan,
        monthly_renewal_date: monthlyRenewalDate,
        notes: notes,
        is_active: isActive
      })
      .eq('id', userId)
      .select()
      .single();

    if (profileError) {
      console.error('Profile update error:', profileError);
      return new Response(JSON.stringify({ error: 'Failed to update profile: ' + profileError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Successfully updated user profile:', updatedProfile);

    return new Response(JSON.stringify({ profile: updatedProfile }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Unexpected error in admin-update-client:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});