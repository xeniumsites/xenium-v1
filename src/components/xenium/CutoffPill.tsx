import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getCutoffStatus } from "@/lib/delivery";

export default function CutoffPill({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState(() => getCutoffStatus());

  useEffect(() => {
    const id = setInterval(() => setStatus(getCutoffStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-xenium-amber/25 bg-xenium-amber/5 text-[11px] sm:text-xs text-foreground/85 ${className}`}
      aria-live="polite"
    >
      <Clock size={11} className="text-xenium-amber" />
      {status.label}
    </span>
  );
}
