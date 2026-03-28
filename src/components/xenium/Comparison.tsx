import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, X } from "lucide-react";

const rows = [
  { feature: "Personalized for one person", xenium: true, others: false },
  { feature: "Cinematic design & animations", xenium: true, others: false },
  { feature: "Photos, videos & music", xenium: true, others: false },
  { feature: "Private & shareable link", xenium: true, others: false },
  { feature: "Emotional storytelling", xenium: true, others: false },
  { feature: "Premium, lasting keepsake", xenium: true, others: false },
];

const others = ["WhatsApp", "Greeting Cards", "Website Builders", "Social Media"];

export default function Comparison() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-32 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Why Xenium</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Not just a page.<br />
            <span className="italic gradient-text">A feeling, designed.</span>
          </h2>
          <p className="text-muted-foreground mt-6 max-w-lg mx-auto">
            See how Xenium compares to {others.join(", ")}.
          </p>
        </div>
        <div className={`glass-card overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="grid grid-cols-3 text-sm font-semibold border-b border-border">
            <div className="p-5 text-muted-foreground">Feature</div>
            <div className="p-5 text-center gradient-text">Xenium</div>
            <div className="p-5 text-center text-muted-foreground">Others</div>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-3 border-b border-border/50 last:border-0">
              <div className="p-5 text-sm text-muted-foreground">{r.feature}</div>
              <div className="p-5 flex justify-center">
                <Check size={18} className="text-xenium-amber" />
              </div>
              <div className="p-5 flex justify-center">
                <X size={18} className="text-muted-foreground/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
