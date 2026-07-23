// Public, gated reveal endpoint for the delivered experience.
//
// The raw embedded website URL (delivery_url) is NEVER sent to the client until
// it is unlocked. Two token types:
//   - reveal_token  (recipient link): gated by reveal_at timer, then password.
//   - preview_token (buyer link):     bypasses timer + password (private preview).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { json, preflight } from '../_shared/http.ts'

function constantTimeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const ab = enc.encode(a)
  const bb = enc.encode(b)
  if (ab.length !== bb.length) return false
  let diff = 0
  for (let i = 0; i < ab.length; i++) diff |= ab[i] ^ bb[i]
  return diff === 0
}

Deno.serve(async (req) => {
  const pre = preflight(req)
  if (pre) return pre
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })

  let body: { token?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'invalid_json' })
  }

  const token = body.token?.trim()
  const password = body.password?.trim() ?? ''
  // Tokens are random url-safe strings; reject anything else so it can't alter
  // the PostgREST .or() filter below.
  if (!token || !/^[A-Za-z0-9_-]{16,128}$/.test(token)) return json(404, { error: 'not_found' })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: row, error } = await supabase
    .from('xenium_requests')
    .select(
      'short_code, occasion, recipient_name, delivery_url, reveal_at, reveal_password, reveal_token, preview_token, production_status',
    )
    .or(`reveal_token.eq.${token},preview_token.eq.${token}`)
    .maybeSingle()

  if (error) console.error('reveal-order lookup failed', error)
  if (!row) return json(404, { error: 'not_found' })

  const base = { occasion: row.occasion, recipientName: row.recipient_name }

  // Only a delivered order with an embed URL can be revealed.
  if (row.production_status !== 'delivered' || !row.delivery_url) {
    return json(200, { status: 'not_ready', ...base })
  }

  // Buyer preview link: bypass the timer + password.
  if (row.preview_token && row.preview_token === token) {
    return json(200, { status: 'unlocked', embedUrl: row.delivery_url, isPreview: true, ...base })
  }

  // Recipient reveal link: enforce the timer, then the password.
  if (row.reveal_at && new Date(row.reveal_at).getTime() > Date.now()) {
    return json(200, { status: 'locked_timer', revealAt: row.reveal_at, ...base })
  }
  if (row.reveal_password && !constantTimeEqual(password, row.reveal_password)) {
    return json(200, { status: 'locked_password', ...base })
  }
  return json(200, { status: 'unlocked', embedUrl: row.delivery_url, ...base })
})
