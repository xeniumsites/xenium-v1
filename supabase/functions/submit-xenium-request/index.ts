import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send notification email via Resend-like approach or log for now
    // For now, we'll construct and log the request, and return success
    // In production, integrate with an email service

    console.log('New Xenium Request:', JSON.stringify({
      occasion,
      recipientName,
      recipientRelation,
      senderName,
      senderEmail,
      senderPhone,
      mood,
      features,
      story,
      deadline,
      submittedAt: new Date().toISOString(),
    }));

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
