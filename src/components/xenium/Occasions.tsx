import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Cake, Heart, Diamond, Flower2, BookHeart, Sunset, Building2, ArrowRight } from "lucide-react";

const occasions = [
  { icon: Cake, title: "Birthday", tagline: "Celebrate the person, not just the date.", anim: "animate-icon-bounce", slug: "birthday" },
  { icon: Heart, title: "Anniversary", tagline: "Relive the journey you've built together.", anim: "animate-icon-heartbeat", slug: "anniversary" },
  { icon: Diamond, title: "Proposal", tagline: "Ask forever in the most unforgettable way.", anim: "animate-icon-shimmer", slug: "proposal" },
  { icon: Flower2, title: "Memorial / Tribute", tagline: "Honour a life beautifully lived.", anim: "animate-icon-sway", slug: "memorial" },
  { icon: BookHeart, title: "Love Story", tagline: "Your story, told like never before.", anim: "animate-icon-heartbeat", slug: "anniversary" },
  { icon: Sunset, title: "Retirement", tagline: "A tribute to years of dedication.", anim: "animate-icon-breathe", slug: "retirement" },
  { icon: Building2, title: "Corporate / Employee", tagline: "Recognise people who make a difference.", anim: "animate-icon-breathe", slug: "corporate" },
];

export default function Occasions() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="occasions" className="py-20 sm:py-24 px-4 sm:px-6" ref={ref} aria-labelledby="occasions-heading">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">Occasions</p>
          <h2 id="occasions-heading" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Made for the moments<br />
            <span className="italic gradient-text">people never forget.</span>
          </h2>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {occasions.map((o, i) => {
            const Icon = o.icon;
            return (
              <li
                key={o.title}
                className={`group transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Link
                  to={`/experience/${o.slug}`}
                  className="glass-card p-6 sm:p-7 hover:border-xenium-rose/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_hsl(var(--xenium-violet-deep)/0.4)] block h-full"
                >
                  <Icon size={26} className={`text-xenium-violet-mid mb-4 group-hover:text-xenium-amber transition-colors ${o.anim}`} aria-hidden="true" />
                  <h3 className="font-display text-xl sm:text-2xl font-medium mb-2">{o.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{o.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-xenium-amber/70 group-hover:text-xenium-amber transition-colors">
                    See sample
                    <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
