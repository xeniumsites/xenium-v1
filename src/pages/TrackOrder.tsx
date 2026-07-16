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
      if (!cancelled && fresh) setOrder({ ...fresh, createdAt: fresh.createdAt || order.createdAt });
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
    if (fresh) setOrder({ ...fresh, createdAt: fresh.createdAt || order.createdAt });
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
          <div className="mb-8 relative group animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-xenium-rose/40 to-red-500/40 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000" />
            <div className="relative p-6 sm:p-8 rounded-2xl bg-black/60 backdrop-blur-xl border border-xenium-rose/20 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
              <div className="shrink-0 w-12 h-12 rounded-full bg-xenium-rose/10 flex items-center justify-center border border-xenium-rose/20 shadow-[inset_0_0_15px_rgba(244,63,94,0.1)]">
                <AlertCircle size={24} className="text-xenium-rose" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-xenium-rose mb-1">Order Not Found</h3>
                <p className="text-white/70 text-sm">{error}</p>
              </div>
            </div>
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
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-xenium-violet-mid to-xenium-amber rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
        <div className="relative glass-card p-6 sm:p-10 rounded-2xl bg-background/90 backdrop-blur-xl border border-white/10">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-xenium-amber mb-2">
                Order ID
              </p>
              <button
                type="button"
                onClick={copyId}
                className="font-mono text-2xl sm:text-3xl font-bold tracking-tight inline-flex items-center gap-3 hover:opacity-80 transition-opacity bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70"
              >
                {order.shortCode}
                <Copy size={16} className="text-white/40 hover:text-white transition-colors" />
              </button>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="text-xs font-medium text-white/50 hover:text-white transition-all flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full disabled:opacity-60"
              aria-label="Refresh"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            <StatusBlock title="Payment Status" label={pay.label} tone={pay.tone} />
            <StatusBlock title="Production Status" label={prod.label} tone={prod.tone} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 text-sm border-t border-white/5 pt-8">
            <Detail label="Occasion" value={order.occasion} />
            <Detail label="For" value={order.recipientName} />
            <Detail label="Amount" value={`${formatINR(order.amountPaise)} ${order.currency}`} />
            <Detail label="Submitted" value={created.split(",")[0]} />
          </div>

          {showPayCta && order.paymentLinkUrl && (
            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-xenium-amber/5 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-10 rounded-b-2xl">
              <div>
                <h3 className="text-base font-medium text-xenium-amber mb-1">Payment Pending</h3>
                <p className="text-sm text-white/60">Complete your payment securely to begin production.</p>
              </div>
              <a
                href={order.paymentLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-full text-foreground font-bold inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm w-full sm:w-auto shadow-[0_0_20px_rgba(235,149,85,0.3)] hover:shadow-[0_0_30px_rgba(235,149,85,0.5)] transition-all scale-100 hover:scale-105 active:scale-95"
              >
                <Sparkles size={16} className="text-white" /> Pay {formatINR(order.amountPaise)}
              </a>
            </div>
          )}

          {order.productionStatus === "delivered" && order.deliveryUrl && (
            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-emerald-500/5 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 p-6 sm:p-10 rounded-b-2xl">
              <div>
                <h3 className="text-base font-medium text-emerald-400 mb-1">Your Xenium is Ready!</h3>
                <p className="text-sm text-white/60">Click the button to view and share your beautiful gift.</p>
              </div>
              <a
                href={order.deliveryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm w-full sm:w-auto shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all scale-100 hover:scale-105 active:scale-95"
              >
                <Sparkles size={16} /> Open your Xenium
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="text-center pt-2">
        <button type="button" onClick={onReset} className="text-xs font-medium text-white/40 hover:text-white inline-flex items-center gap-2 transition-colors px-4 py-2 hover:bg-white/5 rounded-full">
          <ArrowLeft size={14} /> Look up a different order
        </button>
      </div>
    </div>
  );
}

function StatusBlock({ title, label, tone }: { title: string; label: string; tone: "amber" | "violet" | "green" | "muted" | "red" | "rose" }) {
  const palette: Record<typeof tone, { bg: string; text: string; border: string; glow: string }> = {
    amber: { bg: "bg-xenium-amber/10", text: "text-xenium-amber", border: "border-xenium-amber/20", glow: "shadow-[inset_0_0_20px_rgba(235,149,85,0.05)]" },
    violet: { bg: "bg-xenium-violet-deep/20", text: "text-xenium-violet-light", border: "border-xenium-violet-mid/30", glow: "shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]" },
    green: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]" },
    muted: { bg: "bg-white/5", text: "text-white/70", border: "border-white/10", glow: "" },
    red: { bg: "bg-xenium-rose/10", text: "text-xenium-rose", border: "border-xenium-rose/20", glow: "shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]" },
    rose: { bg: "bg-xenium-rose/10", text: "text-xenium-rose", border: "border-xenium-rose/20", glow: "shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]" },
  };
  const theme = palette[tone];
  
  return (
    <div className={`rounded-xl border ${theme.border} ${theme.bg} ${theme.glow} p-5 flex flex-col justify-center transition-all duration-300 hover:border-opacity-50`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2 opacity-70 text-white/70">{title}</p>
      <p className={`font-display text-xl sm:text-2xl font-medium tracking-wide ${theme.text}`}>{label}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-1.5">{label}</p>
      <p className="text-white/90 font-medium text-sm sm:text-base">{value}</p>
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
