import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, X } from "lucide-react";

const rows: Array<{ feature: string; xenium: true | string; whatsapp: false | string; greeting: false | string; social: false | string }> = [
  { feature: "Personalised for one specific person", xenium: true, whatsapp: false, greeting: false, social: false },
  { feature: "Cinematic design & animations", xenium: true, whatsapp: false, greeting: false, social: false },
  { feature: "Photos, video, music & messages combined", xenium: true, whatsapp: "Limited", greeting: false, social: "Limited" },
  { feature: "Private link, no recipient sign-up", xenium: true, whatsapp: false, greeting: false, social: false },
  { feature: "Re-watchable keepsake", xenium: true, whatsapp: false, greeting: "Physical only", social: false },
  { feature: "Crafted by humans, not templates", xenium: true, whatsapp: false, greeting: false, social: false },
];

const others = ["WhatsApp", "Greeting Card", "Social Post"];

function Cell({ value }: { value: true | false | string }) {
  if (value === true) return <Check size={18} className="text-xenium-amber" aria-label="Included" />;
  if (value === false) return <X size={18} className="text-muted-foreground/40" aria-label="Not included" />;
  return <span className="text-[11px] text-muted-foreground/70">{value}</span>;
}

export default function Comparison() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-20 sm:py-24 px-4 sm:px-6" ref={ref} aria-labelledby="comparison-heading">
      <div className="max-w-5xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">Why Xenium</p>
          <h2 id="comparison-heading" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Not just a page.<br />
            <span className="italic gradient-text">A feeling, designed.</span>
          </h2>
          <p className="text-muted-foreground mt-4 sm:mt-6 max-w-xl mx-auto text-sm sm:text-base">
            See how a Xenium compares to the messages, posts and cards we usually settle for.
          </p>
        </div>

        {/* Desktop / tablet table */}
        <div
          className={`hidden md:block glass-card overflow-hidden transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <table className="w-full">
            <thead>
              <tr className="text-sm font-semibold border-b border-border">
                <th scope="col" className="p-5 text-left text-muted-foreground font-medium w-[42%]">Feature</th>
                <th scope="col" className="p-5 text-center"><span className="gradient-text">Xenium</span></th>
                {others.map((o) => (
                  <th key={o} scope="col" className="p-5 text-center text-muted-foreground/70 font-medium">{o}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.feature} className="border-b border-border/40 last:border-0">
                  <th scope="row" className="p-5 text-sm text-muted-foreground/90 font-normal text-left">{r.feature}</th>
                  <td className="p-5"><div className="flex justify-center"><Cell value={r.xenium} /></div></td>
                  <td className="p-5"><div className="flex justify-center"><Cell value={r.whatsapp} /></div></td>
                  <td className="p-5"><div className="flex justify-center"><Cell value={r.greeting} /></div></td>
                  <td className="p-5"><div className="flex justify-center"><Cell value={r.social} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked card with feature list */}
        <div
          className={`md:hidden glass-card p-6 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
            <span className="gradient-text text-base font-display font-medium">Xenium</span>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground/60">vs. the usual</span>
          </div>
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r.feature} className="flex items-start gap-3 text-sm">
                <Check size={16} className="text-xenium-amber mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-foreground/85">{r.feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-border/40 text-[11px] text-muted-foreground/60">
            Compared against typical WhatsApp messages, greeting cards and social posts — none of which are personal,
            cinematic or built to be revisited.
          </div>
        </div>
      </div>
    </section>
  );
}
