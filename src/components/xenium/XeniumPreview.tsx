import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Music, ChevronDown, Heart, Image, Clock, MessageSquareHeart } from "lucide-react";
import { useState, useEffect } from "react";

const previewMessages = [
  "Every love story is beautiful, but ours is my favorite.",
  "Ten years of laughter, adventures, and growing together.",
  "Here's to the memories we've made and the ones still to come.",
];

function useTypewriter(text: string, speed = 40) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplay("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplay(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { display, done };
}

export default function XeniumPreview() {
  const { ref, isVisible } = useScrollReveal();
  const [activeSection, setActiveSection] = useState(0);
  const { display, done } = useTypewriter(previewMessages[0], 35);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveSection((s) => (s + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-14 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Live Preview</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            See what a Xenium<br />
            <span className="italic gradient-text">feels like.</span>
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Large preview card */}
          <div className="relative rounded-3xl border border-border overflow-hidden glow-violet"
            style={{ background: "hsl(var(--xenium-void) / 0.8)", backdropFilter: "blur(20px)" }}>
            
            {/* Glowing edges */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                boxShadow: "inset 0 1px 0 0 hsl(var(--xenium-violet-mid) / 0.15), inset 0 -1px 0 0 hsl(var(--xenium-rose) / 0.1)"
              }} />

            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-xenium-rose/60" />
                <div className="w-3 h-3 rounded-full bg-xenium-amber/60" />
                <div className="w-3 h-3 rounded-full bg-xenium-gold/60" />
              </div>
              <span className="text-[10px] text-muted-foreground/50 tracking-wider uppercase">xenium.link/aisha</span>
              <div className="flex items-center gap-2">
                <Music size={12} className="text-xenium-amber/60 animate-icon-sway" />
              </div>
            </div>

            {/* Content area */}
            <div className="p-8 md:p-12 min-h-[400px] relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-xenium-violet-deep/15 blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-xenium-rose/10 blur-[80px]" />

              {/* Simulated experience content */}
              <div className="relative z-10 space-y-8">
                {/* Opening */}
                <motion.div
                  animate={{ opacity: activeSection === 0 ? 1 : 0.3 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-xenium-amber/60 text-xs tracking-[0.2em] uppercase mb-3">A Xenium Experience</p>
                  <h3 className="font-display text-3xl md:text-4xl font-light italic text-foreground/90">
                    For Aisha <span className="text-xenium-rose">❤️</span>
                  </h3>
                  <p className="text-muted-foreground/60 text-sm mt-2">On your 10th Anniversary</p>
                </motion.div>

                {/* Message section */}
                <motion.div
                  animate={{ opacity: activeSection === 1 ? 1 : 0.3 }}
                  transition={{ duration: 0.6 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquareHeart size={14} className="text-xenium-rose/60" />
                    <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Personal Message</span>
                  </div>
                  <p className="font-display text-lg md:text-xl italic text-foreground/70 leading-relaxed">
                    "{activeSection === 1 ? display : previewMessages[0]}"
                    {activeSection === 1 && !done && <span className="animate-typewriter-cursor">|</span>}
                  </p>
                </motion.div>

                {/* Gallery glimpse */}
                <motion.div
                  animate={{ opacity: activeSection === 2 ? 1 : 0.3 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Image size={14} className="text-xenium-violet-mid/60" />
                    <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Photo Gallery</span>
                  </div>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="flex-1 aspect-square rounded-xl overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--xenium-violet-deep) / ${0.2 + i * 0.08}), hsl(var(--xenium-rose) / ${0.1 + i * 0.05}))`
                        }}
                        animate={activeSection === 2 ? { scale: [0.95, 1], opacity: [0.5, 1] } : {}}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart size={16} className="text-foreground/20" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Timeline glimpse */}
                <motion.div
                  animate={{ opacity: activeSection === 3 ? 1 : 0.3 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={14} className="text-xenium-amber/60" />
                    <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Timeline</span>
                  </div>
                  <div className="space-y-3">
                    {["First Date — 2016", "The Trip to Paris — 2018", "Our Wedding — 2020"].map((item, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-3"
                        animate={activeSection === 3 ? { x: [10, 0], opacity: [0, 1] } : {}}
                        transition={{ duration: 0.4, delay: i * 0.15 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-xenium-amber/40" />
                        <span className="text-sm text-muted-foreground/60">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Scroll indicator */}
              <div className="flex justify-center mt-8">
                <ChevronDown size={16} className="text-muted-foreground/30 animate-bounce" />
              </div>
            </div>

            {/* Section indicators */}
            <div className="flex justify-center gap-2 pb-6">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveSection(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeSection === i ? "w-6 bg-xenium-amber/60" : "bg-muted-foreground/20"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="text-center text-muted-foreground/40 text-xs mt-6">
            This is a simulated preview. Every Xenium is uniquely crafted for its recipient.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
