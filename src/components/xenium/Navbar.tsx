import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/xenium-logo.png";

const links = [
  // { label: "Home", href: "#home" },
  { label: "Occasions", href: "#occasions" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Track Order", href: "/track", external: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  // Close menu on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Scrollspy
  useEffect(() => {
    if (location.pathname !== "/") return;
    const ids = links.filter((l) => !l.external).map((l) => l.href.slice(1));
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
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [location.pathname]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }
    if (location.pathname !== "/") {
      navigate("/" + href);
      return;
    }
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
      aria-label="Primary"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/*<button*/}
        {/*  type="button"*/}
        {/*  onClick={() => scrollTo("#home")}*/}
        {/*  className="flex items-center gap-2 min-h-[44px]"*/}
        {/*  aria-label="Xenium home"*/}
        {/*>*/}
        {/*  <img src={logo} alt="Xenium" className="h-8 sm:h-10 w-auto object-contain" width={40} height={40} />*/}
        {/*</button>*/}

        <div className="hidden lg:flex items-center gap-7">
          {links.map((l) => {
            const isActive = activeId === l.href.slice(1);
            return (
              <button
                type="button"
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className={`relative text-sm transition-all duration-300 min-h-[44px] flex items-center ${
                  isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
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
            type="button"
            onClick={() => scrollTo("#create")}
            className="gradient-full text-sm font-semibold text-foreground px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity glow-violet flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            Create Yours
          </button>
        </div>

        <button
          type="button"
          className="lg:hidden text-foreground p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`lg:hidden bg-background/95 backdrop-blur-xl border-t border-border overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="px-6 py-5 flex flex-col gap-1">
          {links.map((l) => {
            const isActive = activeId === l.href.slice(1);
            return (
              <button
                type="button"
                key={l.href}
                onClick={() => scrollTo(l.href)}
                tabIndex={mobileOpen ? 0 : -1}
                className={`text-left text-base py-3 min-h-[44px] transition-colors ${
                  isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground hover:text-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {l.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => scrollTo("#create")}
            tabIndex={mobileOpen ? 0 : -1}
            className="gradient-full text-sm font-semibold text-foreground px-6 py-3.5 rounded-full mt-3 w-full flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            Create Your Xenium
          </button>
        </div>
      </div>
    </nav>
  );
}
