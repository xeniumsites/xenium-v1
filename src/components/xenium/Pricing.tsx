import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, Sparkles, Crown, Clock, Lock, RefreshCw, Heart, Image as ImageIcon, Music, Type, Users, Video, MessageSquareHeart, QrCode, Smartphone } from "lucide-react";
import PaymentTrust from "./PaymentTrust";
import GuaranteeBadge from "./GuaranteeBadge";
import { DELIVERY_HEADLINE } from "@/lib/delivery";

const includedGroups = [
  {
    title: "Story & Media",
    icon: Heart,
    items: [
      { icon: ImageIcon, label: "Up to 15 photos & videos" },
      { icon: Video, label: "Cinematic video embed" },
      { icon: MessageSquareHeart, label: "Heartfelt personal messages" },
      { icon: Users, label: "Guest messages" },
    ],
  },
  {
    title: "Design & Atmosphere",
    icon: Sparkles,
    items: [
      { icon: Music, label: "Curated background music" },
      { icon: Type, label: "Animated text & transitions" },
      { icon: Clock, label: "Beautiful timeline of moments" },
      { icon: Smartphone, label: "Mobile-optimized layout" },
    ],
  },
  {
    title: "Sharing & Privacy",
    icon: Lock,
    items: [
      { icon: Lock, label: "Private link, no recipient sign-up" },
      { icon: QrCode, label: "Printable QR code" },
      { icon: RefreshCw, label: "Free unlimited revisions" },
      { icon: Sparkles, label: "Priority design delivery" },
    ],
  },
];

export default function Pricing() {
  const { ref, isVisible } = useScrollReveal();
  const scrollToCreate = () => document.querySelector("#create")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="pricing" className="py-20 sm:py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-12 sm:mb-14 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">Pricing</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            One experience.<br />
            <span className="italic gradient-text">One price. All yours.</span>
          </h2>
          <p className="text-muted-foreground mt-4 sm:mt-6 max-w-md mx-auto text-sm sm:text-base">
            No tiers, no upsells, no fine print. Everything below is included.
          </p>
        </div>

        <div
          className={`relative rounded-2xl gradient-full p-[1px] glow-violet transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="glass-card rounded-[15px] p-6 sm:p-10 md:p-14">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-xenium-amber text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-5 px-3 py-1.5 rounded-full border border-xenium-amber/20 bg-xenium-amber/5">
                <Crown size={13} className="animate-icon-shimmer" /> The Complete Xenium Experience
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-3">
                <span className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text font-display">₹750</span>
                <span className="text-sm text-muted-foreground/70">/ experience</span>
              </div>
              <p className="text-muted-foreground/80 text-sm sm:text-base max-w-md mx-auto">
                Less than a movie ticket. A keepsake they'll re-watch for years.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 mb-10">
              {includedGroups.map((group) => {
                const GIcon = group.icon;
                return (
                  <div key={group.title} className="rounded-xl border border-border/50 bg-card/30 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-7 h-7 rounded-full gradient-violet-rose flex items-center justify-center">
                        <GIcon size={13} className="text-foreground" />
                      </span>
                      <h3 className="font-display text-base font-medium text-foreground/90">{group.title}</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {group.items.map((it) => (
                        <li key={it.label} className="flex items-start gap-2.5 text-[13px] text-muted-foreground">
                          <Check size={14} className="text-xenium-amber mt-0.5 shrink-0" aria-hidden="true" />
                          <span>{it.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6">
              <button
                type="button"
                onClick={scrollToCreate}
                className="gradient-full text-foreground font-semibold px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base hover:opacity-95 transition-all glow-violet inline-flex items-center justify-center gap-2 min-h-[52px]"
              >
                <Sparkles size={18} />
                Create Your Xenium
              </button>
              <a
                href="mailto:xeniumgifts@gmail.com?subject=Xenium%20question"
                className="glass-card text-foreground font-medium px-8 py-3.5 sm:py-4 rounded-full text-base hover:bg-muted/30 transition-all flex items-center justify-center gap-2 hover:border-xenium-violet-mid/40 min-h-[52px]"
              >
                Have a question?
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground/60">
              <span className="inline-flex items-center gap-1.5"><Clock size={11} className="text-xenium-amber/70" /> {DELIVERY_HEADLINE} · before 12 PM IST</span>
              <span className="inline-flex items-center gap-1.5"><Lock size={11} className="text-xenium-amber/70" /> Private &amp; secure</span>
              <span className="inline-flex items-center gap-1.5"><RefreshCw size={11} className="text-xenium-amber/70" /> Free unlimited revisions</span>
            </div>

            <div className="mt-6">
              <GuaranteeBadge />
            </div>

            <div className="mt-5 pt-5 border-t border-border/40">
              <PaymentTrust />
            </div>
          </div>
        </div>

        <p className="text-center text-muted-foreground/50 text-xs mt-6 sm:mt-8">
          Need something larger or for a corporate audience?{" "}
          <a href="mailto:xeniumgifts@gmail.com?subject=Corporate%20Xenium" className="underline hover:text-foreground transition-colors">
            Email us
          </a>{" "}
          for volume pricing.
        </p>
      </div>
    </section>
  );
}
