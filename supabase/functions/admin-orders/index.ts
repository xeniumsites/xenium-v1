// Admin orders endpoint. Caller must be authenticated (Supabase JWT) AND
// listed in admin_users. Routes by `action` in the body.
//
//   list           -> { items, total }
//   get            -> { order }
//   update         -> { order }
//   create_manual  -> { order, paymentLinkUrl? }
//   resend_email   -> { ok }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { corsHeaders, json, preflight } from '../_shared/http.ts'
import { createPaymentLink } from '../_shared/razorpay.ts'

const SITE_URL = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://xenium-sites.com'

interface AdminContext {
  userId: string
  email: string
  supabase: ReturnType<typeof createClient>
  serviceClient: ReturnType<typeof createClient>
}

async function authenticate(req: Request): Promise<AdminContext | Response> {
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.replace(/^Bearer\s+/i, '').trim()
  if (!token) return json(401, { error: 'missing_auth' })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  // User-context client (RLS applies)
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const { data: userData, error: userErr } = await userClient.auth.getUser(token)
  if (userErr || !userData?.user) return json(401, { error: 'invalid_token' })

  // Service-role client for cross-RLS work
  const serviceClient = createClient(supabaseUrl, serviceKey)

  const { data: admin } = await serviceClient
    .from('admin_users')
    .select('user_id, email')
    .eq('user_id', userData.user.id)
    .maybeSingle()

  if (!admin) return json(403, { error: 'not_admin' })

  return {
    userId: userData.user.id,
    email: admin.email,
    supabase: userClient,
    serviceClient,
  }
}

Deno.serve(async (req) => {
  const pre = preflight(req)
  if (pre) return pre
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' })

  const ctx = await authenticate(req)
  if (ctx instanceof Response) return ctx

  let body: { action?: string; [k: string]: unknown }
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'invalid_json' })
  }

  switch (body.action) {
    case 'list':
      return await handleList(ctx, body)
    case 'get':
      return await handleGet(ctx, body)
    case 'update':
      return await handleUpdate(ctx, body)
    case 'create_manual':
      return await handleCreateManual(ctx, body)
    case 'resend_payment_email':
      return await handleResendEmail(ctx, body)
    case 'delete':
      return await handleDelete(ctx, body)
    default:
      return json(400, { error: 'unknown_action' })
  }
})

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
function lookupBy(id: string): { col: 'id' | 'short_code'; val: string } {
  return UUID_RE.test(id) ? { col: 'id', val: id } : { col: 'short_code', val: id }
}

