import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { num: "01", title: "Choose the moment", desc: "Select the occasion you want to celebrate." },
  { num: "02", title: "Share the story", desc: "Tell us about the person, the memories, the emotion." },
  { num: "03", title: "We shape the experience", desc: "Our team crafts a cinematic digital story." },
  { num: "04", title: "Receive & share it", desc: "Get your private link and share the magic." },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how-it-works" className="py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">How It Works</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            From memory to masterpiece —<br />
            <span className="italic gradient-text">in a few simple steps.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`relative text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 200}ms` }}
            >
              {i < 3 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-xenium-violet-deep/40 to-transparent" />
              )}
              <div className="w-16 h-16 rounded-full gradient-full flex items-center justify-center mx-auto mb-6 text-foreground font-bold text-lg">
                {s.num}
              </div>
              <h3 className="font-display text-2xl font-medium mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
