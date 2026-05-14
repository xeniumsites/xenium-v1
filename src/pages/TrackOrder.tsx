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
} from "lucide-react";
import {
  OrderStatus,
  checkPaymentStatus,
  formatINR,
  paymentStatusLabel,
  productionStatusLabel,
  trackOrder,
  verifyTrackingOtp,
} from "@/lib/paymentClient";

type Stage = "lookup" | "otp" | "view";

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
  useEffect(() => {
    if (!justPaid || !order) return;
    if (order.paymentStatus === "paid") return;
    let cancelled = false;
    let attempt = 0;
    const tick = async () => {
      if (cancelled) return;
      attempt++;
      const fresh = await checkPaymentStatus(order.shortCode, email);
      if (!cancelled && fresh) setOrder(fresh);
      if (!cancelled && fresh?.paymentStatus !== "paid" && attempt < 6) {
        setTimeout(tick, 4000);
      }
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [justPaid, order, email]);

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
    if (fresh) setOrder(fresh);
    setLoading(false);
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
          <OrderView order={order} onRefresh={refresh} loading={loading} onReset={reset} />
        )}
      </div>
    </div>
  );
}

function OrderView({
  order,
  onRefresh,
  loading,
  onReset,
}: {
  order: OrderStatus;
  onRefresh: () => void;
  loading: boolean;
  onReset: () => void;
}) {
  const pay = useMemo(() => paymentStatusLabel(order.paymentStatus), [order.paymentStatus]);
  const prod = useMemo(() => productionStatusLabel(order.productionStatus), [order.productionStatus]);
  const created = new Date(order.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const paidWhen = order.paidAt ? new Date(order.paidAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : null;
  const showPayCta = order.paymentStatus === "created" || order.paymentStatus === "pending" || order.paymentStatus === "failed";

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

        {showPayCta && order.paymentLinkUrl && (
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

        {order.productionStatus === "delivered" && order.deliveryUrl && (
          <div className="mt-6 pt-5 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-3">Your Xenium is ready. Open the private link below to view and share.</p>
            <a
              href={order.deliveryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-full text-foreground font-semibold inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm w-full sm:w-auto min-h-[44px]"
            >
              <Sparkles size={14} /> Open your Xenium
              <ExternalLink size={14} />
            </a>
          </div>
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
