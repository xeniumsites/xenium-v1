import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/xenium-logo.png";

const links = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Occasions", href: "#occasions" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scrollspy: track which section is currently in view
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <button onClick={() => scrollTo("#home")} className="flex items-center gap-2" aria-label="Xenium home">
          <img src={logo} alt="Xenium logo" className="h-7 sm:h-8" width={120} height={32} />
        </button>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => {
            const isActive = activeId === l.href.slice(1);
            return (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className={`relative text-sm transition-all duration-300 min-h-[44px] flex items-center ${
                  isActive
                    ? "font-semibold text-foreground"
                    : "font-medium text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {l.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-xenium-amber to-transparent" />
                )}
              </button>
            );
          })}
          <button
            onClick={() => scrollTo("#create")}
            className="gradient-full text-sm font-semibold text-foreground px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity glow-violet"
            style={{ touchAction: "manipulation" }}
          >
            Create Your Xenium
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-foreground p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border">
          <div className="px-6 py-6 flex flex-col gap-1">
            {links.map((l) => {
              const isActive = activeId === l.href.slice(1);
              return (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className={`text-left text-base py-3 min-h-[44px] transition-colors ${
                    isActive
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {l.label}
                </button>
              );
            })}
            <button
              onClick={() => scrollTo("#create")}
              className="gradient-full text-sm font-semibold text-foreground px-6 py-3 rounded-full mt-3 w-full"
            >
              Create Your Xenium
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