async function handleList(ctx: AdminContext, body: Record<string, unknown>) {
  const limit = Math.min(Number(body.limit ?? 50), 200)
  const offset = Math.max(Number(body.offset ?? 0), 0)
  const search = (body.search as string | undefined)?.trim().toLowerCase()
  const paymentStatus = body.paymentStatus as string | undefined
  const productionStatus = body.productionStatus as string | undefined

  let q = ctx.serviceClient
    .from('xenium_requests')
    .select(
      'id, short_code, occasion, sender_name, sender_email, recipient_name, amount_paise, currency, payment_status, production_status, paid_at, created_at, is_manual',
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (paymentStatus) q = q.eq('payment_status', paymentStatus)
  if (productionStatus) q = q.eq('production_status', productionStatus)
  if (search) {
    q = q.or(
      [
        `short_code.ilike.%${search}%`,
        `sender_email.ilike.%${search}%`,
        `sender_name.ilike.%${search}%`,
        `recipient_name.ilike.%${search}%`,
        `occasion.ilike.%${search}%`,
      ].join(','),
    )
  }

  const { data, error, count } = await q
  if (error) {
    console.error('list error', error)
    return json(500, { error: 'db_error' })
  }
  return json(200, { items: data ?? [], total: count ?? 0, limit, offset })
}

async function handleGet(ctx: AdminContext, body: Record<string, unknown>) {
  const id = (body.id as string | undefined)?.trim()
  if (!id) return json(400, { error: 'id_required' })

  const { data, error } = await ctx.serviceClient
    .from('xenium_requests')
    .select('*')
    .eq(lookupBy(id).col, lookupBy(id).val)
    .maybeSingle()
  if (error) {
    console.error('get error', error)
    return json(500, { error: 'db_error' })
  }
  if (!data) return json(404, { error: 'not_found' })
  return json(200, { order: data })
}

const ALLOWED_FIELDS = new Set([
  'payment_status',
  'production_status',
  'delivery_url',
  'admin_notes',
  'amount_paise',
])

async function handleUpdate(ctx: AdminContext, body: Record<string, unknown>) {
  const id = (body.id as string | undefined)?.trim()
  const patch = body.patch as Record<string, unknown> | undefined
  if (!id) return json(400, { error: 'id_required' })
  if (!patch || typeof patch !== 'object') return json(400, { error: 'patch_required' })

  const safe: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(patch)) {
    if (ALLOWED_FIELDS.has(k)) safe[k] = v
  }
  if (Object.keys(safe).length === 0) return json(400, { error: 'no_fields' })

  // Stamp paid_at if status flips to paid
  if (safe.payment_status === 'paid') {
    safe.paid_at = safe.paid_at ?? new Date().toISOString()
    safe.production_status = safe.production_status ?? 'queued'
  }

  const { data, error } = await ctx.serviceClient
    .from('xenium_requests')
    .update(safe)
    .eq(lookupBy(id).col, lookupBy(id).val)
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('update error', error)
    return json(500, { error: 'db_error' })
  }
  if (!data) return json(404, { error: 'not_found' })

  // Optionally email customer about the status change
  if (body.emailCustomer) {
    await sendStatusEmail(ctx, data)
  }

  return json(200, { order: data })
}

async function handleCreateManual(ctx: AdminContext, body: Record<string, unknown>) {
  const required = ['occasion', 'recipientName', 'senderName', 'senderEmail', 'mood', 'features', 'story', 'deadline']
  for (const k of required) {
    if (!body[k]) return json(400, { error: `${k}_required` })
  }
  const amountPaise = Number(body.amountPaise ?? 75000)
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    return json(400, { error: 'invalid_amount' })
  }

  const { data: inserted, error: insErr } = await ctx.serviceClient
    .from('xenium_requests')
    .insert({
      occasion: String(body.occasion),
      recipient_name: String(body.recipientName),
      recipient_relation: body.recipientRelation ? String(body.recipientRelation) : null,
      sender_name: String(body.senderName),
      sender_email: String(body.senderEmail).toLowerCase(),
      sender_phone: body.senderPhone ? String(body.senderPhone) : null,
      mood: String(body.mood),
      features: body.features as string[],
      story: String(body.story),
      deadline: String(body.deadline),
      amount_paise: amountPaise,
      is_manual: true,
      production_status: body.skipPayment ? 'queued' : 'awaiting_payment',
      payment_status: body.skipPayment ? 'waived' : 'pending',
    })
    .select('*')
    .single()

  if (insErr || !inserted) {
    console.error('manual create error', insErr)
    return json(500, { error: 'db_error' })
  }

  let paymentLinkUrl: string | undefined
  if (!body.skipPayment) {
    try {
      const link = await createPaymentLink({
        amountPaise,
        description: `Xenium experience for ${inserted.occasion}`,
        referenceId: inserted.short_code ?? inserted.id,
        customer: {
          name: inserted.sender_name,
          email: inserted.sender_email,
          contact: inserted.sender_phone ?? undefined,
        },
        notes: { request_id: inserted.id, short_code: inserted.short_code, manual: 'true' },
        callbackUrl: `${SITE_URL}/track/${inserted.short_code ?? inserted.id}?paid=1`,
        expireBy: Math.floor(Date.now() / 1000) + 7 * 24 * 3600,
        notifyByEmail: false,
      })
      await ctx.serviceClient
        .from('xenium_requests')
        .update({
          payment_link_id: link.id,
          payment_link_url: link.short_url,
          payment_status: 'created',
        })
        .eq('id', inserted.id)
      paymentLinkUrl = link.short_url

      // Email the customer with the payment link
      if (body.emailCustomer ?? true) {
        await sendPaymentLinkEmail(ctx, inserted, link.short_url)
      }
    } catch (e) {
      console.error('manual create: payment link failed', e)
      return json(502, { error: 'razorpay_failed', message: (e as Error).message })
    }
  }

  return json(200, { order: { ...inserted, payment_link_url: paymentLinkUrl ?? null }, paymentLinkUrl })
}

