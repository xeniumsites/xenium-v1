import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ClipboardEdit, MessageSquareHeart, Wand2, Send } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Choose the moment",
    desc: "Pick the occasion and tell us a little about who it's for.",
    icon: ClipboardEdit,
    duration: "2 mins",
  },
  {
    num: "02",
    title: "Share the story",
    desc: "Send us photos, voice notes, music — whatever helps tell the story.",
    icon: MessageSquareHeart,
    duration: "Within 24 hrs",
  },
  {
    num: "03",
    title: "We craft your Xenium",
    desc: "Our design team weaves your media into a cinematic experience.",
    icon: Wand2,
    duration: "48–72 hrs",
  },
  {
    num: "04",
    title: "Receive & share",
    desc: "Get your private link and QR code — open and share from any device.",
    icon: Send,
    duration: "Forever yours",
  },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how-it-works" className="py-20 sm:py-24 px-4 sm:px-6" ref={ref} aria-labelledby="how-it-works-heading">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-14 sm:mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">How It Works</p>
          <h2 id="how-it-works-heading" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            From memory to masterpiece —<br />
            <span className="italic gradient-text">in a few simple steps.</span>
          </h2>
        </div>

        {/* Connector line on desktop */}
        <div className="relative">
          <div
            className="hidden md:block absolute top-8 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent 6%, hsl(var(--xenium-violet-deep)/0.4) 20%, hsl(var(--xenium-rose)/0.4) 50%, hsl(var(--xenium-amber)/0.4) 80%, transparent 94%)",
            }}
            aria-hidden="true"
          />

          <ol className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 relative">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.num}
                  className={`relative text-center transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full gradient-full flex items-center justify-center mx-auto mb-5 text-foreground font-bold text-base shadow-[0_10px_30px_-10px_hsl(var(--xenium-violet-deep)/0.6)]">
                      <Icon size={22} className="text-foreground" aria-hidden="true" />
                    </div>
                    <span className="absolute -top-1 -right-2 text-[10px] font-bold tracking-[0.15em] text-xenium-amber/90 bg-background/80 backdrop-blur-sm rounded-full px-2 py-0.5 border border-border">
                      {s.num}
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-medium mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3 max-w-[260px] mx-auto">{s.desc}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-xenium-amber/60">{s.duration}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
