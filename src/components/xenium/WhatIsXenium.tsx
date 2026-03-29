import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Heart, Image, Music, Share2 } from "lucide-react";

const cards = [
  { icon: Heart, anim: "animate-icon-heartbeat", title: "Deeply Personal", desc: "Each Xenium is hand-crafted around a real story, a real person, and a real emotion." },
  { icon: Image, anim: "animate-icon-breathe", title: "Visually Stunning", desc: "Cinematic design, smooth animations, and gallery-worthy layouts that feel like art." },
  { icon: Music, anim: "animate-icon-sway", title: "Multi-Sensory", desc: "Combine photos, videos, written words, and music into one immersive experience." },
  { icon: Share2, anim: "animate-icon-breathe", title: "Privately Shareable", desc: "Delivered as a private link — open it on any device, anytime, anywhere." },
];

export default function WhatIsXenium() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-40 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">What is Xenium?</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Not a card. Not a post.<br />
            <span className="italic gradient-text">A crafted experience.</span>
          </h2>
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            Xenium transforms your most meaningful moments into beautifully designed digital experiences — 
            personal microsites that tell your story with elegance, emotion, and artistry.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              className={`glass-card p-8 text-center group hover:border-xenium-violet-mid/40 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="w-14 h-14 rounded-full gradient-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <c.icon size={24} className={`text-foreground ${c.anim}`} />
              </div>
              <h3 className="font-display text-2xl font-medium mb-3">{c.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