async function handleResendEmail(ctx: AdminContext, body: Record<string, unknown>) {
  const id = (body.id as string | undefined)?.trim()
  if (!id) return json(400, { error: 'id_required' })
  const { data: row } = await ctx.serviceClient
    .from('xenium_requests')
    .select('*')
    .eq(lookupBy(id).col, lookupBy(id).val)
    .maybeSingle()
  if (!row) return json(404, { error: 'not_found' })
  if (!row.payment_link_url) return json(400, { error: 'no_payment_link' })
  await sendPaymentLinkEmail(ctx, row, row.payment_link_url)
  return json(200, { ok: true })
}

async function handleDelete(ctx: AdminContext, body: Record<string, unknown>) {
  const id = (body.id as string | undefined)?.trim()
  if (!id) return json(400, { error: 'id_required' })
  const lk = lookupBy(id)
  const { data: row } = await ctx.serviceClient
    .from('xenium_requests')
    .select('id')
    .eq(lk.col, lk.val)
    .maybeSingle()
  if (!row) return json(404, { error: 'not_found' })
  // Best-effort cleanup of related rows
  await ctx.serviceClient.from('tracking_otps').delete().eq('request_id', row.id)
  const { error } = await ctx.serviceClient.from('xenium_requests').delete().eq('id', row.id)
  if (error) {
    console.error('delete error', error)
    return json(500, { error: 'db_error' })
  }
  return json(200, { ok: true })
}

async function sendPaymentLinkEmail(
  ctx: AdminContext,
  row: { id: string; sender_email: string; sender_name: string; occasion: string; short_code: string; amount_paise: number; currency: string },
  paymentLinkUrl: string,
) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
      body: JSON.stringify({
        templateName: 'customer-payment-link',
        recipientEmail: row.sender_email,
        idempotencyKey: `payment-link-${row.id}-${Date.now()}`,
        templateData: {
          senderName: row.sender_name,
          occasion: row.occasion,
          shortCode: row.short_code,
          paymentLinkUrl,
          amount: formatINR(row.amount_paise),
          currency: row.currency,
          trackUrl: `${SITE_URL}/track/${row.short_code}`,
        },
      }),
    })
    if (!res.ok) console.error('payment-link email failed', res.status, await res.text())
  } catch (e) {
    console.error('payment-link email exception', e)
  }
}

async function sendStatusEmail(
  ctx: AdminContext,
  row: { id: string; sender_email: string; sender_name: string; occasion: string; short_code: string; production_status: string; delivery_url: string | null },
) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
      body: JSON.stringify({
        templateName: 'order-status-update',
        recipientEmail: row.sender_email,
        idempotencyKey: `status-${row.id}-${row.production_status}-${Date.now()}`,
        templateData: {
          senderName: row.sender_name,
          occasion: row.occasion,
          shortCode: row.short_code,
          status: row.production_status,
          deliveryUrl: row.delivery_url,
          trackUrl: `${SITE_URL}/track/${row.short_code}`,
        },
      }),
    })
    if (!res.ok) console.error('status email failed', res.status, await res.text())
  } catch (e) {
    console.error('status email exception', e)
  }
}

function formatINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}
