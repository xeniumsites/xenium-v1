import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Image, Video, Clock, MessageSquareHeart, Music, Type, MessageCircle, QrCode, Lock, Sparkles } from "lucide-react";

const mainFeatures = [
  { icon: Image, title: "Photo Gallery", desc: "Beautiful, swipeable photo collections." },
  { icon: Video, title: "Video Embed", desc: "Embed personal videos that play inline." },
  { icon: Clock, title: "Timeline of Moments", desc: "Walk through memories chronologically." },
  { icon: MessageSquareHeart, title: "Heartfelt Messages", desc: "Words that speak from the heart." },
  { icon: Music, title: "Background Music", desc: "Set the mood with the perfect soundtrack." },
  { icon: Type, title: "Animated Text", desc: "Words that appear like whispers." },
];

const addOns = [
  { icon: MessageCircle, label: "Guest Messages" },
  { icon: QrCode, label: "QR Code Sharing" },
  { icon: Lock, label: "Password Protection" },
  { icon: Sparkles, label: "Surprise Reveal" },
];

export default function Features() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">What's Included</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Built from the things<br />
            <span className="italic gradient-text">that matter most.</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {mainFeatures.map((f, i) => (
            <div
              key={i}
              className={`glass-card p-8 group hover:border-xenium-amber/30 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-11 h-11 rounded-lg gradient-rose-amber flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon size={20} className="text-foreground" />
              </div>
              <h3 className="font-display text-xl font-medium mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className={`glass-card p-8 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-sm text-muted-foreground mb-5 uppercase tracking-widest">Premium Add-ons</p>
          <div className="flex flex-wrap gap-4">
            {addOns.map((a, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-xenium-violet-mid/40 transition-colors">
                <a.icon size={14} />
                {a.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
