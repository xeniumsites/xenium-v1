import { motion } from "framer-motion";
import { Sparkles, Play, Music, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import phoneMockup from "@/assets/phone-mockup-screen.jpg";

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

export default function Hero() {
  const typedText = useTypewriter(typewriterMessages);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-xenium-violet-deep/15 blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-xenium-rose/10 blur-[100px] animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-xenium-amber/8 blur-[80px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <p className="text-xenium-amber font-sans text-sm tracking-[0.3em] uppercase mb-8">
                Premium Digital Gifting
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-6">
                Some feelings deserve
                <br />
                <span className="gradient-text font-medium italic">more than a text message.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-3 leading-relaxed font-light"
            >
              Xenium creates personalized digital experiences for birthdays, proposals, anniversaries, and meaningful life moments.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45 }}
              className="text-sm md:text-base text-foreground/40 italic max-w-xl mx-auto lg:mx-0 mb-10 font-display"
            >
              For someone you love. For a moment that matters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-6"
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
              className="text-muted-foreground/60 text-xs tracking-wide text-center lg:text-left"
            >
              Made for birthdays, anniversaries, proposals, memorials, love stories, retirements, and more.
            </motion.p>
          </div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="relative flex justify-center"
          >
            {/* Phone frame */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[280px] md:w-[320px]"
            >
              {/* Phone shell */}
              <div className="relative rounded-[2.5rem] overflow-hidden border-2 border-foreground/10 shadow-2xl"
                style={{
                  boxShadow: "0 25px 80px -12px hsl(var(--xenium-violet-deep) / 0.4), 0 0 60px -20px hsl(var(--xenium-rose) / 0.2)"
                }}>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background rounded-b-2xl z-10" />
                
                {/* Screen content */}
                <div className="relative bg-background">
                  <img
                    src={phoneMockup}
                    alt="Xenium personalized experience preview showing 'For Aisha' with photos and music"
                    className="w-full h-auto"
                    width={640}
                    height={1280}
                  />
                  
                  {/* Typewriter overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/60 to-transparent p-5 pt-10">
                    <div className="font-display text-sm italic text-foreground/60 min-h-[1.2rem]">
                      "{typedText}<span className="animate-typewriter-cursor">|</span>"
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

                {/* Home bar */}
                <div className="bg-background py-2 flex justify-center">
                  <div className="w-24 h-1 rounded-full bg-foreground/20" />
                </div>
              </div>
            </motion.div>

            {/* Floating accent card */}
            <motion.div
              animate={{ y: [0, -5, 0], x: [0, 3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-4 md:-left-8 top-1/3 glass-card px-4 py-3 rounded-xl"
              style={{ boxShadow: "0 8px 30px -10px hsl(var(--xenium-violet-deep) / 0.3)" }}
            >
              <p className="text-[10px] text-muted-foreground/50 mb-1">Photos & Videos</p>
              <div className="flex gap-1.5">
                <div className="w-6 h-6 rounded bg-xenium-violet-deep/30" />
                <div className="w-6 h-6 rounded bg-xenium-rose/20" />
                <div className="w-6 h-6 rounded bg-xenium-amber/15" />
              </div>
            </motion.div>

            {/* Floating timeline card */}
            <motion.div
              animate={{ y: [0, 5, 0], x: [0, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -right-4 md:-right-8 bottom-1/4 glass-card px-4 py-3 rounded-xl"
              style={{ boxShadow: "0 8px 30px -10px hsl(var(--xenium-rose) / 0.3)" }}
            >
              <p className="text-[10px] text-muted-foreground/50 mb-1">Timeline</p>
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

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="flex justify-center mt-16"
        >
          <ChevronDown size={20} className="text-muted-foreground/30 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
