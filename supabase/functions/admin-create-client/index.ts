// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    // Verify caller is authenticated
    const { data: authUserData, error: authErr } = await supabaseAuth.auth.getUser();
    if (authErr || !authUserData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Check if caller is an admin (exists in admin_users table)
    const { data: adminRow, error: adminCheckErr } = await supabaseAuth
      .from("admin_users")
      .select("id")
      .eq("email", authUserData.user.email)
      .maybeSingle();

    if (adminCheckErr || !adminRow) {
      return new Response(JSON.stringify({ error: "Forbidden: not an admin" }), {
        status: 403,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      membershipPlan,
      playerType,
      monthlyRenewalDate, // YYYY-MM-DD
      notes,
      isActive,
    } = body as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
      membershipPlan: "basic" | "pro";
      playerType: "amateur" | "pro";
      monthlyRenewalDate?: string;
      notes?: string;
      isActive?: boolean;
    };

    if (!email || !password || !firstName || !lastName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create the auth user
    const { data: created, error: createErr } = await supabaseService.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        membership_plan: membershipPlan,
      },
    });

    if (createErr || !created.user) {
      return new Response(JSON.stringify({ error: createErr?.message || "Failed to create user" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const authUserId = created.user.id;

    // Insert profile (use auth user id as primary key so we can join easily)
    const { data: profile, error: insertErr } = await supabaseService
      .from("user_profiles")
      .insert({
        id: authUserId,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        membership_plan: membershipPlan,
        player_type: playerType,
        profile_picture: null,
        notes: notes || null,
        monthly_renewal_date: monthlyRenewalDate ? new Date(monthlyRenewalDate).toISOString().slice(0, 10) : null,
        is_active: isActive ?? true,
      })
      .select()
      .maybeSingle();

    if (insertErr) {
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(
      JSON.stringify({ success: true, profile }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});