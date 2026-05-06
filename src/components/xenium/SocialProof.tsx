import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Quote, Heart } from "lucide-react";

const quotes = [
  {
    text: "I sent it to my partner an hour before midnight on our anniversary. She watched it three times before she said anything. That's when I knew this was the right call.",
    name: "Aarav S.",
    occasion: "10th Anniversary",
  },
  {
    text: "We made a memorial for my grandfather. The whole family gathered around one phone and watched. There were tears, then laughter, then more tears. Worth every rupee.",
    name: "Priya M.",
    occasion: "Memorial Tribute",
  },
  {
    text: "I was nervous about asking — words don't come easy. The Xenium said it for me, scene by scene. She said yes before the last frame finished.",
    name: "Rohan K.",
    occasion: "Proposal",
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
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">Loved By Early Believers</p>
          <h2 id="testimonials-heading" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            What people<br />
            <span className="italic gradient-text">say after they watch.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
          {quotes.map((q, i) => (
            <figure
              key={q.name}
              className={`glass-card p-6 sm:p-7 flex flex-col gap-4 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-violet-rose flex items-center justify-center shrink-0">
                  <Quote size={14} className="text-foreground" />
                </div>
                <div className="flex items-center gap-1 text-xenium-amber">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Heart key={s} size={11} className="fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="text-foreground/85 text-sm sm:text-[15px] leading-relaxed">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-auto pt-3 border-t border-border/40">
                <p className="text-foreground/90 text-sm font-medium">{q.name}</p>
                <p className="text-xenium-amber/70 text-[11px] uppercase tracking-widest mt-0.5">{q.occasion}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="text-center text-muted-foreground/40 text-xs mt-8 italic max-w-md mx-auto">
          Real recipients. Names shortened for privacy. Want to share your reaction? Email us — we love hearing them.
        </p>
      </div>
    </section>
  );
}
