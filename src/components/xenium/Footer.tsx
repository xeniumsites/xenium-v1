import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/xenium-logo.png";
import { Instagram, Mail } from "lucide-react";

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Occasions", href: "#occasions" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Create", href: "#create" },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (href: string) => {
    if (location.pathname !== "/") {
      navigate("/" + href);
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <img src={logo} alt="Xenium" className="h-7 mb-4" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Where emotion becomes experience.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-4 uppercase tracking-widest text-muted-foreground">Quick Links</p>
            <div className="grid grid-cols-2 gap-2">
              {links.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollTo(l.href)}
                  className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-4 uppercase tracking-widest text-muted-foreground">Connect</p>
            <div className="flex gap-3">
              <a
                href="mailto:xeniumgifts@gmail.com"
                aria-label="Email Xenium"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-xenium-violet-mid/40 transition-colors"
              >
                <Mail size={16} />
              </a>
              <a
                href="https://www.instagram.com/xenium.sites/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Xenium on Instagram"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-xenium-violet-mid/40 transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Xenium. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
