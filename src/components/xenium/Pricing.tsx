import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Essential",
    price: "$149",
    desc: "A beautiful, personal digital experience.",
    features: ["Up to 15 photos", "Heartfelt messages", "Background music", "Private shareable link", "Mobile-optimized design"],
    highlight: false,
  },
  {
    name: "Signature",
    price: "$299",
    desc: "The full Xenium experience, elevated.",
    features: ["Everything in Essential", "Video embed", "Timeline of moments", "Animated text & transitions", "QR code sharing", "Guest messages", "Priority design delivery"],
    highlight: true,
  },
  {
    name: "Bespoke",
    price: "Custom",
    desc: "A fully custom, one-of-a-kind creation.",
    features: ["Everything in Signature", "Custom illustrations & design", "Surprise reveal section", "Password protection", "Custom intro screen", "Dedicated designer", "Unlimited revisions"],
    highlight: false,
  },
];

export default function Pricing() {
  const { ref, isVisible } = useScrollReveal();

  const scrollToCreate = () => document.querySelector("#create")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="pricing" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Pricing</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Choose the experience<br />
            <span className="italic gradient-text">you want to create.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`relative rounded-2xl transition-all duration-700 ${
                p.highlight ? "gradient-full p-[1px] glow-violet" : ""
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className={`glass-card p-8 h-full flex flex-col ${p.highlight ? "rounded-[15px]" : ""}`}>
                {p.highlight && (
                  <div className="flex items-center gap-1 text-xenium-amber text-xs font-semibold uppercase tracking-widest mb-4">
                    <Sparkles size={12} /> Most Popular
                  </div>
                )}
                <h3 className="font-display text-3xl font-medium">{p.name}</h3>
                <div className="mt-3 mb-1">
                  <span className="text-3xl font-bold gradient-text">{p.price}</span>
                  {p.price !== "Custom" && <span className="text-muted-foreground text-sm ml-1">starting from</span>}
                </div>
                <p className="text-muted-foreground text-sm mb-8">{p.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="text-xenium-amber mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={scrollToCreate}
                  className={`w-full py-3 rounded-full font-semibold text-sm transition-all ${
                    p.highlight
                      ? "gradient-full text-foreground hover:opacity-90"
                      : "border border-border text-foreground hover:bg-muted/30"
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
