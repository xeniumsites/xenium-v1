import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/xenium-logo.png";
import { Instagram, Mail, Sparkles } from "lucide-react";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Occasions", href: "#occasions" },
  { label: "Examples", href: "#examples" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Create Yours", href: "#create" },
];

const occasionLinks = [
  { label: "Birthday", href: "/experience/birthday" },
  { label: "Anniversary", href: "/experience/anniversary" },
  { label: "Proposal", href: "/experience/proposal" },
  { label: "Memorial", href: "/experience/memorial" },
  { label: "Retirement", href: "/experience/retirement" },
  { label: "Corporate", href: "/experience/corporate" },
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
    <footer className="border-t border-border py-14 sm:py-16 px-4 sm:px-6 mt-8" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site footer</h2>
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center mb-4" aria-label="Xenium home">
              <img src={logo} alt="Xenium" className="h-8 w-auto" width={40} height={40} />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-5">
              Where emotion becomes experience. Hand-crafted personalised digital gifts, made in India.
            </p>
            <button
              type="button"
              onClick={() => scrollTo("#create")}
              className="gradient-full text-foreground font-semibold px-5 py-2.5 rounded-full text-xs flex items-center gap-2 hover:opacity-95 transition-all"
            >
              <Sparkles size={13} />
              Create Your Xenium
            </button>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold mb-4 uppercase tracking-widest text-foreground/80">Explore</p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(l.href)}
                    className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sample experiences */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold mb-4 uppercase tracking-widest text-foreground/80">Sample Experiences</p>
            <ul className="space-y-2.5">
              {occasionLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    to={l.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold mb-4 uppercase tracking-widest text-foreground/80">Connect</p>
            <div className="flex gap-3 mb-4">
              <a
                href="mailto:xeniumgifts@gmail.com"
                aria-label="Email Xenium"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-xenium-violet-mid/40 transition-colors"
              >
                <Mail size={16} aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/xenium.sites/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Xenium on Instagram"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-xenium-violet-mid/40 transition-colors"
              >
                <Instagram size={16} aria-hidden="true" />
              </a>
            </div>
            <a
              href="mailto:xeniumgifts@gmail.com"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors break-all"
            >
              xeniumgifts@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/80">© {new Date().getFullYear()} Xenium. All rights reserved.</p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link to="/track" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Track an order
            </Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
