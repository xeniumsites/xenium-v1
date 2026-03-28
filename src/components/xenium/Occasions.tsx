import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Cake, Heart, Diamond, Flower2, BookHeart, Sunset, Building2 } from "lucide-react";

const occasions = [
  { icon: Cake, title: "Birthday", tagline: "Celebrate the person, not just the date." },
  { icon: Heart, title: "Anniversary", tagline: "Relive the journey you've built together." },
  { icon: Diamond, title: "Proposal", tagline: "Ask forever in the most unforgettable way." },
  { icon: Flower2, title: "Memorial / Tribute", tagline: "Honor a life beautifully lived." },
  { icon: BookHeart, title: "Love Story", tagline: "Your story, told like never before." },
  { icon: Sunset, title: "Retirement", tagline: "A tribute to years of dedication." },
  { icon: Building2, title: "Corporate / Employee", tagline: "Recognize people who make a difference." },
];

export default function Occasions() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="occasions" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Occasions</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Made for the moments<br />
            <span className="italic gradient-text">people never forget.</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {occasions.map((o, i) => (
            <div
              key={i}
              className={`glass-card p-7 group cursor-pointer hover:border-xenium-rose/40 transition-all duration-700 hover:glow-violet ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <o.icon size={28} className="text-xenium-violet-mid mb-4 group-hover:text-xenium-amber transition-colors" />
              <h3 className="font-display text-2xl font-medium mb-2">{o.title}</h3>
              <p className="text-muted-foreground text-sm">{o.tagline}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
