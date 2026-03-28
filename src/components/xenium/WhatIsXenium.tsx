import { useScrollReveal } from "@/hooks/useScrollReveal";
import { User, Heart, Gem, BookOpen } from "lucide-react";

const cards = [
  { icon: User, title: "Built for one person, not everyone", desc: "Every Xenium is a private, handcrafted experience made for a single soul." },
  { icon: Heart, title: "More meaningful than a post or message", desc: "Go beyond fleeting texts. Create something that lingers in the heart." },
  { icon: Gem, title: "Designed like a premium experience", desc: "Cinematic visuals, elegant typography, and immersive storytelling." },
  { icon: BookOpen, title: "Created around your story", desc: "Your memories, your words, your moments — beautifully woven together." },
];

export default function WhatIsXenium() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">What is Xenium</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            A gift, a story, and a memory —<br />
            <span className="italic gradient-text">all in one private digital experience.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`glass-card p-8 group hover:border-xenium-violet-mid/40 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-violet-rose flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <card.icon size={22} className="text-foreground" />
              </div>
              <h3 className="font-display text-xl font-medium mb-3">{card.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
