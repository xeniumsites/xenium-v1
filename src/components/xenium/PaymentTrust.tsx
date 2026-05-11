import { ShieldCheck } from "lucide-react";

const METHODS = ["UPI", "Visa", "Mastercard", "RuPay", "Amex", "Net Banking"];

interface Props {
  className?: string;
  /** Compact variant fits in form footers; default fits below pricing card. */
  compact?: boolean;
}

export default function PaymentTrust({ className = "", compact = false }: Props) {
  return (
    <div
      className={`flex flex-col items-center gap-2.5 text-muted-foreground/80 ${className}`}
      aria-label="Accepted payment methods"
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {METHODS.map((m) => (
          <span
            key={m}
            className={`px-2.5 py-1 rounded-md border border-border/60 bg-muted/15 text-[10px] sm:text-[11px] tracking-wide font-medium text-foreground/75 ${
              compact ? "" : "uppercase"
            }`}
          >
            {m}
          </span>
        ))}
      </div>
      <p className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] text-muted-foreground/70">
        <ShieldCheck size={12} className="text-xenium-amber/80" />
        Secure payments by Razorpay · 256-bit SSL · We never store card details
      </p>
    </div>
  );
}
