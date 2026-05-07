// Public order tracker.
// Two modes controlled by env var TRACK_REQUIRE_OTP (default 'false'):
//   - false: returns the order summary if (code, email) match
//   - true:  returns { otpRequired: true } and emails an OTP; client then
//            calls /verify-tracking-otp with code+email+otp to read the order.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { json, preflight } from '../_shared/http.ts'

const OTP_TTL_MS = 10 * 60 * 1000 // 10 minutes
const MAX_OTPS_PER_HOUR = 5

function digitOtp(): string {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  // 6 digits, padded
  return (arr[0] % 1_000_000).toString().padStart(6, '0')
}

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
  const requireOtp = (Deno.env.get('TRACK_REQUIRE_OTP') ?? 'false').toLowerCase() === 'true'
  const supabase = createClient(supabaseUrl, serviceKey)

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code)
  const lookupColumn = isUuid ? 'id' : 'short_code'
  const { data: row } = await supabase
    .from('xenium_requests')
    .select(
      'id, short_code, sender_email, sender_name, occasion, recipient_name, amount_paise, currency, payment_status, production_status, paid_at, payment_link_url, delivery_url, created_at',
    )
    .eq(lookupColumn, code)
    .maybeSingle()

  // Always respond uniformly to avoid email enumeration.
  const notFoundResponse = json(404, { error: 'not_found' })
  if (!row) return notFoundResponse
  if (row.sender_email.toLowerCase() !== email) return notFoundResponse

  if (!requireOtp) {
    return json(200, summarize(row))
  }

  // Rate-limit OTP requests per request_id.
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count: recent } = await supabase
    .from('tracking_otps')
    .select('id', { count: 'exact', head: true })
    .eq('request_id', row.id)
    .gte('created_at', since)
  if ((recent ?? 0) >= MAX_OTPS_PER_HOUR) {
    return json(429, { error: 'rate_limited', message: 'Too many codes requested. Try again in an hour.' })
  }

  const otp = digitOtp()
  const codeHash = await sha256Hex(otp)
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString()

  await supabase.from('tracking_otps').insert({
    request_id: row.id,
    email,
    code_hash: codeHash,
    expires_at: expiresAt,
  })

  // Send the OTP email via existing transactional infra.
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
      body: JSON.stringify({
        templateName: 'tracking-otp',
        recipientEmail: row.sender_email,
        idempotencyKey: `tracking-otp-${row.id}-${Date.now()}`,
        templateData: {
          senderName: row.sender_name,
          shortCode: row.short_code,
          otp,
          expiresInMinutes: 10,
        },
      }),
    })
    if (!res.ok) console.error('tracking-otp email failed', res.status, await res.text())
  } catch (e) {
    console.error('tracking-otp email exception', e)
  }

  return json(200, { otpRequired: true })
})

function summarize(row: {
  short_code: string
  occasion: string
  recipient_name: string
  amount_paise: number
  currency: string
  payment_status: string
  production_status: string
  paid_at: string | null
  payment_link_url: string | null
  delivery_url: string | null
  created_at: string
  sender_name?: string
}) {
  return {
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
  }
}
