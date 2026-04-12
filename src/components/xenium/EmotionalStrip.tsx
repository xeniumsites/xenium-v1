import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import emotionalMemory from "@/assets/emotional-memory.jpg";
import emotionalBirthday from "@/assets/emotional-birthday.jpg";
import emotionalProposal from "@/assets/emotional-proposal.jpg";
import emotionalAbstract from "@/assets/emotional-abstract.jpg";

const tiles = [
  { img: emotionalMemory, label: "A Memory", overlay: "Together, forever." },
  { img: emotionalBirthday, label: "A Moment", overlay: "The glow of celebration." },
  { img: emotionalProposal, label: "A Feeling", overlay: "The question that changed everything." },
  { img: emotionalAbstract, label: "An Emotion", overlay: "Beyond words." },
];

export default function EmotionalStrip() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-16 overflow-hidden" ref={ref}>
      <div className={`flex gap-4 px-6 max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {tiles.map((tile, i) => (
          <motion.div
            key={i}
            className="flex-1 min-w-0 relative rounded-2xl overflow-hidden aspect-square group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.12 }}
          >
            <img
              src={tile.img}
              alt={tile.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              width={512}
              height={512}
            />
            {/* Blur + dark overlay */}
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] group-hover:backdrop-blur-0 transition-all duration-500" />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            {/* Text */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
              <p className="text-xenium-amber/60 text-[10px] tracking-[0.15em] uppercase mb-1">{tile.label}</p>
              <p className="font-display text-sm md:text-base italic text-foreground/70 leading-snug group-hover:text-foreground/90 transition-colors">
                {tile.overlay}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
