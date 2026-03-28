import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Sparkles, Play } from "lucide-react";

export default function FinalCTA() {
  const { ref, isVisible } = useScrollReveal();

  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="py-32 px-6 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-xenium-violet-deep/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-xenium-rose/10 blur-[100px]" />
      </div>
      <div className={`relative z-10 max-w-3xl mx-auto text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-8">
          Give them something they'll never expect —<br />
          <span className="italic gradient-text">and never forget.</span>
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollTo("#create")}
            className="gradient-full text-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-all glow-violet flex items-center gap-2"
          >
            <Sparkles size={18} />
            Start Your Xenium
          </button>
          <button
            onClick={() => scrollTo("#examples")}
            className="glass-card text-foreground font-medium px-8 py-4 rounded-full hover:bg-muted/30 transition-all flex items-center gap-2"
          >
            <Play size={16} />
            View Sample Experience
          </button>
        </div>
      </div>
    </section>
  );
}
