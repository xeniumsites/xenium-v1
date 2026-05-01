import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  width?: string; // tailwind width classes
  glow?: "violet" | "rose" | "muted" | "none";
  float?: boolean;
};

const glowMap = {
  violet:
    "0 30px 90px -20px hsl(var(--xenium-violet-deep) / 0.45), 0 0 70px -20px hsl(var(--xenium-rose) / 0.25)",
  rose: "0 30px 90px -20px hsl(var(--xenium-rose) / 0.4), 0 0 70px -20px hsl(var(--xenium-amber) / 0.2)",
  muted: "0 20px 60px -20px hsl(var(--xenium-void) / 0.7)",
  none: "0 10px 30px -15px hsl(var(--xenium-void) / 0.6)",
};

export default function PhoneFrame({
  children,
  className = "",
  width = "w-[280px] md:w-[320px]",
  glow = "violet",
  float = true,
}: Props) {
  const inner = (
    <div
      className={`relative rounded-[2.5rem] overflow-hidden border-2 border-foreground/10 ${width} ${className}`}
      style={{ boxShadow: glowMap[glow] }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background rounded-b-2xl z-20" />
      {/* Screen content */}
      <div className="relative bg-background">{children}</div>
      {/* Home bar */}
      <div className="bg-background py-2 flex justify-center">
        <div className="w-24 h-1 rounded-full bg-foreground/20" />
      </div>
    </div>
  );

  if (!float) return inner;

  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      {inner}
    </motion.div>
  );
}
