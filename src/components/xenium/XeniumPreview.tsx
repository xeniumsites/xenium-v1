import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Music, Heart, Image as ImageIcon, Clock, MessageSquareHeart, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import PhoneFrame from "./PhoneFrame";
import imgAnniversary from "@/assets/hero-anniversary.jpg";
import imgBirthday from "@/assets/hero-birthday.jpg";
import imgProposal from "@/assets/hero-proposal.jpg";
import imgMemorial from "@/assets/hero-memorial.jpg";

const SCENES = [
  { key: "cover", label: "Cover", icon: Sparkles },
  { key: "message", label: "Message", icon: MessageSquareHeart },
  { key: "gallery", label: "Gallery", icon: ImageIcon },
  { key: "timeline", label: "Timeline", icon: Clock },
] as const;

const SCENE_DURATION = 4500;
const galleryImgs = [imgAnniversary, imgBirthday, imgProposal, imgMemorial];

const message = "Every love story is beautiful, but ours is my favorite.";

function useTypewriter(text: string, active: boolean, speed = 35) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    if (!active) {
      setDisplay("");
      return;
    }
    let i = 0;
    setDisplay("");
    const id = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [active, text, speed]);
  return display;
}

export default function XeniumPreview() {
  const { ref, isVisible } = useScrollReveal();
  const [active, setActive] = useState(0);
  const typed = useTypewriter(message, active === 1);

  useEffect(() => {
    if (!isVisible) return;
    const id = setInterval(() => setActive((a) => (a + 1) % SCENES.length), SCENE_DURATION);
    return () => clearInterval(id);
  }, [isVisible]);

  return (
    <section className="py-24 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-14 transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Live Preview</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            See what a Xenium<br />
            <span className="italic gradient-text">feels like.</span>
          </h2>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Halo behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-xenium-violet-deep/20 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-xenium-rose/15 blur-[90px] pointer-events-none" />

          {/* Side accents (desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden lg:flex absolute left-[14%] top-1/3 glass-card px-4 py-3 rounded-xl items-center gap-2"
          >
            <Music size={14} className="text-xenium-amber/70" />
            <div className="flex items-end gap-[2px] h-4">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  className="w-[3px] bg-xenium-amber/60 rounded-full"
                  animate={{ height: ["30%", "100%", "30%"] }}
                  transition={{ duration: 0.8 + i * 0.15, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground/60">Soundtrack</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="hidden lg:flex absolute right-[14%] bottom-1/3 glass-card px-4 py-3 rounded-xl items-center gap-2"
          >
            <Heart size={12} className="text-xenium-rose/70 animate-icon-heartbeat" />
            <span className="text-[10px] text-muted-foreground/60">Tap to open</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <PhoneFrame width="w-[300px] md:w-[340px]" glow="violet">
              {/* Progress bar */}
              <div className="absolute top-7 left-6 right-6 h-[2px] rounded-full bg-foreground/10 overflow-hidden z-10">
                <motion.div
                  key={active}
                  className="h-full bg-gradient-to-r from-xenium-violet-mid via-xenium-rose to-xenium-amber"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: SCENE_DURATION / 1000, ease: "linear" }}
                />
              </div>

              {/* Scene area */}
              <div className="relative h-[520px] md:h-[560px] overflow-hidden">
                <AnimatePresence mode="wait">
                  {active === 0 && (
                    <motion.div
                      key="cover"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.7 }}
                      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
                      style={{
                        background:
                          "radial-gradient(ellipse at top, hsl(var(--xenium-violet-deep) / 0.5), hsl(var(--xenium-void)) 70%)",
                      }}
                    >
                      {/* tiny inner stars */}
                      {Array.from({ length: 18 }).map((_, i) => (
                        <span
                          key={i}
                          className="absolute rounded-full bg-foreground/70 animate-star-float"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: 2,
                            height: 2,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${4 + Math.random() * 3}s`,
                            ['--drift-x' as any]: `${(Math.random() - 0.5) * 20}px`,
                            ['--drift-y' as any]: `${(Math.random() - 0.5) * 20}px`,
                          } as React.CSSProperties}
                        />
                      ))}
                      <p className="text-xenium-amber/70 text-[10px] tracking-[0.3em] uppercase mb-6">A Xenium Experience</p>
                      <h3 className="font-display text-3xl md:text-4xl font-light italic text-foreground/95 leading-tight">
                        For Aisha <span className="text-xenium-rose">❤️</span>
                      </h3>
                      <p className="text-muted-foreground/70 text-sm mt-3 font-display italic">On your 10th Anniversary</p>
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mt-12 px-6 py-2 rounded-full border border-foreground/15 text-[11px] tracking-wider uppercase text-foreground/60"
                      >
                        Tap to begin
                      </motion.div>
                    </motion.div>
                  )}

                  {active === 1 && (
                    <motion.div
                      key="message"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 flex flex-col items-center justify-center px-6"
                      style={{
                        background:
                          "linear-gradient(180deg, hsl(var(--xenium-void)) 0%, hsl(var(--xenium-violet-deep) / 0.25) 100%)",
                      }}
                    >
                      <MessageSquareHeart size={20} className="text-xenium-rose/70 mb-4" />
                      <p className="font-display text-xl italic text-foreground/85 leading-relaxed text-center">
                        "{typed}
                        <span className="animate-typewriter-cursor">|</span>"
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 mt-6 tracking-wider uppercase">— from David</p>
                    </motion.div>
                  )}

                  {active === 2 && (
                    <motion.div
                      key="gallery"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 p-6 pt-14 flex flex-col"
                      style={{ background: "hsl(var(--xenium-void))" }}
                    >
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-3">Our Memories</p>
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        {galleryImgs.map((src, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.12 }}
                            className="rounded-xl overflow-hidden"
                          >
                            <img
                              src={src}
                              alt={`Sample memory ${i + 1}`}
                              loading="lazy"
                              decoding="async"
                              width={200}
                              height={200}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {active === 3 && (
                    <motion.div
                      key="timeline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 p-6 pt-14 flex flex-col justify-center"
                      style={{
                        background:
                          "linear-gradient(180deg, hsl(var(--xenium-void)) 0%, hsl(var(--xenium-amber) / 0.05) 100%)",
                      }}
                    >
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-6">Our Journey</p>
                      <div className="relative pl-6">
                        <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-xenium-violet-mid via-xenium-rose to-xenium-amber" />
                        {[
                          { year: "2016", text: "First Date" },
                          { year: "2018", text: "Trip to Paris" },
                          { year: "2020", text: "Our Wedding" },
                          { year: "2024", text: "A New Home" },
                        ].map((it, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.18 }}
                            className="relative mb-5 last:mb-0"
                          >
                            <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-xenium-amber shadow-[0_0_10px_hsl(var(--xenium-amber)/0.6)]" />
                            <p className="text-[10px] text-xenium-amber/80 tracking-wider">{it.year}</p>
                            <p className="text-sm text-foreground/85 font-display italic">{it.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </PhoneFrame>

            {/* Reflective shelf */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-[60%] h-6 rounded-[50%] blur-md"
              style={{ background: "hsl(var(--xenium-violet-deep) / 0.35)" }}
            />
          </motion.div>

          {/* Scene chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-10">
            {SCENES.map((s, i) => {
              const Icon = s.icon;
              const isActive = active === i;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] tracking-wide transition-all duration-500 ${
                    isActive
                      ? "border-xenium-amber/60 bg-xenium-amber/10 text-xenium-amber"
                      : "border-border/60 text-muted-foreground/60 hover:text-foreground/80"
                  }`}
                >
                  <Icon size={12} />
                  {s.label}
                </button>
              );
            })}
          </div>

          <p className="text-center text-muted-foreground/40 text-xs mt-6 max-w-md">
            A simulated preview. Every Xenium is uniquely crafted for its recipient.
          </p>
        </div>
      </div>
    </section>
  );
}
