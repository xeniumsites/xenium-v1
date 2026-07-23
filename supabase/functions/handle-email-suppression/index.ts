import { createClient } from 'npm:@supabase/supabase-js@2'
import { Webhook } from 'npm:svix@1'

// Inbound webhook from Resend, fired on bounce/complaint events for emails
// sent by process-email-queue. Verified via Svix signing (Resend's webhook
// delivery provider) using the RESEND_WEBHOOK_SECRET from the Resend
// dashboard (Webhooks → your endpoint → Signing Secret).
interface ResendWebhookEvent {
  type: string
  created_at: string
  data: {
    email_id?: string
    message_id?: string
    from?: string
    to?: string[]
    subject?: string
    bounce?: { type?: string; subType?: string; message?: string }
  }
}

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const webhookSecret = Deno.env.get('RESEND_WEBHOOK_SECRET')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables')
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  // Svix verification requires the raw, unparsed body.
  const rawBody = await req.text()

  let event: ResendWebhookEvent
  try {
    const wh = new Webhook(webhookSecret)
    event = wh.verify(rawBody, {
      'svix-id': req.headers.get('svix-id') ?? '',
      'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
      'svix-signature': req.headers.get('svix-signature') ?? '',
    }) as ResendWebhookEvent
  } catch (error) {
    console.error('Webhook signature verification failed', {
      error: error instanceof Error ? error.message : String(error),
    })
    return jsonResponse({ error: 'Invalid signature' }, 401)
  }

  // Only bounce/complaint events are relevant here — everything else
  // (delivered, opened, clicked, ...) is ignored.
  // Unsubscribes are handled separately by handle-email-unsubscribe, which
  // writes to suppressed_emails directly via our own token flow.
  const reason: 'bounce' | 'complaint' | null =
    event.type === 'email.bounced'
      ? 'bounce'
      : event.type === 'email.complained'
        ? 'complaint'
        : null

  if (!reason) {
    return jsonResponse({ success: true, skipped: true })
  }

  const recipientEmail = event.data.to?.[0]
  if (!recipientEmail) {
    console.error('Suppression event missing recipient', { type: event.type })
    return jsonResponse({ error: 'Missing recipient in payload' }, 400)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const normalizedEmail = recipientEmail.toLowerCase()

  // Only PERMANENT (hard) bounces should suppress an address. Transient bounces
  // (mailbox full, greylisting, temporary DNS) are recoverable — suppressing on
  // them would permanently block a valid customer from all transactional mail.
  // Complaints always suppress. suppressed_emails is append-only with no removal
  // path, so we must be conservative about what we add to it.
  const bounceType = event.data.bounce?.type ?? ''
  const isPermanentBounce = reason === 'bounce' && /permanent/i.test(bounceType)
  const shouldSuppress = reason === 'complaint' || isPermanentBounce

  // 1. Upsert to suppressed_emails only for permanent bounces / complaints.
  if (shouldSuppress) {
    const { error: suppressError } = await supabase
      .from('suppressed_emails')
      .upsert(
        {
          email: normalizedEmail,
          reason,
          metadata: event.data.bounce ?? null,
        },
        { onConflict: 'email' },
      )

    if (suppressError) {
      console.error('Failed to upsert suppressed email', {
        error: suppressError,
        email_redacted: normalizedEmail[0] + '***@' + normalizedEmail.split('@')[1],
      })
      return jsonResponse({ error: 'Failed to write suppression' }, 500)
    }
  }

  // 2. Append a log entry for the event (never update existing rows). Transient
  // bounces are logged but not suppressed.
  const sendLogStatus =
    reason === 'complaint' ? 'complained' : isPermanentBounce ? 'bounced' : 'soft_bounced'
  const sendLogMessage =
    reason === 'complaint'
      ? 'Spam complaint — recipient marked email as spam'
      : isPermanentBounce
        ? `Permanent bounce (${bounceType}) — address invalid or rejected`
        : `Transient bounce (${bounceType || 'unspecified'}) — not suppressed`

  const { error: insertError } = await supabase
    .from('email_send_log')
    .insert({
      message_id: event.data.email_id ?? event.data.message_id ?? null,
      template_name: 'system',
      recipient_email: normalizedEmail,
      status: sendLogStatus,
      error_message: sendLogMessage,
      metadata: event.data.bounce ?? null,
    })

  if (insertError) {
    // Non-fatal — log and continue. The suppression (if any) was already recorded.
    console.warn('Failed to insert email_send_log', { error: insertError })
  }

  console.log('Suppression processed', {
    email_redacted: normalizedEmail[0] + '***@' + normalizedEmail.split('@')[1],
    reason,
    suppressed: shouldSuppress,
    type: event.type,
  })

  return jsonResponse({ success: true, suppressed: shouldSuppress })
})
