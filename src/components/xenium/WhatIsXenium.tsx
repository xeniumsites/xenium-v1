import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Heart, Image as ImageIcon, Music, Share2 } from "lucide-react";
import emotionalBirthday from "@/assets/emotional-birthday.jpg";
import emotionalProposal from "@/assets/emotional-proposal.jpg";
import emotionalMemory from "@/assets/emotional-memory.jpg";

const cards = [
  {
    icon: Heart,
    anim: "animate-icon-heartbeat",
    title: "Deeply Personal",
    desc: "Each Xenium is hand-crafted around a real story, a real person, and a real emotion.",
    proof: "Crafted in 48–72 hours",
  },
  {
    icon: ImageIcon,
    anim: "animate-icon-breathe",
    title: "Visually Stunning",
    desc: "Cinematic design, smooth animations, and gallery-worthy layouts that feel like art.",
    proof: "Looks beautiful on every device",
  },
  {
    icon: Music,
    anim: "animate-icon-sway",
    title: "Multi-Sensory",
    desc: "Photos, videos, written words and music — woven into one immersive experience.",
    proof: "With original soundtrack option",
  },
  {
    icon: Share2,
    anim: "animate-icon-breathe",
    title: "Privately Shareable",
    desc: "Delivered as a private link — open it on any device, anytime, anywhere.",
    proof: "No sign-up needed for the recipient",
  },
];

const strip = [
  { src: emotionalBirthday, alt: "A joyful birthday moment" },
  { src: emotionalProposal, alt: "An intimate proposal moment" },
  { src: emotionalMemory, alt: "A treasured family memory" },
];

export default function WhatIsXenium() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="what-is-xenium" className="py-20 sm:py-24 px-4 sm:px-6" ref={ref} aria-labelledby="what-is-xenium-heading">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-4">What is Xenium?</p>
          <h2 id="what-is-xenium-heading" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            Not a card. Not a post.<br />
            <span className="italic gradient-text">A crafted experience.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Xenium is a personalized digital experience built around someone you love, a memory you cherish, or a moment you never want forgotten.
          </p>
        </div>

        {/* Visual anchor strip */}
        <div
          className={`grid grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "150ms" }}
        >
          {strip.map((s, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden group"
            >
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10 rounded-2xl" />
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`glass-card p-6 sm:p-8 text-center group hover:border-xenium-violet-mid/40 hover:shadow-[0_8px_40px_-12px_hsl(var(--xenium-violet-deep)/0.3)] transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 120}ms`, touchAction: "manipulation" }}
            >
              <div className="relative w-14 h-14 rounded-full gradient-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500">
                <c.icon size={24} className={`text-foreground ${c.anim}`} />
                <div className="absolute inset-0 rounded-full bg-xenium-amber/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-medium mb-2">{c.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">{c.desc}</p>
              <p className="text-[11px] tracking-wider uppercase text-xenium-amber/70">{c.proof}</p>
            </div>
          ))}
        </div>

        <div className={`mt-12 text-center transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "600ms" }}>
          <p className="inline-block px-5 py-2.5 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm text-sm text-foreground/70">
            <span className="font-semibold text-foreground">₹750</span>
            <span className="mx-2 text-foreground/30">·</span>
            One price · Fully crafted · Delivered as a private link
          </p>
        </div>
      </div>
    </section>
  );
}
