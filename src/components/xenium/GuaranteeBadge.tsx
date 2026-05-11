import { ShieldCheck } from "lucide-react";

interface Props {
  variant?: "card" | "pill" | "inline";
  className?: string;
}

const HEADLINE = "100% Happiness Guarantee";
const SUB = "Free unlimited revisions, or a full refund. No questions asked.";

export default function GuaranteeBadge({ variant = "card", className = "" }: Props) {
  if (variant === "pill") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-xenium-amber/30 bg-xenium-amber/5 text-[11px] text-foreground/85 ${className}`}
      >
        <ShieldCheck size={11} className="text-xenium-amber" />
        100% Happiness Guarantee · Free revisions or full refund
      </span>
    );
  }
  if (variant === "inline") {
    return (
      <p
        className={`inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground/80 ${className}`}
      >
        <ShieldCheck size={14} className="text-xenium-amber/90 shrink-0" />
        <span>
          <span className="text-foreground/90 font-medium">{HEADLINE}</span> — {SUB}
        </span>
      </p>
    );
  }
  return (
    <div
      className={`relative rounded-2xl border border-xenium-amber/25 bg-gradient-to-br from-xenium-amber/8 via-transparent to-xenium-rose/5 p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4 ${className}`}
    >
      <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-xenium-amber/40 bg-background/60 flex items-center justify-center">
        <ShieldCheck size={20} className="text-xenium-amber" />
      </div>
      <div className="text-left">
        <p className="font-display text-base sm:text-lg text-foreground/95 leading-tight">{HEADLINE}</p>
        <p className="text-xs sm:text-[13px] text-muted-foreground/85 mt-0.5 leading-snug">{SUB}</p>
      </div>
    </div>
  );
}
