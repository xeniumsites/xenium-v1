import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Heart, Users, Briefcase } from "lucide-react";

const audiences = [
  { icon: Heart, anim: "animate-icon-heartbeat", title: "Couples & Romantics", desc: "For love stories, proposals, and milestones that deserve more than words." },
  { icon: Users, anim: "animate-icon-sway", title: "Families & Friends", desc: "For birthdays, tributes, and heartfelt celebrations of the people you love." },
  { icon: Briefcase, anim: "animate-icon-breathe", title: "Teams & Brands", desc: "For employee appreciation, retirements, and recognition that truly resonates." },
];

export default function Audience() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Who It's For</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Designed for the people<br />
            <span className="italic gradient-text">who care deeply.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((a, i) => (
            <div
              key={i}
              className={`glass-card p-10 text-center group hover:border-xenium-violet-mid/40 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="w-14 h-14 rounded-full gradient-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <a.icon size={24} className={`text-foreground ${a.anim}`} />
              </div>
              <h3 className="font-display text-2xl font-medium mb-3">{a.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
