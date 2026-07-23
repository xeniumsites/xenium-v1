import { motion } from "framer-motion";
import { Sparkles, Play, Music, ChevronDown, Lock, MapPin, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import phoneMockup from "@/assets/phone-mockup-screen.jpg";
import CutoffPill from "./CutoffPill";
import StatsStrip from "./StatsStrip";
import { DELIVERY_LONG_PLAIN } from "@/lib/delivery";

const typewriterMessages = [
  "Happy 10th Anniversary, my love…",
  "Happy Birthday, Mom…",
  "Will you marry me?",
  "In loving memory of Dad…",
  "Thank you for 25 years of service…",
  "To the best friend I ever had…",
];

function useTypewriter(messages: string[], typeSpeed = 60, deleteSpeed = 35, pauseTime = 2200) {
  const [display, setDisplay] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = messages[msgIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typeSpeed);
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, deleteSpeed);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setMsgIndex((msgIndex + 1) % messages.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, msgIndex, messages, typeSpeed, deleteSpeed, pauseTime]);

  return display;
}

export default function Hero() {
  const typedText = useTypewriter(typewriterMessages);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 sm:pt-28 pb-12"
      aria-labelledby="hero-heading"
    >
      {/* Background glows — clamped to viewport so they don't overflow on small phones */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[min(70vw,500px)] h-[min(70vw,500px)] -translate-x-1/2 rounded-full bg-xenium-violet-deep/15 blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[min(60vw,400px)] h-[min(60vw,400px)] translate-x-1/2 rounded-full bg-xenium-rose/10 blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 right-1/3 w-[min(50vw,300px)] h-[min(50vw,300px)] rounded-full bg-xenium-amber/[0.08] blur-[80px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 sm:gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
              <span className="inline-flex items-center gap-2 text-xenium-amber font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-5 sm:mb-6 px-3 py-1.5 rounded-full border border-xenium-amber/20 bg-xenium-amber/5">
                <Sparkles size={10} className="text-xenium-amber" />
                Premium Digital Gifting · India
              </span>
            </motion.div>
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
              className="font-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] mb-5 sm:mb-6 [text-wrap:balance]"
            >
              Personalized digital gifts
              <br className="hidden sm:block" />{" "}
              <span className="gradient-text font-medium italic">for feelings that deserve more than a text.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-base md:text-lg text-muted-foreground/90 max-w-xl mx-auto lg:mx-0 mb-3 leading-relaxed font-light [text-wrap:pretty]"
            >
              Hand-crafted cinematic experiences for birthdays, proposals, anniversaries, memorials and the moments that
              shouldn't fade. <span className="text-foreground font-medium">{DELIVERY_LONG_PLAIN}</span>.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-sm md:text-base text-foreground/70 italic max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 font-display"
            >
              For someone you love. For a moment that matters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-6"
            >
              <button
                type="button"
                onClick={() => scrollTo("#create")}
                className="gradient-full text-foreground font-semibold px-7 py-4 rounded-full text-base hover:opacity-95 transition-all glow-violet inline-flex items-center justify-center gap-2 hover:shadow-[0_0_60px_-10px_hsl(var(--xenium-violet-deep)/0.6)] whitespace-nowrap min-h-[52px]"
              >
                <Sparkles size={18} />
                Create Your Xenium
              </button>
              <button
                type="button"
                onClick={() => scrollTo("#examples")}
                className="glass-card text-foreground font-medium px-7 py-4 rounded-full text-base hover:bg-muted/30 transition-all inline-flex items-center justify-center gap-2 hover:border-xenium-violet-mid/40 whitespace-nowrap min-h-[52px]"
              >
                <Play size={16} />
                See a Sample
              </button>
            </motion.div>

            {/* Trust strip */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-2 text-[11px] sm:text-xs text-muted-foreground mb-2"
            >
              <li>
                <CutoffPill />
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Lock size={12} className="text-xenium-amber/80" /> Private link
              </li>
              <li className="inline-flex items-center gap-1.5">
                <MapPin size={12} className="text-xenium-amber/80" /> Made in India · ₹750
              </li>
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="lg:max-w-xl"
            >
              <StatsStrip />
            </motion.div>
          </div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative flex justify-center order-first lg:order-last"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[240px] sm:w-[280px] md:w-[320px]"
            >
              <div
                className="relative rounded-[2.5rem] overflow-hidden border-2 border-foreground/10 shadow-2xl"
                style={{
                  boxShadow:
                    "0 25px 80px -12px hsl(var(--xenium-violet-deep) / 0.4), 0 0 60px -20px hsl(var(--xenium-rose) / 0.2)",
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-5 sm:h-6 bg-background rounded-b-2xl z-10" />
                <div className="relative bg-background">
                  <img
                    src={phoneMockup}
                    alt="Xenium personalized experience preview showing 'For Aisha' with photos and music"
                    className="w-full h-auto"
                    width={640}
                    height={1280}
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/60 to-transparent p-4 sm:p-5 pt-10">
                    <div className="font-display text-[13px] sm:text-sm italic text-foreground/60 min-h-[1.2rem]">
                      &ldquo;{typedText}
                      <span className="animate-typewriter-cursor">|</span>&rdquo;
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Music size={10} className="text-xenium-amber/50 animate-icon-sway" />
                      <div className="flex-1 h-[2px] rounded-full bg-muted/30 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full gradient-full"
                          animate={{ width: ["20%", "80%", "20%"] }}
                          transition={{ duration: 8, repeat: Infinity }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-background py-2 flex justify-center">
                  <div className="w-20 sm:w-24 h-1 rounded-full bg-foreground/20" />
                </div>
              </div>
            </motion.div>

            {/* Floating accent cards — hidden on small phones */}
            <motion.div
              animate={{ y: [0, -5, 0], x: [0, 3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="hidden sm:flex flex-col absolute -left-2 md:-left-8 top-1/3 glass-card px-4 py-3 rounded-xl"
              style={{ boxShadow: "0 8px 30px -10px hsl(var(--xenium-violet-deep) / 0.3)" }}
              aria-hidden="true"
            >
              <p className="text-[10px] text-muted-foreground/50 mb-1">Photos &amp; Videos</p>
              <div className="flex gap-1.5">
                <div className="w-6 h-6 rounded bg-xenium-violet-deep/30" />
                <div className="w-6 h-6 rounded bg-xenium-rose/20" />
                <div className="w-6 h-6 rounded bg-xenium-amber/15" />
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 5, 0], x: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="hidden sm:flex flex-col absolute -right-2 md:-right-8 bottom-1/4 glass-card px-4 py-3 rounded-xl"
              style={{ boxShadow: "0 8px 30px -10px hsl(var(--xenium-rose) / 0.3)" }}
              aria-hidden="true"
            >
              <p className="text-[10px] text-muted-foreground/50 mb-1 flex items-center gap-1">
                <Heart size={9} className="text-xenium-rose/70" /> Timeline
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-xenium-amber/50" />
                  <div className="h-1 w-12 rounded-full bg-muted/30" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-xenium-rose/50" />
                  <div className="h-1 w-16 rounded-full bg-muted/30" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator — hide on short viewports */}
        <motion.button
          type="button"
          onClick={() => scrollTo("#what-is-xenium")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="hidden sm:flex justify-center mt-12 sm:mt-16 mx-auto text-muted-foreground/40 hover:text-foreground/70 transition-colors"
          aria-label="Scroll to learn more"
        >
          <ChevronDown size={20} className="animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
