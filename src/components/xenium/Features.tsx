import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Image, Video, Clock, MessageSquareHeart, Music, Type } from "lucide-react";

const features = [
  { icon: Image, anim: "animate-icon-breathe", title: "Photo Gallery", desc: "Curated photo collections displayed in stunning, immersive layouts." },
  { icon: Video, anim: "animate-icon-pulse", title: "Video Embed", desc: "Integrate meaningful videos seamlessly into the experience." },
  { icon: Clock, anim: "animate-icon-tick", title: "Timeline", desc: "Walk through milestones, memories, and moments in chronological beauty." },
  { icon: MessageSquareHeart, anim: "animate-icon-heartbeat", title: "Personal Messages", desc: "Heartfelt written messages displayed with elegant typography." },
  { icon: Music, anim: "animate-icon-sway", title: "Background Music", desc: "Set the emotional tone with a curated soundtrack that plays throughout." },
  { icon: Type, anim: "animate-icon-breathe", title: "Animated Text", desc: "Words that appear, fade, and flow — bringing your message to life." },
];

export default function Features() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Features</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            What can be<br />
            <span className="italic gradient-text">included in your Xenium.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`glass-card p-8 group hover:border-xenium-violet-mid/40 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-violet-rose flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <f.icon size={22} className={`text-foreground ${f.anim}`} />
              </div>
              <h3 className="font-display text-2xl font-medium mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
