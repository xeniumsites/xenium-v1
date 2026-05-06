// Razorpay helpers — server-side only (Deno edge functions).
// Keys come from env: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET.

const RZP_BASE = 'https://api.razorpay.com/v1'

function authHeader(): string {
  const id = Deno.env.get('RAZORPAY_KEY_ID')
  const secret = Deno.env.get('RAZORPAY_KEY_SECRET')
  if (!id || !secret) {
    throw new Error('Razorpay keys are not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)')
  }
  return 'Basic ' + btoa(`${id}:${secret}`)
}

export interface CreatePaymentLinkInput {
  amountPaise: number
  currency?: string
  description: string
  referenceId: string
  customer: { name: string; email: string; contact?: string }
  notes?: Record<string, string>
  callbackUrl?: string
  expireBy?: number // unix seconds
  notifyByEmail?: boolean
  notifyBySms?: boolean
}

export interface RazorpayPaymentLink {
  id: string
  short_url: string
  status: string
  amount: number
  currency: string
  reference_id?: string
  payments?: Array<{ payment_id: string; status: string }>
}

export async function createPaymentLink(
  input: CreatePaymentLinkInput,
): Promise<RazorpayPaymentLink> {
  const body = {
    amount: input.amountPaise,
    currency: input.currency ?? 'INR',
    accept_partial: false,
    description: input.description,
    reference_id: input.referenceId,
    customer: input.customer,
    notify: {
      email: input.notifyByEmail ?? false, // we'll send our own branded email
      sms: input.notifyBySms ?? false,
    },
    reminder_enable: true,
    notes: input.notes ?? {},
    ...(input.callbackUrl
      ? { callback_url: input.callbackUrl, callback_method: 'get' }
      : {}),
    ...(input.expireBy ? { expire_by: input.expireBy } : {}),
  }

  const res = await fetch(`${RZP_BASE}/payment_links`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Razorpay create payment_link failed (${res.status}): ${text}`)
  }
  return (await res.json()) as RazorpayPaymentLink
}

export async function fetchPaymentLink(id: string): Promise<RazorpayPaymentLink> {
  const res = await fetch(`${RZP_BASE}/payment_links/${id}`, {
    headers: { Authorization: authHeader() },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Razorpay fetch payment_link failed (${res.status}): ${text}`)
  }
  return (await res.json()) as RazorpayPaymentLink
}

export async function cancelPaymentLink(id: string): Promise<void> {
  const res = await fetch(`${RZP_BASE}/payment_links/${id}/cancel`, {
    method: 'POST',
    headers: { Authorization: authHeader() },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Razorpay cancel payment_link failed (${res.status}): ${text}`)
  }
}

// HMAC-SHA256 hex
async function hmacHex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Constant-time compare to avoid timing attacks
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return mismatch === 0
}

export async function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
): Promise<boolean> {
  const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
  if (!secret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not set')
    return false
  }
  if (!signatureHeader) return false
  const expected = await hmacHex(secret, rawBody)
  return safeEqual(expected, signatureHeader)
}
