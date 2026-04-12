import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Music, Heart, Image } from "lucide-react";
import phoneMockup from "@/assets/phone-mockup-screen.jpg";

export default function Transformation() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-14 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">The Difference</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            From a simple message…<br />
            <span className="italic gradient-text">to something they'll never forget.</span>
          </h2>
        </div>

        <div className={`grid md:grid-cols-2 gap-8 items-center transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Left: Plain message */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="glass-card p-8 md:p-10 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground text-xs font-bold">
                  Y
                </div>
                <div>
                  <p className="text-sm text-foreground/70">You</p>
                  <p className="text-[10px] text-muted-foreground/40">Today, 8:42 AM</p>
                </div>
              </div>
              <div className="bg-muted/30 rounded-2xl rounded-tl-sm p-5">
                <p className="text-foreground/60 text-sm leading-relaxed">
                  Happy Birthday ❤️<br />
                  Hope you have a great day!<br />
                  Love you so much 🎂
                </p>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <span className="text-[10px] text-muted-foreground/30">Delivered</span>
              </div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full bg-muted/10 blur-[30px]" />
          </motion.div>

          {/* Arrow */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
            <motion.div
              animate={isVisible ? { x: [0, 8, 0] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={24} className="text-xenium-amber/40" />
            </motion.div>
          </div>

          {/* Right: Xenium experience */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden border border-xenium-violet-mid/20 glow-violet">
              <img
                src={phoneMockup}
                alt="Xenium experience preview showing a personalized digital gift"
                className="w-full h-auto"
                loading="lazy"
                width={640}
                height={1280}
              />
              {/* Overlay with subtle info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/90 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Image size={12} className="text-xenium-violet-mid/60" />
                    <span className="text-[10px] text-muted-foreground/40">Gallery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Music size={12} className="text-xenium-amber/60" />
                    <span className="text-[10px] text-muted-foreground/40">Music</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Heart size={12} className="text-xenium-rose/60" />
                    <span className="text-[10px] text-muted-foreground/40">Messages</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
