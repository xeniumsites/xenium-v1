import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight } from "lucide-react";

const samples = [
  {
    title: "For Her Birthday",
    tag: "Birthday Experience",
    subtitle: "A celebration of memories, love, and everything she means to you.",
    gradient: "from-xenium-violet-deep to-xenium-rose",
    accent: "bg-xenium-rose/20",
  },
  {
    title: "10 Years Together",
    tag: "Anniversary Experience",
    subtitle: "A journey through your moments, milestones, and shared memories.",
    gradient: "from-xenium-rose to-xenium-amber",
    accent: "bg-xenium-amber/20",
  },
  {
    title: "The Proposal Story",
    tag: "Proposal Experience",
    subtitle: "A cinematic build-up to the most important question of your life.",
    gradient: "from-xenium-violet-mid to-xenium-violet-deep",
    accent: "bg-xenium-violet-mid/20",
  },
  {
    title: "In Loving Memory",
    tag: "Memorial Tribute",
    subtitle: "A tribute to a life well lived — told through the voices of those who loved them.",
    gradient: "from-xenium-violet-deep/80 to-xenium-rose/60",
    accent: "bg-xenium-violet-deep/15",
  },
  {
    title: "A Retirement Tribute",
    tag: "Retirement Experience",
    subtitle: "Honoring years of passion, impact, and the legacy left behind.",
    gradient: "from-xenium-amber to-xenium-gold",
    accent: "bg-xenium-gold/15",
  },
  {
    title: "Employee Appreciation",
    tag: "Corporate Experience",
    subtitle: "Recognizing the people who matter — beyond a certificate.",
    gradient: "from-xenium-violet-mid to-xenium-amber",
    accent: "bg-xenium-amber/15",
  },
];

export default function SampleExperiences() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="examples" className="py-44 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Examples</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            See what a Xenium<br />
            <span className="italic gradient-text">feels like.</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {samples.map((s, i) => (
            <div
              key={i}
              className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_12px_50px_-15px_hsl(var(--xenium-violet-deep)/0.35)] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`bg-gradient-to-br ${s.gradient} relative`}>
                {/* Mock visual preview area */}
                <div className="p-8 pt-10 pb-6">
                  <div className="space-y-3 mb-6">
                    <div className={`h-2 w-2/5 rounded-full ${s.accent}`} />
                    <div className={`h-8 w-4/5 rounded-lg ${s.accent}`} />
                    <div className={`h-2 w-3/5 rounded-full ${s.accent}`} />
                    <div className="flex gap-2 pt-2">
                      <div className={`w-10 h-10 rounded-md ${s.accent}`} />
                      <div className={`w-10 h-10 rounded-md ${s.accent}`} />
                      <div className={`w-10 h-10 rounded-md ${s.accent}`} />
                    </div>
                  </div>
                </div>
                {/* Content overlay */}
                <div className="px-8 pb-8 relative z-10">
                  <span className="inline-block text-[10px] uppercase tracking-[0.15em] text-foreground/50 border border-foreground/20 rounded-full px-3 py-1 mb-3">
                    {s.tag}
                  </span>
                  <h3 className="font-display text-2xl font-medium mb-2">{s.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed mb-4">{s.subtitle}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-foreground/70 group-hover:text-foreground transition-colors">
                    Preview Experience <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
