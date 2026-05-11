// deno-lint-ignore-file no-explicit-any
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(url, key, { auth: { persistSession: false } });

    const { count, error } = await supabase
      .from("xenium_requests")
      .select("id", { count: "exact", head: true })
      .eq("production_status", "delivered");

    if (error) throw error;

    const ordersDelivered = count ?? 0;

    return new Response(
      JSON.stringify({ ordersDelivered }),
      {
        headers: {
          ...corsHeaders,
          "content-type": "application/json",
          // 10-minute edge cache.
          "cache-control": "public, max-age=600, s-maxage=600",
        },
      },
    );
  } catch (err) {
    console.error("get-public-stats error", err);
    return new Response(
      JSON.stringify({ ordersDelivered: 0 }),
      { status: 200, headers: { ...corsHeaders, "content-type": "application/json" } },
    );
  }
});
