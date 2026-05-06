import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Image, Video, Clock, MessageSquareHeart, Music, Type, Users, QrCode, Lock } from "lucide-react";

const features = [
  { icon: Image, anim: "animate-icon-breathe", title: "Photo Gallery", desc: "Curated photo collections in immersive, gallery-worthy layouts." },
  { icon: Video, anim: "animate-icon-pulse", title: "Video Embed", desc: "Integrate meaningful videos seamlessly into the experience." },
  { icon: Clock, anim: "animate-icon-tick", title: "Timeline", desc: "Walk through milestones, memories and moments in chronological beauty." },
  { icon: MessageSquareHeart, anim: "animate-icon-heartbeat", title: "Personal Messages", desc: "Heartfelt written messages displayed with elegant typography." },
  { icon: Music, anim: "animate-icon-sway", title: "Background Music", desc: "Set the emotional tone with a soundtrack that plays throughout." },
  { icon: Type, anim: "animate-icon-breathe", title: "Animated Text", desc: "Words that appear, fade and flow — bringing your message to life." },
  { icon: Users, anim: "animate-icon-breathe", title: "Guest Messages", desc: "Collect notes from family, friends or colleagues into one tribute." },
  { icon: QrCode, anim: "animate-icon-pulse", title: "QR Code", desc: "A printable QR for cards, gift tags or invites — tap once, open instantly." },
  { icon: Lock, anim: "animate-icon-shimmer", title: "Private Link", desc: "Unguessable URL with optional password — only your recipient can open it." },
];

export default function Features() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6" ref={ref} aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">Features</p>
          <h2 id="features-heading" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            What can be<br />
            <span className="italic gradient-text">included in your Xenium.</span>
          </h2>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <li
                key={f.title}
                className={`glass-card p-6 sm:p-8 group hover:border-xenium-violet-mid/40 hover:-translate-y-1 transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl gradient-violet-rose flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={20} className={`text-foreground ${f.anim}`} aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-medium mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
