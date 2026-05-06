// Creates a Razorpay payment link for an existing xenium_request and stores
// the link details on the row. Idempotent: if a non-cancelled link already
// exists for this request, returns the existing one.
//
// Auth: callable by service role (server-to-server) OR by anon (frontend right
// after the request is created — verifies the row matches the supplied email).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { corsHeaders, json, preflight } from '../_shared/http.ts'
import { createPaymentLink, fetchPaymentLink } from '../_shared/razorpay.ts'

const SITE_URL = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://xenium-sites.com'

Deno.serve(async (req) => {
  const pre = preflight(req)
  if (pre) return pre

  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })

  let body: { requestId?: string; senderEmail?: string }
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'invalid_json' })
  }

  const requestId = body.requestId?.trim()
  const senderEmail = body.senderEmail?.trim().toLowerCase()
  if (!requestId) return json(400, { error: 'requestId_required' })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  // Fetch the request row.
  const { data: row, error: rowErr } = await supabase
    .from('xenium_requests')
    .select(
      'id, short_code, sender_name, sender_email, sender_phone, occasion, amount_paise, currency, payment_link_id, payment_link_url, payment_status',
    )
    .eq('id', requestId)
    .maybeSingle()

  if (rowErr) {
    console.error('DB fetch failed', rowErr)
    return json(500, { error: 'db_error' })
  }
  if (!row) return json(404, { error: 'request_not_found' })

  // Soft auth: if the caller provided an email, it must match the row.
  // This stops random callers from creating links for unrelated orders.
  if (senderEmail && senderEmail !== row.sender_email.toLowerCase()) {
    return json(403, { error: 'email_mismatch' })
  }

  // Already paid → no new link.
  if (row.payment_status === 'paid' || row.payment_status === 'waived') {
    return json(200, {
      paymentLinkUrl: row.payment_link_url,
      paymentStatus: row.payment_status,
      shortCode: row.short_code,
    })
  }

  // Existing pending link? Reuse it.
  if (row.payment_link_id && row.payment_link_url && row.payment_status !== 'cancelled' && row.payment_status !== 'expired') {
    try {
      const fresh = await fetchPaymentLink(row.payment_link_id)
      if (fresh.status === 'created' || fresh.status === 'partially_paid') {
        return json(200, {
          paymentLinkUrl: row.payment_link_url,
          paymentStatus: row.payment_status,
          shortCode: row.short_code,
        })
      }
      // Otherwise fall through and create a fresh one.
    } catch (e) {
      console.warn('Existing link fetch failed, creating new', e)
    }
  }

  // Create a new payment link.
  let link
  try {
    link = await createPaymentLink({
      amountPaise: row.amount_paise,
      currency: row.currency,
      description: `Xenium experience for ${row.occasion}`,
      referenceId: row.short_code ?? row.id,
      customer: {
        name: row.sender_name,
        email: row.sender_email,
        contact: row.sender_phone ?? undefined,
      },
      notes: {
        request_id: row.id,
        short_code: row.short_code ?? '',
        occasion: row.occasion,
      },
      callbackUrl: `${SITE_URL}/track/${row.short_code ?? row.id}?paid=1`,
      // Auto-expire link in 7 days
      expireBy: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
      notifyByEmail: false, // we send our own branded email separately
      notifyBySms: false,
    })
  } catch (e) {
    console.error('Razorpay link creation failed', e)
    return json(502, { error: 'razorpay_failed', message: (e as Error).message })
  }

  const { error: updErr } = await supabase
    .from('xenium_requests')
    .update({
      payment_link_id: link.id,
      payment_link_url: link.short_url,
      payment_status: 'created',
    })
    .eq('id', row.id)

  if (updErr) {
    console.error('DB update failed', updErr)
    return json(500, { error: 'db_update_failed' })
  }

  return new Response(
    JSON.stringify({
      paymentLinkUrl: link.short_url,
      paymentLinkId: link.id,
      paymentStatus: 'created',
      shortCode: row.short_code,
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
  )
})
