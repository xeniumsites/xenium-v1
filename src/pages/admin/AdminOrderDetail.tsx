import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Mail, ExternalLink, Copy, Trash2, CheckCircle2 } from "lucide-react";
import { AdminOrder, adminDeleteOrder, adminGetOrder, adminResendPaymentEmail, adminUpdateOrder } from "@/lib/adminClient";
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

  useEffect(() => {
    if (!id) return;
    document.title = `Admin · ${id} | Xenium`;
    let cancelled = false;
    setLoading(true);
    adminGetOrder(id)
      .then((res) => {
        if (cancelled) return;
        setOrder(res.order);
        setPaymentStatus(res.order.payment_status);
        setProductionStatus(res.order.production_status);
        setDeliveryUrl(res.order.delivery_url ?? "");
        setAdminNotes(res.order.admin_notes ?? "");
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
    setSaveBusy(true);
    setError(null);
    try {
      const res = await adminUpdateOrder(
        order.short_code,
        {
          payment_status: paymentStatus,
          production_status: productionStatus,
          delivery_url: deliveryUrl.trim() || null,
          admin_notes: adminNotes.trim() || null,
        },
        { emailCustomer },
      );
      setOrder(res.order);
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

  const copy = (s: string) => navigator.clipboard?.writeText(s).catch(() => {});

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
            <Input label="Delivery URL (private link)" value={deliveryUrl} onChange={setDeliveryUrl} placeholder="https://xenium-sites.com/x/abc" />
          </div>

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
      </div>
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
        className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xenium-violet-mid/40"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o.replace(/_/g, " ")}</option>
        ))}
      </select>
    </div>
  );
}
