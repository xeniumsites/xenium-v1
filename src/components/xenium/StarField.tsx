import { useMemo } from "react";

function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2.2 + 0.6,
    delay: Math.random() * 8,
    duration: Math.random() * 5 + 5,
    driftX: (Math.random() - 0.5) * 50,
    driftY: (Math.random() - 0.5) * 40,
    opacity: Math.random() * 0.5 + 0.25,
  }));
}

export default function StarField() {
  const stars = useMemo(() => generateStars(90), []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden motion-reduce:hidden"
      style={{ zIndex: 0 }}
    >
      {/* Soft drifting glow blobs */}
      <div className="absolute top-[10%] left-[8%] w-[600px] h-[600px] rounded-full bg-xenium-violet-deep/[0.06] blur-[140px] animate-glow-pulse" />
      <div
        className="absolute top-[55%] right-[5%] w-[500px] h-[500px] rounded-full bg-xenium-rose/[0.05] blur-[130px] animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-[5%] left-[35%] w-[450px] h-[450px] rounded-full bg-xenium-amber/[0.04] blur-[120px] animate-glow-pulse"
        style={{ animationDelay: "4s" }}
      />

      {/* Floating stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-foreground animate-star-float"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              boxShadow: `0 0 ${s.size * 3}px hsl(var(--foreground) / 0.4)`,
              "--drift-x": `${s.driftX}px`,
              "--drift-y": `${s.driftY}px`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Edge vignette so stars feel deeper at the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, hsl(var(--background) / 0.55) 100%)",
        }}
      />
    </div>
  );
}
