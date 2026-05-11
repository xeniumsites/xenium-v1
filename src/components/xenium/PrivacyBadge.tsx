import { Lock } from "lucide-react";

interface Props {
  className?: string;
}

export default function PrivacyBadge({ className = "" }: Props) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border/60 bg-muted/15 p-3.5 sm:p-4 ${className}`}
    >
      <div className="shrink-0 w-9 h-9 rounded-lg bg-xenium-violet-deep/15 border border-xenium-violet-mid/30 flex items-center justify-center">
        <Lock size={15} className="text-xenium-violet-mid" />
      </div>
      <div className="text-xs sm:text-[13px] leading-relaxed text-muted-foreground/85">
        <p className="text-foreground/90 font-medium mb-0.5">Your photos &amp; story stay private.</p>
        Recipient gets a private, unguessable link — no signup. We delete working media 90 days after delivery.
      </div>
    </div>
  );
}
