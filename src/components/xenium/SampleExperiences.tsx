import { useScrollReveal } from "@/hooks/useScrollReveal";

const samples = [
  { title: "For Her Birthday", subtitle: "A celebration of everything she is", gradient: "from-xenium-violet-deep to-xenium-rose" },
  { title: "10 Years Together", subtitle: "A decade of love, beautifully told", gradient: "from-xenium-rose to-xenium-amber" },
  { title: "The Proposal Story", subtitle: "The moment that changed everything", gradient: "from-xenium-violet-mid to-xenium-violet-deep" },
  { title: "In Loving Memory", subtitle: "A tribute to a life well lived", gradient: "from-xenium-violet-deep/80 to-xenium-rose/60" },
  { title: "A Retirement Tribute", subtitle: "Honoring years of passion and impact", gradient: "from-xenium-amber to-xenium-gold" },
  { title: "Employee Appreciation", subtitle: "Recognizing the people who matter", gradient: "from-xenium-violet-mid to-xenium-amber" },
];

export default function SampleExperiences() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="examples" className="py-40 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Examples</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            See what a Xenium<br />
            <span className="italic gradient-text">feels like.</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {samples.map((s, i) => (
            <div
              key={i}
              className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-700 hover:scale-[1.02] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`bg-gradient-to-br ${s.gradient} p-10 h-64 flex flex-col justify-end relative`}>
                <div className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors" />
                <div className="relative z-10">
                  <h3 className="font-display text-2xl font-medium mb-1">{s.title}</h3>
                  <p className="text-foreground/70 text-sm">{s.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
