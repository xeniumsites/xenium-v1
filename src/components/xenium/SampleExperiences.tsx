import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBirthday from "@/assets/hero-birthday.jpg";
import heroAnniversary from "@/assets/hero-anniversary.jpg";
import heroProposal from "@/assets/hero-proposal.jpg";
import heroMemorial from "@/assets/hero-memorial.jpg";
import heroRetirement from "@/assets/hero-retirement.jpg";
import heroCorporate from "@/assets/hero-corporate.jpg";

const samples = [
  {
    title: "For Her Birthday",
    tag: "Birthday Experience",
    subtitle: "A surprise she'll revisit long after the day is over.",
    detail: "Built with photos, messages, and music.",
    gradient: "from-xenium-violet-deep to-xenium-rose",
    slug: "birthday",
    image: heroBirthday,
  },
  {
    title: "10 Years Together",
    tag: "Anniversary Experience",
    subtitle: "A journey through your memories, moments, and milestones.",
    detail: "Featuring timeline, gallery, and love letters.",
    gradient: "from-xenium-rose to-xenium-amber",
    slug: "anniversary",
    image: heroAnniversary,
  },
  {
    title: "The Proposal Story",
    tag: "Proposal Experience",
    subtitle: "A cinematic build-up to the most important question of your life.",
    detail: "Designed as a journey of moments.",
    gradient: "from-xenium-violet-mid to-xenium-violet-deep",
    slug: "proposal",
    image: heroProposal,
  },
  {
    title: "In Loving Memory",
    tag: "Memorial Tribute",
    subtitle: "A tribute to a life well lived — told through the voices of those who loved them.",
    detail: "Woven with stories, photos, and tributes.",
    gradient: "from-xenium-violet-deep/80 to-xenium-rose/60",
    slug: "memorial",
    image: heroMemorial,
  },
  {
    title: "A Retirement Tribute",
    tag: "Retirement Experience",
    subtitle: "Honoring years of passion, impact, and the legacy left behind.",
    detail: "Crafted with team messages and memories.",
    gradient: "from-xenium-amber to-xenium-gold",
    slug: "retirement",
    image: heroRetirement,
  },
  {
    title: "Employee Appreciation",
    tag: "Corporate Experience",
    subtitle: "Recognizing the people who matter — beyond a certificate.",
    detail: "Personalized with milestones and gratitude.",
    gradient: "from-xenium-violet-mid to-xenium-amber",
    slug: "corporate",
    image: heroCorporate,
  },
];

export default function SampleExperiences() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="examples" className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-14 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Examples</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            See what a Xenium<br />
            <span className="italic gradient-text">looks like.</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {samples.map((s, i) => (
            <Link
              to={`/experience/${s.slug}`}
              key={i}
              className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_12px_60px_-15px_hsl(var(--xenium-violet-deep)/0.4)] block relative ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Background image */}
              <div className="relative aspect-[4/5]">
                <img
                  src={s.image}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  width={512}
                  height={640}
                />
                {/* Gradient overlay for readability */}
                <div className={`absolute inset-0 bg-gradient-to-t ${s.gradient} opacity-50 mix-blend-multiply`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: "inset 0 0 60px -20px hsl(var(--xenium-violet-mid) / 0.3)" }} />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 relative z-10">
                  <span className="inline-block text-[10px] uppercase tracking-[0.15em] text-foreground/50 border border-foreground/20 rounded-full px-3 py-1 mb-3 backdrop-blur-sm">
                    {s.tag}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-medium mb-2">{s.title}</h3>
                  <p className="text-foreground/60 text-sm leading-relaxed mb-1.5">{s.subtitle}</p>
                  <p className="text-foreground/35 text-xs leading-relaxed mb-4">{s.detail}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-foreground/50 group-hover:text-xenium-amber transition-colors duration-300">
                    Preview Experience <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
