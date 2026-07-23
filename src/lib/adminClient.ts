import { supabase } from "@/integrations/supabase/client";

export interface AdminOrder {
  id: string;
  short_code: string;
  occasion: string;
  recipient_name: string;
  recipient_relation: string | null;
  sender_name: string;
  sender_email: string;
  sender_phone: string | null;
  mood: string;
  features: string[];
  story: string;
  deadline: string;
  amount_paise: number;
  currency: string;
  payment_link_id: string | null;
  payment_link_url: string | null;
  payment_status: string;
  paid_at: string | null;
  razorpay_payment_id: string | null;
  production_status: string;
  delivery_url: string | null;
  admin_notes: string | null;
  reveal_at: string | null;
  reveal_password: string | null;
  reveal_token: string | null;
  preview_token: string | null;
  delivered_at: string | null;
  is_manual: boolean;
  created_at: string;
  updated_at: string;
}

export interface EditRequest {
  id: string;
  request_id: string;
  message: string;
  status: "open" | "resolved";
  created_at: string;
}

/** Known transactional email template keys (for the test-send tool). */
export const EMAIL_TEMPLATES = [
  "new-xenium-request",
  "customer-payment-link",
  "payment-confirmed",
  "order-status-update",
  "tracking-otp",
  "order-delivered",
  "edit-request-received",
  "edit-request-ack",
] as const;

export interface AdminListResult {
  items: AdminOrder[];
  total: number;
  limit: number;
  offset: number;
}

async function call<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.functions.invoke<T>("admin-orders", {
    body: { action, ...body },
  });
  if (error) throw new Error(error.message ?? "Admin request failed");
  return data as T;
}

export async function adminListOrders(opts: {
  limit?: number;
  offset?: number;
  search?: string;
  paymentStatus?: string;
  productionStatus?: string;
} = {}): Promise<AdminListResult> {
  return await call<AdminListResult>("list", opts);
}

export async function adminGetOrder(id: string): Promise<{ order: AdminOrder; editRequests: EditRequest[] }> {
  return await call<{ order: AdminOrder; editRequests: EditRequest[] }>("get", { id });
}

/** Deliver an order: attach the embed URL, set the reveal timer/password, and notify the buyer. */
export async function adminDeliverOrder(
  id: string,
  input: { embedUrl: string; revealAt?: string | null; revealPassword?: string | null; notify?: boolean },
): Promise<{ order: AdminOrder }> {
  return await call<{ order: AdminOrder }>("deliver", { id, ...input });
}

export async function adminResolveEditRequest(editId: string, status: "open" | "resolved" = "resolved"): Promise<{ ok: boolean }> {
  return await call<{ ok: boolean }>("resolve_edit_request", { editId, status });
}

export async function adminSendTestEmail(templateName: string, to: string): Promise<{ ok: boolean }> {
  return await call<{ ok: boolean }>("send_test_email", { templateName, to });
}

export async function adminUpdateOrder(
  id: string,
  patch: Partial<Pick<AdminOrder, "payment_status" | "production_status" | "delivery_url" | "admin_notes" | "amount_paise">>,
  options: { emailCustomer?: boolean } = {},
): Promise<{ order: AdminOrder }> {
  return await call<{ order: AdminOrder }>("update", {
    id,
    patch,
    emailCustomer: options.emailCustomer ?? false,
  });
}

export async function adminCreateManualOrder(input: {
  occasion: string;
  recipientName: string;
  recipientRelation?: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  mood: string;
  features: string[];
  story: string;
  deadline: string;
  amountPaise?: number;
  skipPayment?: boolean;
  emailCustomer?: boolean;
}): Promise<{ order: AdminOrder; paymentLinkUrl?: string }> {
  return await call<{ order: AdminOrder; paymentLinkUrl?: string }>("create_manual", input);
}

export async function adminResendPaymentEmail(id: string): Promise<{ ok: boolean }> {
  return await call<{ ok: boolean }>("resend_payment_email", { id });
}

export async function adminDeleteOrder(id: string): Promise<{ ok: boolean }> {
  return await call<{ ok: boolean }>("delete", { id });
}
