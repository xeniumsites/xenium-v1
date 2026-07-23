import { supabase } from "@/integrations/supabase/client";

export interface OrderStatus {
  shortCode: string;
  occasion: string;
  recipientName: string;
  amountPaise: number;
  currency: string;
  paymentStatus: string;
  productionStatus: string;
  paidAt: string | null;
  paymentLinkUrl: string | null;
  deliveryUrl: string | null;
  createdAt: string;
}

export interface TrackLookupResponse {
  /** When OTP verification is required, the function returns this and emails a code. */
  otpRequired?: boolean;
  /** Otherwise the order summary is returned directly. */
  order?: OrderStatus;
  /** Error code from the backend, if any. */
  error?: string;
  message?: string;
}

export async function trackOrder(code: string, email: string): Promise<TrackLookupResponse> {
  const { data, error } = await supabase.functions.invoke<unknown>("track-order", {
    body: { code, email },
  });
  if (error) {
    return await parseFunctionError(error, "We couldn't find that order.");
  }
  const d = data as Record<string, unknown>;
  if (d?.otpRequired) return { otpRequired: true };
  if (d?.error) return { error: String(d.error), message: String(d.message ?? "") };
  return { order: d as unknown as OrderStatus };
}

export async function verifyTrackingOtp(
  code: string,
  email: string,
  otp: string,
): Promise<TrackLookupResponse> {
  const { data, error } = await supabase.functions.invoke<unknown>("verify-tracking-otp", {
    body: { code, email, otp },
  });
  if (error) return await parseFunctionError(error, "Invalid or expired code.");
  const d = data as Record<string, unknown>;
  if (d?.error) return { error: String(d.error), message: String(d.message ?? "") };
  return { order: d as unknown as OrderStatus };
}

export async function checkPaymentStatus(code: string, email: string): Promise<OrderStatus | null> {
  const { data, error } = await supabase.functions.invoke<unknown>("check-payment-status", {
    body: { code, email },
  });
  if (error) return null;
  return data as OrderStatus;
}

/**
 * (Re)issue a Razorpay payment link for an order. `codeOrId` may be the
 * customer-facing short code (XEN-…) or the order UUID. `senderEmail` is
 * required — the edge function uses it as an ownership check.
 */
export async function createPaymentLink(codeOrId: string, senderEmail: string) {
  const { data, error } = await supabase.functions.invoke<unknown>("create-payment-link", {
    body: { requestId: codeOrId, senderEmail },
  });
  if (error) return null;
  return data as { paymentLinkUrl?: string; paymentStatus?: string; shortCode?: string };
}

export function paymentStatusLabel(s: string): { label: string; tone: "amber" | "green" | "red" | "muted" } {
  switch (s) {
    case "paid":
      return { label: "Paid", tone: "green" };
    case "waived":
      return { label: "Waived", tone: "green" };
    case "created":
    case "pending":
      return { label: "Awaiting payment", tone: "amber" };
    case "failed":
      return { label: "Payment failed", tone: "red" };
    case "cancelled":
      return { label: "Cancelled", tone: "muted" };
    case "expired":
      return { label: "Link expired", tone: "muted" };
    case "refunded":
      return { label: "Refunded", tone: "muted" };
    default:
      return { label: s, tone: "muted" };
  }
}

export function productionStatusLabel(s: string): { label: string; tone: "amber" | "violet" | "green" | "muted" | "rose" } {
  switch (s) {
    case "awaiting_payment":
      return { label: "Awaiting payment", tone: "amber" };
    case "queued":
      return { label: "Queued for production", tone: "violet" };
    case "in_progress":
      return { label: "In production", tone: "violet" };
    case "review":
      return { label: "Ready for your review", tone: "amber" };
    case "revisions":
      return { label: "Revisions in progress", tone: "violet" };
    case "delivered":
      return { label: "Delivered", tone: "green" };
    case "cancelled":
      return { label: "Cancelled", tone: "muted" };
    default:
      return { label: s, tone: "muted" };
  }
}

export function formatINR(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

async function parseFunctionError(error: unknown, fallback: string): Promise<TrackLookupResponse> {
  // supabase-js wraps a non-2xx edge-function response in a FunctionsHttpError
  // whose `context` is the raw Response. Read the JSON body so the backend's
  // real error code (e.g. "not_found") reaches friendlyError instead of the
  // generic "Edge Function returned a non-2xx status code" message.
  const ctx = (error as { context?: unknown })?.context;
  if (ctx && typeof (ctx as Response).json === "function") {
    try {
      const body = (await (ctx as Response).clone().json()) as { error?: string; message?: string };
      if (body && typeof body === "object" && body.error) {
        return { error: String(body.error), message: String(body.message ?? "") };
      }
    } catch {
      // body wasn't JSON — fall through to the generic handling below
    }
  }
  if (error && typeof error === "object" && "message" in error) {
    return { error: "function_error", message: String((error as { message?: string }).message) || fallback };
  }
  return { error: "function_error", message: fallback };
}
