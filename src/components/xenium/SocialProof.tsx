import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Quote, Heart } from "lucide-react";

const quotes = [
  {
    text: "I sent it to my partner an hour before midnight on our anniversary. She watched it three times before she said anything. That's when I knew this was the right call.",
    name: "Aarav",
    location: "Mumbai",
    occasion: "10th Anniversary",
    initials: "A",
    color: "from-xenium-violet-deep/60 to-xenium-rose/40",
  },
  {
    text: "We made a memorial for my grandfather. The whole family gathered around one phone and watched. There were tears, then laughter, then more tears. Worth every rupee.",
    name: "Priya",
    location: "Bengaluru",
    occasion: "Memorial Tribute",
    initials: "P",
    color: "from-xenium-rose/55 to-xenium-amber/40",
  },
  {
    text: "I was nervous about asking — words don't come easy. The Xenium said it for me, scene by scene. She said yes before the last frame finished.",
    name: "Rohan",
    location: "Delhi",
    occasion: "Proposal",
    initials: "R",
    color: "from-xenium-amber/50 to-xenium-violet-mid/45",
  },
];

export default function SocialProof() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      className="py-20 sm:py-24 px-4 sm:px-6 relative"
      ref={ref}
      aria-labelledby="testimonials-heading"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[min(70vw,500px)] h-[min(70vw,500px)] rounded-full bg-xenium-rose/[0.06] blur-[140px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">Reactions From Early Customers</p>
          <h2 id="testimonials-heading" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            What people<br />
            <span className="italic gradient-text">say after they watch.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {quotes.map((q, i) => (
            <figure
              key={q.name + q.occasion}
              className={`glass-card p-6 sm:p-7 flex flex-col gap-4 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-full gradient-violet-rose flex items-center justify-center shrink-0">
                  <Quote size={14} className="text-foreground" />
                </div>
                <div className="flex items-center gap-0.5 text-xenium-amber" aria-label="5 hearts">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Heart key={s} size={11} className="fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-foreground/85 text-sm sm:text-[15px] leading-relaxed">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-auto pt-3 border-t border-border/40 flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${q.color} flex items-center justify-center text-foreground font-display text-sm`}
                  aria-hidden="true"
                >
                  {q.initials}
                </div>
                <div>
                  <p className="text-foreground/90 text-sm font-medium">
                    {q.name} <span className="text-muted-foreground/60 font-normal">· {q.location}</span>
                  </p>
                  <p className="text-xenium-amber/70 text-[11px] uppercase tracking-widest mt-0.5">{q.occasion}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="text-center text-muted-foreground/50 text-xs mt-8 italic max-w-md mx-auto">
          First names &amp; cities only — full identities kept private. Sent us your Xenium reaction? Email
          xeniumgifts@gmail.com to be featured.
        </p>
      </div>
    </section>
  );
}
