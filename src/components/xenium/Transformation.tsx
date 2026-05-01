import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, ArrowDown, Music, Heart, Image as ImageIcon, Clock } from "lucide-react";
import PhoneFrame from "./PhoneFrame";
import phoneMockup from "@/assets/phone-mockup-screen.jpg";

export default function Transformation() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">The Difference</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            From a simple message…<br />
            <span className="italic gradient-text">to something they'll never forget.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-10 md:gap-6 items-center">
          {/* Left: SMS phone */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <PhoneFrame width="w-[260px]" glow="muted" float={false} className="grayscale-[60%] opacity-90">
              <div className="h-[480px] flex flex-col" style={{ background: "hsl(240 10% 12%)" }}>
                {/* Status bar */}
                <div className="pt-9 pb-3 px-4 text-center border-b border-foreground/5">
                  <p className="text-[11px] text-foreground/50">Messages</p>
                  <p className="text-xs font-medium text-foreground/80 mt-0.5">You</p>
                </div>
                {/* Conversation */}
                <div className="flex-1 p-4 flex flex-col justify-end gap-2">
                  <div className="self-start max-w-[75%] bg-foreground/10 rounded-2xl rounded-bl-sm px-3.5 py-2">
                    <p className="text-[13px] text-foreground/70">Hey 👋</p>
                  </div>
                  <div className="self-end max-w-[80%] bg-xenium-violet-deep/40 rounded-2xl rounded-br-sm px-3.5 py-2">
                    <p className="text-[13px] text-foreground/85">Happy Birthday 🎂<br />Hope you have a great day ❤️</p>
                  </div>
                  <p className="text-[9px] text-muted-foreground/50 self-end mt-1">Delivered · 8:42 AM</p>
                </div>
                {/* Input */}
                <div className="p-3 border-t border-foreground/5 flex items-center gap-2">
                  <div className="flex-1 h-7 rounded-full bg-foreground/5" />
                  <div className="w-7 h-7 rounded-full bg-foreground/10" />
                </div>
              </div>
            </PhoneFrame>
            <p className="mt-6 text-sm text-muted-foreground/60 italic font-display text-center max-w-[240px]">
              A message they'll forget by tomorrow.
            </p>
          </motion.div>

          {/* Divider */}
          <div className="flex md:flex-col items-center justify-center">
            {/* Mobile arrow */}
            <motion.div
              animate={isVisible ? { y: [0, 6, 0] } : {}}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="md:hidden"
            >
              <ArrowDown size={28} className="text-xenium-amber/60" />
            </motion.div>
            {/* Desktop line + arrow */}
            <div className="hidden md:flex flex-col items-center gap-3">
              <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-xenium-violet-mid/40 to-transparent" />
              <motion.div
                animate={isVisible ? { x: [0, 6, 0] } : {}}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="p-3 rounded-full glass-card"
                style={{ boxShadow: "0 0 30px -8px hsl(var(--xenium-amber) / 0.5)" }}
              >
                <ArrowRight size={20} className="text-xenium-amber" />
              </motion.div>
              <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-xenium-rose/40 to-transparent" />
            </div>
          </div>

          {/* Right: Xenium phone */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 -m-8 rounded-full bg-xenium-violet-deep/25 blur-[80px] pointer-events-none" />
              <PhoneFrame width="w-[260px]" glow="violet">
                <div className="relative">
                  <img src={phoneMockup} alt="Xenium experience preview" className="w-full h-[480px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                </div>
              </PhoneFrame>
            </div>
            <p className="mt-6 text-sm text-foreground/80 italic font-display text-center max-w-[240px]">
              An experience they'll revisit for years.
            </p>
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                { icon: ImageIcon, label: "Photos", color: "text-xenium-violet-mid" },
                { icon: Music, label: "Music", color: "text-xenium-amber" },
                { icon: Heart, label: "Messages", color: "text-xenium-rose" },
                { icon: Clock, label: "Timeline", color: "text-xenium-gold" },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <motion.span
                    key={b.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/60 glass-card text-[10px] text-foreground/70"
                  >
                    <Icon size={10} className={b.color} />
                    {b.label}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
