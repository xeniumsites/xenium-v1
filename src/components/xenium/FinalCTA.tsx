import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Sparkles, Play, Clock, Lock, Heart } from "lucide-react";
import GuaranteeBadge from "./GuaranteeBadge";
import { DELIVERY_HEADLINE } from "@/lib/delivery";

export default function FinalCTA() {
  const { ref, isVisible } = useScrollReveal();
  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden" ref={ref} aria-labelledby="final-cta-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(80vw,600px)] h-[min(80vw,600px)] rounded-full bg-xenium-violet-deep/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[min(60vw,400px)] h-[min(60vw,400px)] rounded-full bg-xenium-rose/10 blur-[100px]" />
      </div>
      <div
        className={`relative z-10 max-w-3xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <Heart size={20} className="text-xenium-rose/70 mx-auto mb-4 animate-icon-heartbeat" aria-hidden="true" />
        <h2 id="final-cta-heading" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] mb-4 [text-wrap:balance]">
          Give them something they'll never expect —<br />
          <span className="italic gradient-text">and never forget.</span>
        </h2>
        <p className="text-foreground/40 text-sm sm:text-base italic font-display mb-2">Because some moments deserve more than just a message.</p>
        <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Turn your story, your memories and your meaning into an experience worth keeping forever.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6">
          <button
            type="button"
            onClick={() => scrollTo("#create")}
            className="gradient-full text-foreground font-semibold px-7 py-4 rounded-full text-base hover:opacity-95 transition-all glow-violet inline-flex items-center justify-center gap-2 hover:shadow-[0_0_60px_-10px_hsl(var(--xenium-violet-deep)/0.6)] min-h-[52px]"
          >
            <Sparkles size={18} />
            Create Your Experience
          </button>
          <button
            type="button"
            onClick={() => scrollTo("#examples")}
            className="glass-card text-foreground font-medium px-7 py-4 rounded-full text-base hover:bg-muted/30 transition-all inline-flex items-center justify-center gap-2 hover:border-xenium-violet-mid/40 min-h-[52px]"
          >
            <Play size={16} />
            View Sample
          </button>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground/60 mb-6">
          <li className="inline-flex items-center gap-1.5"><Clock size={11} className="text-xenium-amber/70" /> {DELIVERY_HEADLINE} · before 12 PM IST</li>
          <li className="inline-flex items-center gap-1.5"><Lock size={11} className="text-xenium-amber/70" /> Private &amp; secure</li>
          <li className="inline-flex items-center gap-1.5"><Sparkles size={11} className="text-xenium-amber/70" /> Hand-crafted in India · ₹750</li>
        </ul>
        <div className="max-w-md mx-auto">
          <GuaranteeBadge />
        </div>
      </div>
    </section>
  );
}
