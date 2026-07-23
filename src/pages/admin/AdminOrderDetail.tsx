import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Mail, ExternalLink, Copy, Trash2, CheckCircle2, Gift, Wand2, Clock, Check, Eye } from "lucide-react";
import {
  AdminOrder,
  EditRequest,
  adminDeleteOrder,
  adminDeliverOrder,
  adminGetOrder,
  adminResendPaymentEmail,
  adminResolveEditRequest,
  adminUpdateOrder,
} from "@/lib/adminClient";
import { formatINR } from "@/lib/paymentClient";

const PAYMENT_OPTIONS = ["pending", "created", "paid", "failed", "cancelled", "expired", "refunded", "waived"];
const PRODUCTION_OPTIONS = ["awaiting_payment", "queued", "in_progress", "review", "revisions", "delivered", "cancelled"];

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveBusy, setSaveBusy] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  // Editable fields
  const [paymentStatus, setPaymentStatus] = useState("");
  const [productionStatus, setProductionStatus] = useState("");
  const [deliveryUrl, setDeliveryUrl] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [emailCustomer, setEmailCustomer] = useState(false);
  const [editRequests, setEditRequests] = useState<EditRequest[]>([]);

  // Deliver & reveal
  const [revealAtLocal, setRevealAtLocal] = useState("");
  const [revealPwd, setRevealPwd] = useState("");
  const [notifyOnDeliver, setNotifyOnDeliver] = useState(true);
  const [delivering, setDelivering] = useState(false);

  const toLocalInput = (iso: string | null): string => {
    if (!iso) return "";
    const d = new Date(iso);
    const off = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - off).toISOString().slice(0, 16);
  };

  const applyOrder = (o: AdminOrder) => {
    setOrder(o);
    setPaymentStatus(o.payment_status);
    setProductionStatus(o.production_status);
    setDeliveryUrl(o.delivery_url ?? "");
    setAdminNotes(o.admin_notes ?? "");
    setRevealAtLocal(toLocalInput(o.reveal_at));
    setRevealPwd(o.reveal_password ?? "");
  };

  const generatePassword = () => {
    const first = (order?.recipient_name ?? "").split(/\s+/)[0].replace(/[^A-Za-z]/g, "");
    const base = first ? first[0].toUpperCase() + first.slice(1).toLowerCase() : "Xenium";
    setRevealPwd(`${base}${Math.floor(100 + Math.random() * 900)}`);
  };

  const deliver = async () => {
    if (!order) return;
    if (!/^https?:\/\//i.test(deliveryUrl.trim())) {
      setError("The experience URL must start with http:// or https://");
      return;
    }
    setDelivering(true);
    setError(null);
    try {
      const res = await adminDeliverOrder(order.short_code, {
        embedUrl: deliveryUrl.trim(),
        revealAt: revealAtLocal ? new Date(revealAtLocal).toISOString() : null,
        revealPassword: revealPwd.trim() || null,
        notify: notifyOnDeliver,
      });
      applyOrder(res.order);
      setSavedFlash(notifyOnDeliver ? "Delivered & customer notified." : "Delivered.");
      setTimeout(() => setSavedFlash(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delivery failed");
    } finally {
      setDelivering(false);
    }
  };

  const resolveEdit = async (editId: string, status: "open" | "resolved") => {
    try {
      await adminResolveEditRequest(editId, status);
      setEditRequests((prev) => prev.map((r) => (r.id === editId ? { ...r, status } : r)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update edit request");
    }
  };

  useEffect(() => {
    if (!id) return;
    document.title = `Admin · ${id} | Xenium`;
    let cancelled = false;
    setLoading(true);
    adminGetOrder(id)
      .then((res) => {
        if (cancelled) return;
        applyOrder(res.order);
        setEditRequests(res.editRequests ?? []);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load order");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <p className="text-xenium-rose mb-3">{error ?? "Order not found"}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
      </div>
    );
  }

  const save = async () => {
    setError(null);

    // Only send fields the admin actually changed (dirty-tracking). Sending the
    // whole form would let a stale dropdown value overwrite a field the webhook
    // updated after this page loaded (e.g. revert a webhook-confirmed 'paid').
    const patch: Parameters<typeof adminUpdateOrder>[1] = {};
    if (paymentStatus !== order.payment_status) patch.payment_status = paymentStatus;
    if (productionStatus !== order.production_status) patch.production_status = productionStatus;
    const nextDelivery = deliveryUrl.trim() || null;
    if (nextDelivery !== (order.delivery_url ?? null)) patch.delivery_url = nextDelivery;
    const nextNotes = adminNotes.trim() || null;
    if (nextNotes !== (order.admin_notes ?? null)) patch.admin_notes = nextNotes;

    if (nextDelivery && !/^https?:\/\//i.test(nextDelivery)) {
      setError("Delivery URL must start with http:// or https://");
      return;
    }

    if (Object.keys(patch).length === 0 && !emailCustomer) {
      setSavedFlash("No changes to save.");
      setTimeout(() => setSavedFlash(null), 2500);
      return;
    }

    setSaveBusy(true);
    try {
      const res = await adminUpdateOrder(order.short_code, patch, { emailCustomer });
      setOrder(res.order);
      // Re-sync editable fields to the server's post-update truth.
      setPaymentStatus(res.order.payment_status);
      setProductionStatus(res.order.production_status);
      setDeliveryUrl(res.order.delivery_url ?? "");
      setAdminNotes(res.order.admin_notes ?? "");
      setSavedFlash("Saved.");
      setTimeout(() => setSavedFlash(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaveBusy(false);
    }
  };

  const resend = async () => {
    setResendBusy(true);
    try {
      await adminResendPaymentEmail(order.short_code);
      setSavedFlash("Payment email re-sent.");
      setTimeout(() => setSavedFlash(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to resend email");
    } finally {
      setResendBusy(false);
    }
  };

  const markComplete = async () => {
    setSaveBusy(true);
    setError(null);
    try {
      const res = await adminUpdateOrder(
        order.short_code,
        { production_status: "delivered", payment_status: order.payment_status === "pending" || order.payment_status === "created" ? "paid" : order.payment_status },
        { emailCustomer: true },
      );
      setOrder(res.order);
      setProductionStatus(res.order.production_status);
      setPaymentStatus(res.order.payment_status);
      setSavedFlash("Marked complete & customer notified.");
      setTimeout(() => setSavedFlash(null), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setSaveBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete order ${order.short_code}? This cannot be undone.`)) return;
    setSaveBusy(true);
    try {
      await adminDeleteOrder(order.short_code);
      navigate("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setSaveBusy(false);
    }
  };

  const copy = (s: string) => navigator.clipboard?.writeText(s).catch(() => {});
  const revealBase = typeof window !== "undefined" ? window.location.origin : "https://xenium-sites.com";

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={14} /> Back to orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-xenium-amber/70 mb-1">Order</p>
          <h1 className="font-display text-3xl font-light flex items-center gap-2">
            {order.short_code}
            <button onClick={() => copy(order.short_code)} title="Copy" className="text-muted-foreground/60 hover:text-foreground">
              <Copy size={14} />
            </button>
            {order.is_manual && <span className="text-[10px] uppercase tracking-widest text-xenium-amber/70">manual</span>}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Created {new Date(order.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {order.payment_link_url && (
            <a
              href={order.payment_link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 min-h-[36px] rounded-full border border-border hover:bg-muted/20 inline-flex items-center gap-1.5"
            >
              <ExternalLink size={11} /> Payment link
            </a>
          )}
          {order.payment_link_url && (
            <button
              onClick={resend}
              disabled={resendBusy}
              className="text-xs px-3 min-h-[36px] rounded-full border border-border hover:bg-muted/20 inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {resendBusy ? <Loader2 size={11} className="animate-spin" /> : <Mail size={11} />} Resend payment email
            </button>
          )}
          <button
            onClick={markComplete}
            disabled={saveBusy}
            className="text-xs px-3 min-h-[36px] rounded-full border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCircle2 size={11} /> Mark complete
          </button>
          <button
            onClick={remove}
            disabled={saveBusy}
            className="text-xs px-3 min-h-[36px] rounded-full border border-xenium-rose/40 text-xenium-rose hover:bg-xenium-rose/10 inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Trash2 size={11} /> Delete
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-4 rounded-xl border border-xenium-rose/30 bg-xenium-rose/5 text-xenium-rose text-sm">{error}</div>}
      {savedFlash && <div className="mb-4 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-sm">{savedFlash}</div>}

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="glass-card p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Customer</h2>
          <Field label="Name" value={order.sender_name} />
          <Field label="Email" value={order.sender_email} />
          <Field label="Phone" value={order.sender_phone ?? "—"} />
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground pt-2">Recipient</h2>
          <Field label="Name" value={order.recipient_name} />
          <Field label="Relation" value={order.recipient_relation ?? "—"} />
        </section>

        <section className="glass-card p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Brief</h2>
          <Field label="Occasion" value={order.occasion} />
          <Field label="Mood" value={order.mood} />
          <Field label="Deadline" value={order.deadline} />
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60">Features</p>
            <p className="text-sm text-foreground/90">{order.features.join(", ")}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">Their story</p>
            <p className="text-sm text-foreground/85 whitespace-pre-wrap">{order.story}</p>
          </div>
        </section>

        <section className="glass-card p-6 space-y-4 lg:col-span-2">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Payment</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">Amount</p>
              <p className="text-foreground/90">{formatINR(order.amount_paise)} {order.currency}</p>
            </div>
            <Select label="Payment status" value={paymentStatus} onChange={setPaymentStatus} options={PAYMENT_OPTIONS} />
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">Razorpay payment ID</p>
              <p className="text-foreground/90 font-mono text-xs break-all">{order.razorpay_payment_id ?? "—"}</p>
            </div>
          </div>

          <h2 className="text-xs uppercase tracking-widest text-muted-foreground pt-3">Production</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Production status" value={productionStatus} onChange={setProductionStatus} options={PRODUCTION_OPTIONS} />
          </div>
          <p className="text-[11px] text-muted-foreground/60">
            Use the “Deliver &amp; reveal” panel below to attach the experience URL and send it to the customer.
          </p>

          <Textarea label="Admin notes (internal only)" value={adminNotes} onChange={setAdminNotes} placeholder="Anything you want to remember about this order…" />

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={emailCustomer}
              onChange={(e) => setEmailCustomer(e.target.checked)}
              className="accent-xenium-violet-mid"
            />
            Email the customer about this status change
          </label>

          <div className="pt-2">
            <button
              type="button"
              onClick={save}
              disabled={saveBusy}
              className="gradient-full text-foreground font-semibold inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm disabled:opacity-60"
            >
              {saveBusy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save changes
            </button>
          </div>
        </section>

        {/* Deliver & reveal */}
        <section className="glass-card p-6 space-y-4 lg:col-span-2">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Gift size={13} className="text-xenium-amber" /> Deliver &amp; reveal
          </h2>
          <p className="text-[11px] text-muted-foreground/70 -mt-1">
            The experience URL is embedded behind the reveal page and never shown to the recipient until the timer
            passes and the password matches. The buyer gets a preview link that bypasses both.
          </p>

          <Input
            label="Experience URL (embedded — kept private)"
            value={deliveryUrl}
            onChange={setDeliveryUrl}
            placeholder="https://your-built-site.example.com/aisha"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">Reveal at (optional)</p>
              <input
                type="datetime-local"
                value={revealAtLocal}
                onChange={(e) => setRevealAtLocal(e.target.value)}
                className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-xenium-violet-mid/40 [color-scheme:dark]"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">Secret word (optional)</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={revealPwd}
                  onChange={(e) => setRevealPwd(e.target.value)}
                  placeholder="e.g. Aisha284"
                  className="flex-1 min-w-0 bg-muted/20 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xenium-violet-mid/40"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  title="Generate from recipient name"
                  className="shrink-0 px-3 rounded-xl border border-border hover:bg-muted/20 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs"
                >
                  <Wand2 size={13} /> Generate
                </button>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={notifyOnDeliver} onChange={(e) => setNotifyOnDeliver(e.target.checked)} className="accent-xenium-violet-mid" />
            Email the buyer their reveal + preview links now
          </label>

          <div className="pt-1">
            <button
              type="button"
              onClick={deliver}
              disabled={delivering}
              className="gradient-full text-foreground font-semibold inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm disabled:opacity-60"
            >
              {delivering ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
              {order.delivered_at ? "Update & re-notify" : "Deliver & notify"}
            </button>
          </div>

          {order.reveal_token && (
            <div className="pt-3 border-t border-border/40 space-y-2 text-sm">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60">Live links</p>
              <LinkRow icon={<Gift size={12} />} label="Reveal (recipient)" url={`${revealBase}/x/${order.reveal_token}`} onCopy={copy} />
              {order.preview_token && (
                <LinkRow icon={<Eye size={12} />} label="Preview (buyer)" url={`${revealBase}/x/${order.preview_token}`} onCopy={copy} />
              )}
              {order.reveal_password && (
                <p className="text-muted-foreground">Secret word: <span className="text-foreground font-medium">{order.reveal_password}</span></p>
              )}
              {order.reveal_at && (
                <p className="text-muted-foreground inline-flex items-center gap-1.5">
                  <Clock size={12} /> Unlocks {new Date(order.reveal_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                </p>
              )}
            </div>
          )}
        </section>

        {/* Edit requests */}
        <section className="glass-card p-6 space-y-4 lg:col-span-2">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Edit requests ({editRequests.length})</h2>
          {editRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground/70">No edit requests for this order.</p>
          ) : (
            <ul className="space-y-3">
              {editRequests.map((r) => (
                <li key={r.id} className={`rounded-xl border p-4 ${r.status === "open" ? "border-xenium-amber/40 bg-xenium-amber/5" : "border-border/50 bg-muted/10"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{r.message}</p>
                    <button
                      type="button"
                      onClick={() => resolveEdit(r.id, r.status === "open" ? "resolved" : "open")}
                      className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-border hover:bg-muted/20 inline-flex items-center gap-1.5"
                    >
                      {r.status === "open" ? <><Check size={12} /> Resolve</> : "Reopen"}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground/60 mt-2">
                    {new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} · {r.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function LinkRow({ icon, label, url, onCopy }: { icon: React.ReactNode; label: string; url: string; onCopy: (s: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground/70 inline-flex items-center gap-1.5 w-32 shrink-0">{icon} {label}</span>
      <button
        type="button"
        onClick={() => onCopy(url)}
        title="Copy link"
        className="flex-1 min-w-0 text-left text-xs text-foreground/80 bg-muted/20 border border-border/50 rounded-lg px-3 py-2 truncate hover:border-xenium-violet-mid/40"
      >
        {url}
      </button>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-foreground shrink-0" title="Open">
        <ExternalLink size={13} />
      </a>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60">{label}</p>
      <p className="text-foreground/90 text-sm break-words">{value}</p>
    </div>
  );
}

function Input({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20"
        {...rest}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, ...rest }: { label: string; value: string; onChange: (v: string) => void } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value">) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20"
        {...rest}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-xenium-violet-mid/40 [&>option]:bg-background [&>option]:text-foreground"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o.replace(/_/g, " ")}</option>
        ))}
      </select>
    </div>
  );
}
