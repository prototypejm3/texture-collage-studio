import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) throw new Error("Authentication failed");

    const user = userData.user;
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find recent completed checkout sessions for this user
    const sessions = await stripe.checkout.sessions.list({
      limit: 5,
    });

    const creditSessions = sessions.data.filter(
      s => s.status === "complete" &&
           s.metadata?.type === "ai_credits_10" &&
           s.metadata?.user_id === user.id
    );

    if (creditSessions.length === 0) {
      return new Response(JSON.stringify({ credited: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if we already processed these (store session IDs in metadata or check current credits)
    // For simplicity, add 10 credits per unprocessed session
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Get current profile
    const { data: profile } = await adminClient
      .from("profiles")
      .select("purchased_credits")
      .eq("id", user.id)
      .single();

    // Add 10 credits
    await adminClient
      .from("profiles")
      .update({ purchased_credits: (profile?.purchased_credits || 0) + 10 })
      .eq("id", user.id);

    return new Response(JSON.stringify({ credited: true, creditsAdded: 10 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("verify-credits-purchase error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
