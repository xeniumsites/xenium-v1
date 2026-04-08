import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, Sparkles, Crown } from "lucide-react";

const features = [
  "Up to 15 photos & videos",
  "Heartfelt personal messages",
  "Background music",
  "Private shareable link",
  "Mobile-optimized design",
  "Timeline of moments",
  "Animated text & transitions",
  "QR code sharing",
  "Guest messages",
  "Priority design delivery",
];

export default function Pricing() {
  const { ref, isVisible } = useScrollReveal();

  const scrollToCreate = () => document.querySelector("#create")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="pricing" className="py-24 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Pricing</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            One experience.<br />
            <span className="italic gradient-text">One price. All yours.</span>
          </h2>
        </div>
        <div
          className={`relative rounded-2xl gradient-full p-[1px] glow-violet transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="glass-card rounded-[15px] p-10 md:p-14 text-center">
            <div className="flex items-center justify-center gap-2 text-xenium-amber text-xs font-semibold uppercase tracking-widest mb-6">
              <Crown size={14} className="animate-icon-shimmer" /> The Complete Xenium Experience
            </div>
            <div className="mb-2">
              <span className="text-6xl md:text-7xl font-bold gradient-text font-display">₹750</span>
            </div>
            <p className="text-muted-foreground text-sm mb-10 max-w-md mx-auto">
              Everything you need to create a stunning, personalized digital experience for someone you love.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-left max-w-lg mx-auto mb-10">
              {features.map((f, j) => (
                <div key={j} className="flex items-start gap-2 text-sm">
                  <Check size={16} className="text-xenium-amber mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={scrollToCreate}
              className="gradient-full text-foreground font-semibold px-10 py-4 rounded-full text-base hover:opacity-90 transition-all glow-violet inline-flex items-center gap-2"
            >
              <Sparkles size={18} />
              Create Your Xenium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
