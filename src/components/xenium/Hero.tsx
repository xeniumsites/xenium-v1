import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";
import { useEffect, useState } from "react";

const typewriterMessages = [
  "Happy 10th Anniversary, my love...",
  "Happy Birthday, Mom...",
  "Will you marry me?",
  "In loving memory of Dad...",
  "Thank you for 25 years of service...",
  "To the best friend I ever had...",
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

function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2.5 + 1,
    delay: Math.random() * 6,
    duration: Math.random() * 4 + 3,
    driftX: (Math.random() - 0.5) * 40,
    driftY: (Math.random() - 0.5) * 30,
  }));
}

const stars = generateStars(50);

export default function Hero() {
  const typedText = useTypewriter(typewriterMessages);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floating stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-foreground/60 animate-star-float"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              '--drift-x': `${star.driftX}px`,
              '--drift-y': `${star.driftY}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Background glows */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-xenium-violet-deep/20 blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-xenium-rose/15 blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-xenium-amber/10 blur-[80px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="text-xenium-amber font-sans text-sm tracking-[0.3em] uppercase mb-8">
            Premium Digital Gifting
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-8">
            Some feelings deserve
            <br />
            <span className="gradient-text font-medium italic">more than a text message.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          Xenium helps you turn birthdays, anniversaries, proposals, tributes, and life's most meaningful moments into beautifully crafted digital experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <button
            onClick={() => scrollTo("#create")}
            className="gradient-full text-foreground font-semibold px-8 py-4 rounded-full text-base hover:opacity-90 transition-all glow-violet flex items-center gap-2 hover:shadow-[0_0_60px_-10px_hsl(var(--xenium-violet-deep)/0.6)]"
          >
            <Sparkles size={18} />
            Create Your Xenium
          </button>
          <button
            onClick={() => scrollTo("#examples")}
            className="glass-card text-foreground font-medium px-8 py-4 rounded-full text-base hover:bg-muted/30 transition-all flex items-center gap-2 hover:border-xenium-violet-mid/40"
          >
            <Play size={16} />
            View Sample Experience
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-muted-foreground/60 text-xs tracking-wide"
        >
          Made for birthdays, anniversaries, proposals, memorials, love stories, retirements, and more.
        </motion.p>

        {/* Device mockup with typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-20 relative"
        >
          <div className="glass-card p-1 max-w-3xl mx-auto rounded-2xl glow-violet overflow-hidden">
            <div className="rounded-xl bg-gradient-to-br from-xenium-violet-deep/30 via-xenium-rose/20 to-xenium-amber/10 p-8 md:p-12">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-xenium-rose/60" />
                <div className="w-3 h-3 rounded-full bg-xenium-amber/60" />
                <div className="w-3 h-3 rounded-full bg-xenium-gold/60" />
              </div>
              <div className="space-y-4 text-left">
                <div className="h-3 w-1/3 rounded-full bg-xenium-violet-mid/30" />
                <div className="font-display text-2xl md:text-3xl text-foreground/80 italic min-h-[2.5rem]">
                  "{typedText}
                  <span className="animate-typewriter-cursor">|</span>"
                </div>
                <div className="h-2 w-2/3 rounded-full bg-xenium-rose/20" />
                <div className="h-2 w-1/2 rounded-full bg-xenium-amber/15" />
                <div className="flex gap-3 mt-6">
                  <div className="w-16 h-16 rounded-lg bg-xenium-violet-deep/30 animate-float" />
                  <div className="w-16 h-16 rounded-lg bg-xenium-rose/20 animate-float" style={{ animationDelay: "1s" }} />
                  <div className="w-16 h-16 rounded-lg bg-xenium-amber/15 animate-float" style={{ animationDelay: "2s" }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
