import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { createPaymentLink } from '../_shared/razorpay.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://xenium-sites.com'
const DEFAULT_AMOUNT_PAISE = Number(Deno.env.get('XENIUM_DEFAULT_AMOUNT_PAISE') ?? '75000')

// Best-effort in-memory rate limit per IP (per-instance only — this is a
// spam/cost speed bump, not a hard guarantee under concurrent instances).
const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>()
const RATE_WINDOW_MS = 10 * 60_000
const RATE_MAX = 5

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = RATE_LIMIT.get(ip)
  if (!entry || entry.resetAt < now) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_MAX) return false
  entry.count += 1
  return true
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('cf-connecting-ip') ??
    'anon'

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests — please try again later.' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const { occasion, recipientName, recipientRelation, senderName, senderEmail, senderPhone, mood, features, story, deadline, website } = body

    // Honeypot: the real form strips this field before submitting, so any
    // request that includes a non-empty `website` is a bot. Pretend success
    // without touching the DB or sending any email.
    if (typeof website === 'string' && website.length > 0) {
      console.warn('Honeypot triggered, silently ignoring', { ip })
      return new Response(
        JSON.stringify({ success: true, message: 'Request received successfully', shortCode: 'XEN-000000', id: null, paymentLinkUrl: null, paymentStatus: 'pending' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (!occasion || !recipientName || !senderName || !senderEmail || !mood || !features?.length || !story || !deadline) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: inserted, error: dbError } = await supabase
      .from('xenium_requests')
      .insert({
        occasion,
        recipient_name: recipientName,
        recipient_relation: recipientRelation || null,
        sender_name: senderName,
        sender_email: String(senderEmail).trim().toLowerCase(),
        sender_phone: senderPhone || null,
        mood,
        features,
        story,
        deadline,
        amount_paise: DEFAULT_AMOUNT_PAISE,
      })
      .select('id, short_code, sender_email, sender_name, occasion, amount_paise, currency')
      .single()

    if (dbError || !inserted) {
      console.error('DB insert error:', dbError)
      throw new Error('Failed to save request')
    }

    console.log('Xenium request saved successfully', inserted.id, inserted.short_code)

    // Sanitize phone for Razorpay (digits only, 8-14 chars). Drop if invalid.
    const digits = (senderPhone || '').replace(/\D/g, '')
    // Strip leading country code prefix duplicates; keep last 12 digits max
    const trimmed = digits.length > 14 ? digits.slice(-14) : digits
    const rzpContact = trimmed.length >= 8 && trimmed.length <= 14 ? trimmed : undefined

    // Create the Razorpay payment link.
    let paymentLinkUrl: string | null = null
    let paymentStatus: 'created' | 'pending' = 'pending'
    try {
      const link = await createPaymentLink({
        amountPaise: inserted.amount_paise,
        description: `Xenium experience for ${occasion}`,
        referenceId: inserted.short_code ?? inserted.id,
        customer: {
          name: senderName,
          email: inserted.sender_email,
          contact: rzpContact,
        },
        notes: {
          request_id: inserted.id,
          short_code: inserted.short_code ?? '',
          occasion,
        },
        callbackUrl: `${SITE_URL}/track/${inserted.short_code ?? inserted.id}?paid=1`,
        expireBy: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
        notifyByEmail: false,
      })
      paymentLinkUrl = link.short_url
      paymentStatus = 'created'
      await supabase
        .from('xenium_requests')
        .update({
          payment_link_id: link.id,
          payment_link_url: link.short_url,
          payment_status: 'created',
        })
        .eq('id', inserted.id)
    } catch (e) {
      console.error('Payment link creation failed (non-fatal):', e)
    }

    // Customer-facing email with payment link (if available).
    if (paymentLinkUrl) {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
          },
          body: JSON.stringify({
            templateName: 'customer-payment-link',
            recipientEmail: inserted.sender_email,
            idempotencyKey: `payment-link-${inserted.id}`,
            templateData: {
              senderName,
              occasion,
              shortCode: inserted.short_code,
              paymentLinkUrl,
              amount: `₹${(inserted.amount_paise / 100).toLocaleString('en-IN')}`,
              currency: inserted.currency,
              trackUrl: `${SITE_URL}/track/${inserted.short_code ?? inserted.id}`,
            },
          }),
        })
        if (!res.ok) console.error('customer payment-link email failed', res.status, await res.text())
      } catch (e) {
        console.error('customer payment-link email exception', e)
      }
    }

    // Admin notification (existing behavior).
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        body: JSON.stringify({
          templateName: 'new-xenium-request',
          recipientEmail: 'xeniumgifts@gmail.com',
          idempotencyKey: `xenium-request-${inserted.id}`,
          templateData: {
            occasion,
            recipientName,
            recipientRelation: recipientRelation || '',
            senderName,
            senderEmail: inserted.sender_email,
            senderPhone: senderPhone || '',
            mood,
            features,
            story,
            deadline,
            shortCode: inserted.short_code,
            paymentLinkUrl: paymentLinkUrl ?? '(creation failed)',
            submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          },
        }),
      })
      if (!res.ok) console.error('admin notify email failed', res.status, await res.text())
    } catch (e) {
      console.error('admin notify exception', e)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Request received successfully',
        shortCode: inserted.short_code,
        id: inserted.id,
        amountPaise: inserted.amount_paise,
        currency: inserted.currency,
        paymentLinkUrl,
        paymentStatus,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
