# Email System Validation

## Status

- **Domain `notify.xenium-sites.com`**: ✅ Verified and ready
- **Email infrastructure** (queues, tables, cron, templates): ✅ In place
- **`email_send_log`**: empty — no email has ever been successfully enqueued
- **Admin notifications on form submission**: ❌ Failing

## Root cause

The Edge Function logs for `submit-xenium-request` show:

```
Email notify error: FunctionsHttpError 401 Unauthorized
sb-error-code: UNAUTHORIZED_INVALID_JWT_FORMAT
```

`submit-xenium-request` calls `send-transactional-email` via `supabase.functions.invoke(...)` using a client created with the **service-role key**. The Supabase JS SDK's `functions.invoke` only forwards the JWT it was initialized with **for the user session** — when using a service-role client server-to-server, the Authorization header isn't attached the way the gateway expects, so it rejects with `UNAUTHORIZED_INVALID_JWT_FORMAT`. Meanwhile `send-transactional-email` has `verify_jwt = true`, so the gateway blocks the request before our code runs.

That's why the request gets saved successfully but no email is ever enqueued (and `email_send_log` stays empty).

## Fix

Inside `submit-xenium-request/index.ts`, replace the `supabase.functions.invoke(...)` call with a direct `fetch` to the function URL, explicitly passing the service-role key in both `Authorization: Bearer ...` and `apikey` headers. This is the standard pattern for server-to-server Edge Function invocation when the callee has `verify_jwt = true`.

```ts
const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseKey}`,  // service role
    'apikey': supabaseKey,
  },
  body: JSON.stringify({ templateName: 'new-xenium-request', ... }),
});
```

No DB or template changes needed.

## Validation steps after fix

1. Redeploy `submit-xenium-request`.
2. Submit a test request from the live form.
3. Confirm:
   - `email_send_log` gets a `pending` row, then `sent` (within ~5s, the cron interval).
   - `xeniumgifts@gmail.com` receives the "New Xenium request" email.
4. If `sent` doesn't appear, check `process-email-queue` logs and the pgmq `transactional_emails` queue.

## Files changed

- `supabase/functions/submit-xenium-request/index.ts` — switch invoke to direct fetch with service-role auth headers.
