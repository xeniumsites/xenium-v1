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
  is_manual: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminListResult {
  items: AdminOrder[];
  total: number;
  limit: number;
  offset: number;
}

async function call<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  // Completely bypass gotrue-js promises which can hang during token refresh
  const storageStr = localStorage.getItem("xenium-auth-token-v3");
  if (!storageStr) throw new Error("No auth token in storage");
  
  let token = null;
  try {
    const parsed = JSON.parse(storageStr);
    token = parsed?.session?.access_token || parsed?.access_token;
  } catch (e) {
    throw new Error("Invalid auth token format");
  }
  
  if (!token) throw new Error("No auth token");

  const url = import.meta.env.VITE_SUPABASE_URL + "/functions/v1/admin-orders";
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ action, ...body }),
  });

  if (!res.ok) {
    let err = "Admin request failed";
    try {
      const ebody = await res.json();
      err = ebody.error || err;
    } catch {}
    throw new Error(err);
  }

  return await res.json() as T;
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

export async function adminGetOrder(id: string): Promise<{ order: AdminOrder }> {
  return await call<{ order: AdminOrder }>("get", { id });
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
