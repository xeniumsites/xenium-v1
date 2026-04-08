import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { occasion, recipientName, recipientRelation, senderName, senderEmail, senderPhone, mood, features, story, deadline } = body;

    // Validate required fields
    if (!occasion || !recipientName || !senderName || !senderEmail || !mood || !features?.length || !story || !deadline) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Store in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from('xenium_requests').insert({
      occasion,
      recipient_name: recipientName,
      recipient_relation: recipientRelation || null,
      sender_name: senderName,
      sender_email: senderEmail,
      sender_phone: senderPhone || null,
      mood,
      features,
      story,
      deadline,
    });

    if (dbError) {
      console.error('DB insert error:', dbError);
      throw new Error('Failed to save request');
    }

    console.log('Xenium request saved successfully for:', senderEmail);

    return new Response(JSON.stringify({ success: true, message: 'Request received successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
