import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Eye,
  Pencil,
  Gift,
} from "lucide-react";
import {
  OrderStatus,
  checkPaymentStatus,
  createPaymentLink,
  formatINR,
  paymentStatusLabel,
  productionStatusLabel,
  requestEdit,
  trackOrder,
  verifyTrackingOtp,
} from "@/lib/paymentClient";

type Stage = "lookup" | "otp" | "view";

/** Only http/https links are safe to render as an href (blocks javascript:/data:). */
function isSafeHttpUrl(url: string | null | undefined): url is string {
  return !!url && /^https?:\/\//i.test(url);
}

export default function TrackOrder() {
  const { orderId } = useParams<{ orderId?: string }>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const justPaid = params.get("paid") === "1";

  const [stage, setStage] = useState<Stage>(orderId ? "lookup" : "lookup");
  const [code, setCode] = useState(orderId ?? "");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderStatus | null>(null);

  useEffect(() => {
    document.title = orderId ? `Track ${orderId} | Xenium` : "Track your order | Xenium";
  }, [orderId]);

  // If we landed back from Razorpay's success callback, give the webhook a
  // few seconds and poll for the latest status.
  // NOTE: depend on stable primitives (shortCode + paymentStatus), NOT the whole
  // `order` object — each checkPaymentStatus returns a fresh object reference, so
  // depending on `order` would tear down and restart this effect every tick,
  // resetting `attempt` and firing requests back-to-back with no cap.
  const orderShortCode = order?.shortCode;
  const orderPaymentStatus = order?.paymentStatus;
  useEffect(() => {
    if (!justPaid || !orderShortCode) return;
    if (orderPaymentStatus === "paid") return;
    let cancelled = false;
    let attempt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async () => {
      if (cancelled) return;
      attempt++;
      const fresh = await checkPaymentStatus(orderShortCode, email);
      if (cancelled) return;
      // Merge — checkPaymentStatus omits reveal fields; don't clobber them.
      if (fresh) setOrder((prev) => (prev ? { ...prev, ...fresh } : fresh));
      if (fresh?.paymentStatus !== "paid" && attempt < 6) {
        timer = setTimeout(tick, 4000);
      }
    };
    // Initial delay so the webhook has a moment to land before the first poll.
    timer = setTimeout(tick, 3000);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justPaid, orderShortCode, orderPaymentStatus, email]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!code.trim() || !email.trim()) {
      setError("Order ID and email are both required.");
      return;
    }
    setLoading(true);
    try {
      const res = await trackOrder(code.trim(), email.trim());
      if (res.otpRequired) {
        setStage("otp");
        setInfo("We've emailed you a 6-digit code. It's valid for 10 minutes.");
      } else if (res.order) {
        setOrder(res.order);
        setStage("view");
      } else {
        setError(friendlyError(res.error, res.message));
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Please enter the 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyTrackingOtp(code.trim(), email.trim(), otp.trim());
      if (res.order) {
        setOrder(res.order);
        setStage("view");
      } else {
        setError(friendlyError(res.error, res.message));
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (!order) return;
    setLoading(true);
    const fresh = await checkPaymentStatus(order.shortCode, email);
    // Merge — checkPaymentStatus omits reveal fields; don't clobber them.
    if (fresh) setOrder((prev) => (prev ? { ...prev, ...fresh } : fresh));
    setLoading(false);
  };

  const [regenerating, setRegenerating] = useState(false);
  // Issue a fresh payment link when the previous one expired or was cancelled.
  const regenerate = async () => {
    if (!order || !email.trim()) return;
    setRegenerating(true);
    setError(null);
    setInfo(null);
    const res = await createPaymentLink(order.shortCode, email.trim());
    if (res?.paymentLinkUrl) {
      const fresh = await checkPaymentStatus(order.shortCode, email.trim());
      setOrder(
        fresh ?? {
          ...order,
          paymentStatus: res.paymentStatus ?? "created",
          paymentLinkUrl: res.paymentLinkUrl ?? order.paymentLinkUrl,
        },
      );
      setInfo("A fresh payment link is ready below.");
    } else {
      setError("We couldn't generate a new payment link. Please email xeniumgifts@gmail.com.");
    }
    setRegenerating(false);
  };

  const reset = () => {
    setStage("lookup");
    setOrder(null);
    setOtp("");
    setError(null);
    setInfo(null);
    if (orderId) navigate("/track", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Helmet>
        <title>Track your Xenium order</title>
        <meta name="description" content="Look up the status of your Xenium digital gift order with your order ID and email." />
        <link rel="canonical" href="https://xenium-sites.com/track" />
        <meta property="og:title" content="Track your Xenium order" />
        <meta property="og:description" content="Look up the status of your Xenium digital gift order." />
        <meta property="og:url" content="https://xenium-sites.com/track" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <header className="text-center mb-10 sm:mb-14">
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">Track your order</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light leading-tight">
            Where is my <span className="italic gradient-text">Xenium?</span>
          </h1>
          <p className="text-muted-foreground/80 text-sm sm:text-base mt-3 max-w-md mx-auto">
            Enter your order ID and the email you used to place the request.
          </p>
        </header>

        {error && (
          <div className="mb-5 p-4 rounded-xl border border-xenium-rose/30 bg-xenium-rose/5 text-xenium-rose text-sm flex items-start gap-2" role="alert">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {info && (
          <div className="mb-5 p-4 rounded-xl border border-xenium-amber/30 bg-xenium-amber/5 text-foreground/85 text-sm">
            {info}
          </div>
        )}

        {stage === "lookup" && (
          <form onSubmit={handleLookup} className="glass-card p-6 sm:p-8 space-y-5">
            <Field
              id="track-code"
              label="Order ID"
              placeholder="e.g. XEN-7K9P2A"
              autoComplete="off"
              value={code}
              onChange={(v) => setCode(v.toUpperCase())}
              required
            />
            <Field
              id="track-email"
              label="Email"
              type="email"
              inputMode="email"
              placeholder="you@email.com"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="gradient-full text-foreground font-semibold w-full py-3.5 rounded-full text-sm hover:opacity-95 transition-all glow-violet flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />} View status
            </button>
            <p className="text-[11px] text-muted-foreground/60 flex items-center justify-center gap-1.5">
              <Lock size={11} /> We never share your email. Looking up only returns your own order.
            </p>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={handleVerify} className="glass-card p-6 sm:p-8 space-y-5">
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to <strong className="text-foreground/90">{email}</strong>.
            </p>
            <Field
              id="track-otp"
              label="Enter the code"
              placeholder="••••••"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(v) => setOtp(v.replace(/\D/g, ""))}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="gradient-full text-foreground font-semibold w-full py-3.5 rounded-full text-sm flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Verify and continue
            </button>
            <button
              type="button"
              onClick={reset}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              Use a different order
            </button>
          </form>
        )}

        {stage === "view" && order && (
          <OrderView
            order={order}
            email={email}
            onRefresh={refresh}
            loading={loading}
            onReset={reset}
            onRegenerate={regenerate}
            regenerating={regenerating}
          />
        )}
      </div>
    </div>
  );
}

function OrderView({
  order,
  email,
  onRefresh,
  loading,
  onReset,
  onRegenerate,
  regenerating,
}: {
  order: OrderStatus;
  email: string;
  onRefresh: () => void;
  loading: boolean;
  onReset: () => void;
  onRegenerate: () => void;
  regenerating: boolean;
}) {
  const pay = useMemo(() => paymentStatusLabel(order.paymentStatus), [order.paymentStatus]);
  const prod = useMemo(() => productionStatusLabel(order.productionStatus), [order.productionStatus]);
  const created = new Date(order.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const paidWhen = order.paidAt ? new Date(order.paidAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : null;
  const showPayCta = order.paymentStatus === "created" || order.paymentStatus === "pending" || order.paymentStatus === "failed";
  const showRegenerate = order.paymentStatus === "expired" || order.paymentStatus === "cancelled";

  const copyId = () => {
    navigator.clipboard?.writeText(order.shortCode).catch(() => {});
  };

  return (
    <div className="space-y-5">
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-xenium-amber/80 mb-1">Order ID</p>
            <button
              type="button"
              onClick={copyId}
              className="text-foreground font-mono text-lg sm:text-xl inline-flex items-center gap-2 hover:text-xenium-amber transition-colors"
            >
              {order.shortCode}
              <Copy size={14} className="text-muted-foreground/60" />
            </button>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 disabled:opacity-60"
            aria-label="Refresh"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Refresh
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <StatusBlock title="Payment" label={pay.label} tone={pay.tone} />
          <StatusBlock title="Production" label={prod.label} tone={prod.tone} />
        </div>

        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm border-t border-border/50 pt-5">
          <Detail label="Occasion" value={order.occasion} />
          <Detail label="For" value={order.recipientName} />
          <Detail label="Amount" value={`${formatINR(order.amountPaise)} ${order.currency}`} />
          <Detail label="Submitted" value={created} />
          {paidWhen && <Detail label="Paid" value={paidWhen} />}
        </div>

        {showPayCta && isSafeHttpUrl(order.paymentLinkUrl) && (
          <div className="mt-6 pt-5 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-3">Payment is pending. Use the secure link to complete it.</p>
            <a
              href={order.paymentLinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-full text-foreground font-semibold inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm w-full sm:w-auto min-h-[44px]"
            >
              <Sparkles size={14} /> Pay {formatINR(order.amountPaise)}
              <ExternalLink size={14} />
            </a>
          </div>
        )}

        {showRegenerate && (
          <div className="mt-6 pt-5 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-3">
              Your payment link {order.paymentStatus === "expired" ? "expired" : "was cancelled"}. Generate a fresh
              one to complete your order.
            </p>
            <button
              type="button"
              onClick={onRegenerate}
              disabled={regenerating}
              className="gradient-full text-foreground font-semibold inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm w-full sm:w-auto min-h-[44px] disabled:opacity-60"
            >
              {regenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Generate a new payment link
            </button>
          </div>
        )}

        {order.productionStatus === "delivered" && order.revealToken && (
          <DeliveredSection order={order} email={email} />
        )}
      </div>

      <div className="text-center">
        <button type="button" onClick={onReset} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
          <ArrowLeft size={12} /> Look up a different order
        </button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground/50 flex items-center justify-center gap-1.5">
        <Clock size={11} /> Page refreshes the latest status from our payment partner on demand.
      </p>
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
      <button
        type="button"
        onClick={copy}
        className="w-full text-left bg-muted/20 border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground/90 break-all inline-flex items-center justify-between gap-2 hover:border-xenium-violet-mid/40 transition-colors"
      >
        <span className="truncate">{value}</span>
        {copied ? <Check size={13} className="text-emerald-400 shrink-0" /> : <Copy size={13} className="text-muted-foreground/60 shrink-0" />}
      </button>
    </div>
  );
}

function DeliveredSection({ order, email }: { order: OrderStatus; email: string }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://xenium-sites.com";
  const revealUrl = `${origin}/x/${order.revealToken}`;
  const previewUrl = order.previewToken ? `${origin}/x/${order.previewToken}` : null;
  const revealAtLabel = order.revealAt
    ? new Date(order.revealAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : null;

  const editDeadline = order.deliveredAt ? new Date(order.deliveredAt).getTime() + 24 * 3600 * 1000 : 0;
  const canEdit = editDeadline > Date.now();
  const editDeadlineLabel = editDeadline
    ? new Date(editDeadline).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : null;

  const [editOpen, setEditOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [editDone, setEditDone] = useState(false);
  const [editErr, setEditErr] = useState<string | null>(null);

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setSending(true);
    setEditErr(null);
    const res = await requestEdit(order.shortCode, email, msg.trim());
    setSending(false);
    if (res.ok) {
      setEditDone(true);
      setMsg("");
    } else {
      setEditErr(
        res.error === "edit_window_closed"
          ? "The 24-hour edit window has closed. Reply to your delivery email and we'll still help."
          : "We couldn't send your edit request. Please try again or reply to your delivery email.",
      );
    }
  };

  return (
    <div className="mt-6 pt-5 border-t border-border/50 space-y-5">
      <div>
        <p className="text-sm text-foreground/90 font-medium mb-1 flex items-center gap-2">
          <Gift size={15} className="text-xenium-amber" /> Your Xenium is ready.
        </p>
        <p className="text-sm text-muted-foreground">
          Share the reveal link below with {order.recipientName}
          {revealAtLabel ? ` — it unlocks at ${revealAtLabel}` : ""}
          {order.revealPassword ? " and asks for the secret word" : ""}.
        </p>
      </div>

      <div className="grid gap-3">
        <CopyRow label={`Reveal link (share with ${order.recipientName})`} value={revealUrl} />
        {order.revealPassword && (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1">Secret word (share with recipient)</p>
            <div className="bg-xenium-violet-deep/10 border border-xenium-violet-mid/30 rounded-lg px-3 py-2.5 text-base font-medium text-foreground tracking-wide">
              {order.revealPassword}
            </div>
          </div>
        )}
      </div>

      {previewUrl && (
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-full text-foreground font-semibold inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm w-full sm:w-auto min-h-[44px]"
        >
          <Eye size={14} /> Preview your Xenium <ExternalLink size={14} />
        </a>
      )}

      {/* Edit requests within 24h */}
      <div className="pt-4 border-t border-border/40">
        {editDone ? (
          <p className="text-sm text-emerald-400 flex items-center gap-2">
            <Check size={14} /> Thanks — your edit request is in. We'll be in touch shortly.
          </p>
        ) : canEdit ? (
          <>
            {!editOpen ? (
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
              >
                <Pencil size={13} /> Need a change? Request an edit
                {editDeadlineLabel ? <span className="text-muted-foreground/50">· until {editDeadlineLabel}</span> : null}
              </button>
            ) : (
              <form onSubmit={submitEdit} className="space-y-3">
                <p className="text-sm text-foreground/90">What would you like changed?</p>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  autoFocus
                  placeholder="e.g. Please fix the spelling of her name on the second page…"
                  className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20"
                />
                {editErr && <p className="text-xenium-rose text-sm">{editErr}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={sending || !msg.trim()}
                    className="gradient-full text-foreground font-semibold px-5 py-2.5 rounded-full text-sm inline-flex items-center gap-2 min-h-[40px] disabled:opacity-60"
                  >
                    {sending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Send request
                  </button>
                  <button type="button" onClick={() => setEditOpen(false)} className="text-sm text-muted-foreground hover:text-foreground px-3">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <p className="text-[11px] text-muted-foreground/60">
            The 24-hour edit window has closed. Reply to your delivery email if you still need a change.
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBlock({ title, label, tone }: { title: string; label: string; tone: "amber" | "violet" | "green" | "muted" | "red" | "rose" }) {
  const palette: Record<typeof tone, string> = {
    amber: "border-xenium-amber/40 bg-xenium-amber/10 text-xenium-amber",
    violet: "border-xenium-violet-mid/40 bg-xenium-violet-deep/10 text-xenium-violet-mid",
    green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    muted: "border-border bg-muted/20 text-muted-foreground",
    red: "border-xenium-rose/40 bg-xenium-rose/10 text-xenium-rose",
    rose: "border-xenium-rose/40 bg-xenium-rose/10 text-xenium-rose",
  } as const;
  return (
    <div className={`rounded-xl border p-4 ${palette[tone]}`}>
      <p className="text-[10px] uppercase tracking-[0.2em] mb-1 opacity-80">{title}</p>
      <p className="font-medium text-sm">{label}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60">{label}</p>
      <p className="text-foreground/90">{value}</p>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-2">
        {label}
        {rest.required && <span className="text-xenium-amber"> *</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted/20 border border-border/60 rounded-xl px-5 py-3.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20 focus:bg-muted/30 transition-all duration-300 text-base sm:text-sm"
        {...rest}
      />
    </div>
  );
}

function friendlyError(code?: string, message?: string): string {
  switch (code) {
    case "not_found":
    case "not_found_or_invalid":
      return "We couldn't find that order. Check the order ID and the email address.";
    case "wrong_otp":
      return "That code didn't match. Please try again.";
    case "otp_expired":
      return "That code has expired. Look up the order again to get a new one.";
    case "rate_limited":
      return message || "Too many code requests. Please try again later.";
    case "too_many_attempts":
      return "Too many attempts. Please request a new code.";
    case "code_and_email_required":
      return "Both order ID and email are required.";
    default:
      return message || "Something went wrong. Please try again.";
  }
}
