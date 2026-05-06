// Companion to track-order. Verifies a 6-digit OTP and returns the order
// summary on success.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { json, preflight } from '../_shared/http.ts'

const MAX_ATTEMPTS = 6

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req) => {
  const pre = preflight(req)
  if (pre) return pre

  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })

  let body: { code?: string; email?: string; otp?: string }
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'invalid_json' })
  }

  const code = body.code?.trim()
  const email = body.email?.trim().toLowerCase()
  const otp = body.otp?.trim()
  if (!code || !email || !otp) return json(400, { error: 'fields_required' })
  if (!/^\d{6}$/.test(otp)) return json(400, { error: 'invalid_otp_format' })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  // Fetch the request first.
  const { data: row } = await supabase
    .from('xenium_requests')
    .select(
      'id, short_code, sender_email, occasion, recipient_name, amount_paise, currency, payment_status, production_status, paid_at, payment_link_url, delivery_url, created_at',
    )
    .or(`short_code.eq.${code},id.eq.${code}`)
    .maybeSingle()

  const generic = json(404, { error: 'not_found_or_invalid' })
  if (!row) return generic
  if (row.sender_email.toLowerCase() !== email) return generic

  // Fetch the latest unconsumed, unexpired OTP for this request + email.
  const { data: otpRow } = await supabase
    .from('tracking_otps')
    .select('id, code_hash, attempts, expires_at, consumed_at')
    .eq('request_id', row.id)
    .eq('email', email)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!otpRow) return generic
  if (new Date(otpRow.expires_at).getTime() < Date.now()) {
    return json(410, { error: 'otp_expired' })
  }
  if (otpRow.attempts >= MAX_ATTEMPTS) {
    return json(429, { error: 'too_many_attempts' })
  }

  const tryHash = await sha256Hex(otp)
  if (tryHash !== otpRow.code_hash) {
    await supabase
      .from('tracking_otps')
      .update({ attempts: otpRow.attempts + 1 })
      .eq('id', otpRow.id)
    return json(401, { error: 'wrong_otp' })
  }

  // Mark consumed and stamp the request as verified.
  const nowIso = new Date().toISOString()
  await supabase.from('tracking_otps').update({ consumed_at: nowIso }).eq('id', otpRow.id)
  await supabase
    .from('xenium_requests')
    .update({ tracking_email_verified_at: nowIso })
    .eq('id', row.id)

  return json(200, {
    shortCode: row.short_code,
    occasion: row.occasion,
    recipientName: row.recipient_name,
    amountPaise: row.amount_paise,
    currency: row.currency,
    paymentStatus: row.payment_status,
    productionStatus: row.production_status,
    paidAt: row.paid_at,
    paymentLinkUrl: row.payment_link_url,
    deliveryUrl: row.delivery_url,
    createdAt: row.created_at,
  })
})
