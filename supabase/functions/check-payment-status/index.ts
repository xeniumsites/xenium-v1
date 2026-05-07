// Polling fallback for the frontend / for development before webhooks are
// configured. Reconciles a single order's payment_status with Razorpay.
//
// Public endpoint — but to prevent enumeration, the caller must supply the
// short_code (or id) AND the sender email; we only return data if they match.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { json, preflight } from '../_shared/http.ts'
import { fetchPaymentLink } from '../_shared/razorpay.ts'

Deno.serve(async (req) => {
  const pre = preflight(req)
  if (pre) return pre

  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })

  let body: { code?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'invalid_json' })
  }

  const code = body.code?.trim()
  const email = body.email?.trim().toLowerCase()
  if (!code || !email) return json(400, { error: 'code_and_email_required' })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  // Allow lookup by short_code (XEN-…) or full UUID.
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code)
  const lookupColumn = isUuid ? 'id' : 'short_code'
  const { data: row } = await supabase
    .from('xenium_requests')
    .select(
      'id, short_code, payment_link_id, payment_link_url, payment_status, paid_at, production_status, sender_email, occasion, recipient_name, amount_paise, currency',
    )
    .eq(lookupColumn, code)
    .maybeSingle()

  if (!row) return json(404, { error: 'not_found' })
  if (row.sender_email.toLowerCase() !== email) return json(403, { error: 'mismatch' })

  // If link exists and we're not already paid, ask Razorpay for current state.
  if (row.payment_link_id && row.payment_status !== 'paid' && row.payment_status !== 'waived') {
    try {
      const fresh = await fetchPaymentLink(row.payment_link_id)
      const mapped = mapStatus(fresh.status)
      if (mapped && mapped !== row.payment_status) {
        const updates: Record<string, unknown> = { payment_status: mapped }
        if (mapped === 'paid') {
          updates.paid_at = new Date().toISOString()
          updates.production_status = 'queued'
          if (fresh.payments?.[0]?.payment_id) updates.razorpay_payment_id = fresh.payments[0].payment_id
        }
        await supabase.from('xenium_requests').update(updates).eq('id', row.id)
        Object.assign(row, updates)
      }
    } catch (e) {
      console.error('check-payment-status fetch failed', e)
      // Continue with last known status
    }
  }

  return json(200, {
    shortCode: row.short_code,
    paymentStatus: row.payment_status,
    productionStatus: row.production_status,
    paidAt: row.paid_at,
    paymentLinkUrl: row.payment_link_url,
    amountPaise: row.amount_paise,
    currency: row.currency,
    occasion: row.occasion,
    recipientName: row.recipient_name,
  })
})

function mapStatus(rzpStatus: string): string | null {
  switch (rzpStatus) {
    case 'created':
    case 'partially_paid':
      return 'created'
    case 'paid':
      return 'paid'
    case 'cancelled':
      return 'cancelled'
    case 'expired':
      return 'expired'
    default:
      return null
  }
}
