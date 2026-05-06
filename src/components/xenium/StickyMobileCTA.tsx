import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

/**
 * Bottom-anchored CTA visible only on touch / small screens.
 * Hidden until the user scrolls past the hero, hidden again when the
 * request form is in view (we don't want a duplicate CTA there).
 */
export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const home = document.getElementById("home");
      const create = document.getElementById("create");
      const homeBottom = home ? home.getBoundingClientRect().bottom : 0;
      const createTop = create ? create.getBoundingClientRect().top : Number.POSITIVE_INFINITY;
      // Show after we've scrolled past the hero, hide once create form is in view
      setVisible(homeBottom < 80 && createTop > window.innerHeight);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden pointer-events-none transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <div className="bg-gradient-to-t from-background via-background/95 to-background/0 pt-6 pb-3 px-4 safe-bottom">
        <button
          type="button"
          onClick={() => document.querySelector("#create")?.scrollIntoView({ behavior: "smooth" })}
          tabIndex={visible ? 0 : -1}
          className="pointer-events-auto w-full gradient-full text-foreground font-semibold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 glow-violet shadow-[0_-4px_30px_-10px_hsl(var(--xenium-violet-deep)/0.6)]"
        >
          <Sparkles size={16} />
          Create Your Xenium · ₹750
        </button>
      </div>
    </div>
  );
}
