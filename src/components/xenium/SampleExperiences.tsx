import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Play, Cake, Heart, Gem, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroBirthday from "@/assets/hero-birthday.jpg";
import heroAnniversary from "@/assets/hero-anniversary.jpg";
import heroProposal from "@/assets/hero-proposal.jpg";
import heroMemorial from "@/assets/hero-memorial.jpg";

const samples = [
  {
    title: "For Her Birthday",
    tag: "Birthday Experience",
    subtitle: "A surprise she'll revisit long after the day is over.",
    detail: "Built with photos, messages, and music.",
    accent: "from-xenium-violet-deep/70 to-xenium-rose/40",
    glow: "hsl(var(--xenium-rose) / 0.35)",
    slug: "birthday",
    image: heroBirthday,
    Icon: Cake,
  },
  {
    title: "10 Years Together",
    tag: "Anniversary Experience",
    subtitle: "A journey through your memories, moments, and milestones.",
    detail: "Featuring timeline, gallery, and love letters.",
    accent: "from-xenium-rose/60 to-xenium-amber/40",
    glow: "hsl(var(--xenium-amber) / 0.3)",
    slug: "anniversary",
    image: heroAnniversary,
    Icon: Heart,
  },
  {
    title: "The Proposal Story",
    tag: "Proposal Experience",
    subtitle: "A cinematic build-up to the most important question of your life.",
    detail: "Designed as a journey of moments.",
    accent: "from-xenium-violet-mid/70 to-xenium-violet-deep/40",
    glow: "hsl(var(--xenium-violet-mid) / 0.4)",
    slug: "proposal",
    image: heroProposal,
    Icon: Gem,
  },
  {
    title: "In Loving Memory",
    tag: "Memorial Tribute",
    subtitle: "A tribute to a life well lived — told by those who loved them.",
    detail: "Woven with stories, photos, and tributes.",
    accent: "from-xenium-violet-deep/60 to-xenium-rose/30",
    glow: "hsl(var(--xenium-violet-deep) / 0.35)",
    slug: "memorial",
    image: heroMemorial,
    Icon: Star,
  },
];

export default function SampleExperiences() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="examples" className="py-24 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-14 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Examples</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            See what a Xenium<br />
            <span className="italic gradient-text">looks like.</span>
          </h2>
          <p className="text-muted-foreground/60 text-sm mt-4 max-w-md mx-auto">
            Hand-crafted for moments that matter most.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {samples.map((s, i) => {
            const Icon = s.Icon;
            return (
              <Link
                to={`/experience/${s.slug}`}
                key={s.slug}
                className={`group relative block rounded-3xl overflow-hidden glass-card transition-all duration-500 ease-out hover:-translate-y-1.5 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: `${i * 90}ms`,
                  ['--card-glow' as any]: s.glow,
                }}
              >
                {/* Hover glow ring */}
                <div
                  className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--xenium-violet-mid) / 0.5), hsl(var(--xenium-rose) / 0.4), hsl(var(--xenium-amber) / 0.4))",
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: "1px",
                  }}
                />
                {/* Outer hover shadow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `0 30px 80px -20px ${s.glow}` }}
                />

                {/* Image area */}
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    width={800}
                    height={550}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:brightness-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${s.accent} mix-blend-soft-light opacity-80`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

                  {/* Category icon */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full glass-card flex items-center justify-center backdrop-blur-md">
                    <Icon size={16} className="text-xenium-amber/90" />
                  </div>

                  {/* Play badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity">
                    <Play size={10} className="text-xenium-amber fill-xenium-amber" />
                    <span className="text-[10px] tracking-wider uppercase text-foreground/70">Preview</span>
                  </div>
                </div>

                {/* Footer text */}
                <div className="relative p-6 md:p-7">
                  <span className="inline-block text-[10px] uppercase tracking-[0.18em] text-xenium-amber/70 mb-3">
                    {s.tag}
                  </span>
                  <h3 className="font-display text-2xl md:text-[1.7rem] font-medium mb-2 leading-snug">{s.title}</h3>
                  <p className="text-foreground/65 text-sm leading-relaxed mb-1">{s.subtitle}</p>
                  <p className="text-foreground/35 text-xs leading-relaxed mb-5">{s.detail}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-foreground/55 group-hover:text-xenium-amber transition-colors duration-300">
                    <span className="relative">
                      Preview Experience
                      <span className="absolute left-0 -bottom-0.5 h-px w-0 group-hover:w-full bg-xenium-amber transition-all duration-500" />
                    </span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
