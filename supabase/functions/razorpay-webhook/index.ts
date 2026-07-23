// Razorpay webhook receiver.
// Verify_jwt = false. Authentication is via the X-Razorpay-Signature header
// (HMAC SHA-256 of the raw body using RAZORPAY_WEBHOOK_SECRET).
//
// Subscribed events:
//   - payment_link.paid
//   - payment_link.cancelled
//   - payment_link.expired
//   - payment.failed (informational)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { json, preflight } from '../_shared/http.ts'
import { verifyWebhookSignature } from '../_shared/razorpay.ts'

Deno.serve(async (req) => {
  const pre = preflight(req)
  if (pre) return pre

  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })

  // Read raw body (string) for signature verification.
  const rawBody = await req.text()
  const sigHeader = req.headers.get('x-razorpay-signature')
  const ok = await verifyWebhookSignature(rawBody, sigHeader)
  if (!ok) {
    console.warn('Webhook signature mismatch')
    return json(401, { error: 'invalid_signature' })
  }

  let evt: {
    event?: string
    payload?: {
      payment_link?: { entity?: { id: string; reference_id?: string; status: string } }
      payment?: { entity?: { id: string; status: string; amount?: number } }
    }
  }
  try {
    evt = JSON.parse(rawBody)
  } catch {
    return json(400, { error: 'invalid_json' })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  const linkEntity = evt.payload?.payment_link?.entity
  const paymentEntity = evt.payload?.payment?.entity

  if (!linkEntity?.id) {
    // Not a payment_link event we care about — ack and return.
    return json(200, { ok: true, ignored: evt.event })
  }

  // Find the matching xenium_request.
  const { data: row, error: rowErr } = await supabase
    .from('xenium_requests')
    .select('id, sender_email, sender_name, occasion, short_code, payment_status')
    .eq('payment_link_id', linkEntity.id)
    .maybeSingle()

  if (rowErr) {
    console.error('DB fetch failed in webhook', rowErr)
    return json(500, { error: 'db_error' })
  }
  if (!row) {
    console.warn('No xenium_request matched payment_link_id', linkEntity.id)
    return json(200, { ok: true, unmatched: true })
  }

  const updates: Record<string, unknown> = {}

  switch (evt.event) {
    case 'payment_link.paid': {
      // Idempotent: if already paid, just ack.
      if (row.payment_status !== 'paid') {
        updates.payment_status = 'paid'
        updates.paid_at = new Date().toISOString()
        updates.production_status = 'queued'
        if (paymentEntity?.id) updates.razorpay_payment_id = paymentEntity.id
      }
      break
    }
    case 'payment_link.cancelled':
      // Never downgrade an already-paid/waived order. Webhook delivery order
      // is not guaranteed, so a late/stray cancelled event must not clobber a
      // successful payment.
      if (row.payment_status !== 'paid' && row.payment_status !== 'waived') {
        updates.payment_status = 'cancelled'
      }
      break
    case 'payment_link.expired':
      // Same guard as cancelled — an expired event must not overwrite 'paid'.
      if (row.payment_status !== 'paid' && row.payment_status !== 'waived') {
        updates.payment_status = 'expired'
      }
      break
    case 'payment.failed':
      // Don't downgrade a paid order; only mark failed if still pending/created.
      if (row.payment_status === 'created' || row.payment_status === 'pending') {
        updates.payment_status = 'failed'
      }
      break
    default:
      return json(200, { ok: true, ignored: evt.event })
  }

  if (Object.keys(updates).length > 0) {
    const { error: updErr } = await supabase
      .from('xenium_requests')
      .update(updates)
      .eq('id', row.id)
    if (updErr) {
      console.error('DB update failed in webhook', updErr)
      return json(500, { error: 'db_update_failed' })
    }
  }

  // Send branded confirmation email on first transition to paid.
  if (updates.payment_status === 'paid') {
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
        body: JSON.stringify({
          templateName: 'payment-confirmed',
          recipientEmail: row.sender_email,
          idempotencyKey: `payment-confirmed-${row.id}`,
          templateData: {
            senderName: row.sender_name,
            occasion: row.occasion,
            shortCode: row.short_code,
            trackUrl: `${Deno.env.get('PUBLIC_SITE_URL') ?? 'https://xenium-sites.com'}/track/${row.short_code}`,
          },
        }),
      })
      if (!res.ok) console.error('payment-confirmed email failed', res.status, await res.text())
    } catch (e) {
      console.error('payment-confirmed email exception', e)
    }
  }

  return json(200, { ok: true })
})
