// Public. Lets a customer request edits to their delivered Xenium within 24h of
// delivery. Verifies (short_code|id, email), checks the window, records the
// request, and emails the admin + acks the customer.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { json, preflight } from '../_shared/http.ts'

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000

async function sendEmail(
  supabaseUrl: string,
  serviceKey: string,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) console.error('edit-request email failed', res.status, await res.text())
  } catch (e) {
    console.error('edit-request email exception', e)
  }
}

Deno.serve(async (req) => {
  const pre = preflight(req)
  if (pre) return pre
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })

  let body: { code?: string; email?: string; message?: string }
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'invalid_json' })
  }

  const code = body.code?.trim()
  const email = body.email?.trim().toLowerCase()
  const message = body.message?.trim()
  if (!code || !email || !message) return json(400, { error: 'fields_required' })
  if (message.length > 2000) return json(400, { error: 'message_too_long' })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, serviceKey)

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code)
  const { data: row, error } = await supabase
    .from('xenium_requests')
    .select('id, short_code, sender_email, sender_name, occasion, delivered_at, production_status')
    .eq(isUuid ? 'id' : 'short_code', code)
    .maybeSingle()

  if (error) console.error('request-edit lookup failed', error)
  const generic = json(404, { error: 'not_found' })
  if (!row) return generic
  if (row.sender_email.toLowerCase() !== email) return generic

  if (!row.delivered_at) return json(409, { error: 'not_delivered' })
  const deliveredMs = new Date(row.delivered_at).getTime()
  // NaN (unparseable timestamp) fails safe → treat the window as closed.
  if (isNaN(deliveredMs) || Date.now() - deliveredMs > EDIT_WINDOW_MS) {
    return json(409, { error: 'edit_window_closed' })
  }

  const { error: insErr } = await supabase
    .from('order_edit_requests')
    .insert({ request_id: row.id, message })
  if (insErr) {
    console.error('request-edit insert failed', insErr)
    return json(500, { error: 'db_error' })
  }

  const site = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://xenium-sites.com'
  await sendEmail(supabaseUrl, serviceKey, {
    templateName: 'edit-request-received',
    recipientEmail: 'xeniumgifts@gmail.com',
    idempotencyKey: `edit-req-${row.id}-${Date.now()}`,
    templateData: {
      shortCode: row.short_code,
      senderName: row.sender_name,
      senderEmail: row.sender_email,
      occasion: row.occasion,
      message,
      adminUrl: `${site}/admin/orders/${row.short_code}`,
    },
  })
  await sendEmail(supabaseUrl, serviceKey, {
    templateName: 'edit-request-ack',
    recipientEmail: row.sender_email,
    idempotencyKey: `edit-ack-${row.id}-${Date.now()}`,
    templateData: {
      senderName: row.sender_name,
      shortCode: row.short_code,
      occasion: row.occasion,
      trackUrl: `${site}/track/${row.short_code}`,
    },
  })

  return json(200, { ok: true })
})
