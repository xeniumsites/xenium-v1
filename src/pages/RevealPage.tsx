import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Lock, Sparkles, Clock, Eye } from "lucide-react";
import { revealOrder, type RevealResult } from "@/lib/paymentClient";
import StarField from "@/components/xenium/StarField";

function useCountdown(target?: string): { d: number; h: number; m: number; s: number; done: boolean } {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!target) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true };
  const s = Math.floor(diff / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
    done: false,
  };
}

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-4xl sm:text-6xl font-light tabular-nums text-foreground">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

export default function RevealPage() {
  const { token } = useParams<{ token: string }>();
  const [result, setResult] = useState<RevealResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(
    async (pw?: string) => {
      if (!token) return;
      const res = await revealOrder(token, pw);
      setResult(res);
      return res;
    },
    [token],
  );

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const countdown = useCountdown(result?.status === "locked_timer" ? result.revealAt : undefined);

  // When the timer hits zero, re-check (it may become locked_password or unlocked).
  useEffect(() => {
    if (result?.status === "locked_timer" && countdown.done) {
      void load();
    }
  }, [result?.status, countdown.done, load]);

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setSubmitting(true);
    setPwError(null);
    const res = await load(password.trim());
    setSubmitting(false);
    if (res?.status === "locked_password") setPwError("That's not the right word. Try again.");
  };

  const recipient = result?.recipientName;

  // Unlocked → full-bleed embed.
  if (result?.status === "unlocked" && result.embedUrl) {
    return (
      <div className="fixed inset-0 bg-background">
        <Helmet><title>A Xenium for {recipient ?? "you"}</title><meta name="robots" content="noindex" /></Helmet>
        {result.isPreview && (
          <div className="absolute top-0 inset-x-0 z-10 bg-xenium-violet-deep/90 backdrop-blur text-foreground text-xs sm:text-sm py-2 px-4 flex items-center justify-center gap-2">
            <Eye size={14} /> Private preview — this is what your recipient will see. Share the reveal link with them.
          </div>
        )}
        <iframe
          src={result.embedUrl}
          title={`Xenium for ${recipient ?? "you"}`}
          className={`w-full h-full border-0 ${result.isPreview ? "pt-8 sm:pt-9" : ""}`}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Helmet><title>A Xenium is waiting{recipient ? ` for ${recipient}` : ""}</title><meta name="robots" content="noindex" /></Helmet>
      <StarField />
      <div className="relative z-[2] min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
        {loading ? (
          <Loader2 className="animate-spin text-muted-foreground" size={28} />
        ) : result?.status === "locked_timer" ? (
          <div className="max-w-lg">
            <p className="text-xenium-amber text-xs tracking-[0.25em] uppercase mb-4 flex items-center justify-center gap-2">
              <Clock size={13} /> A Xenium is on its way
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-light leading-tight mb-3">
              {recipient ? <>For <span className="italic gradient-text">{recipient}</span></> : <span className="italic gradient-text">Something special</span>}
            </h1>
            <p className="text-muted-foreground mb-10">This experience unlocks in…</p>
            <div className="flex items-start justify-center gap-4 sm:gap-8 mb-10">
              <Segment value={countdown.d} label="days" />
              <Segment value={countdown.h} label="hours" />
              <Segment value={countdown.m} label="mins" />
              <Segment value={countdown.s} label="secs" />
            </div>
            <p className="text-[11px] text-muted-foreground/70">Keep this link — come back when the countdown ends.</p>
          </div>
        ) : result?.status === "locked_password" ? (
          <form onSubmit={submitPassword} className="max-w-sm w-full">
            <div className="w-14 h-14 rounded-full gradient-full flex items-center justify-center mx-auto mb-6">
              <Lock size={22} className="text-foreground" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-light mb-2">
              {recipient ? <>For <span className="italic gradient-text">{recipient}</span></> : <span className="italic gradient-text">One more step</span>}
            </h1>
            <p className="text-muted-foreground text-sm mb-8">Enter the word you were given to open your Xenium.</p>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              placeholder="Your secret word"
              className="w-full text-center bg-muted/20 border border-border/60 rounded-xl px-5 py-3.5 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20 mb-3"
            />
            {pwError && <p className="text-xenium-rose text-sm mb-3">{pwError}</p>}
            <button
              type="submit"
              disabled={submitting || !password.trim()}
              className="gradient-full text-foreground font-semibold w-full py-3.5 rounded-full text-sm flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Open my Xenium
            </button>
          </form>
        ) : result?.status === "not_ready" ? (
          <div className="max-w-md">
            <h1 className="font-display text-3xl sm:text-4xl font-light mb-3">Almost there</h1>
            <p className="text-muted-foreground">This Xenium isn't quite ready yet. Check back a little later.</p>
          </div>
        ) : (
          <div className="max-w-md">
            <h1 className="font-display text-3xl sm:text-4xl font-light mb-3">This link isn't valid</h1>
            <p className="text-muted-foreground">
              Double-check the link you were sent, or ask the person who sent it to share it again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
