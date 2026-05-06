import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Heart, Users, Briefcase } from "lucide-react";

const audiences = [
  {
    icon: Heart,
    anim: "animate-icon-heartbeat",
    title: "Couples & Romantics",
    desc: "For love stories, proposals, anniversaries and the milestones that deserve more than words.",
    examples: ["Anniversary tributes", "Surprise proposals", "Love story timelines"],
  },
  {
    icon: Users,
    anim: "animate-icon-sway",
    title: "Families & Friends",
    desc: "For birthdays, memorials and the people who shaped who we are.",
    examples: ["Milestone birthdays", "Memorial tributes", "Parent appreciations"],
  },
  {
    icon: Briefcase,
    anim: "animate-icon-breathe",
    title: "Teams & Brands",
    desc: "For employee appreciation, retirements, and recognition that genuinely lands.",
    examples: ["Retirement tributes", "Employee of the year", "Founders' farewells"],
  },
];

export default function Audience() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6" ref={ref} aria-labelledby="audience-heading">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">Who It's For</p>
          <h2 id="audience-heading" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Designed for the people<br />
            <span className="italic gradient-text">who care deeply.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {audiences.map((a, i) => {
            const Icon = a.icon;
            return (
              <div
                key={a.title}
                className={`glass-card p-7 sm:p-8 group hover:border-xenium-violet-mid/40 transition-all duration-700 hover:-translate-y-1 flex flex-col h-full ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-14 h-14 rounded-full gradient-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shrink-0">
                  <Icon size={22} className={`text-foreground ${a.anim}`} aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-medium mb-2.5">{a.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{a.desc}</p>
                <ul className="space-y-1.5 text-[12px] text-muted-foreground/70 border-t border-border/40 pt-4 mt-auto">
                  {a.examples.map((ex) => (
                    <li key={ex} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-xenium-amber/70 shrink-0" aria-hidden="true" /> {ex}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
