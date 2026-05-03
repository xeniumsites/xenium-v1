import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import Footer from "@/components/xenium/Footer";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | Xenium";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-light mb-3">
          Privacy <span className="italic gradient-text">Policy</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">1. Introduction</h2>
            <p>
              Xenium ("we", "our", "us") creates personalized digital gifting experiences. This policy explains
              what information we collect when you use xenium-sites.com, how we use it, and the choices you have.
              By using our service you agree to this policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">2. Information we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact details you submit: name, email address, phone number.</li>
              <li>Details about the occasion and recipient you provide in the request form.</li>
              <li>Photos, videos, audio and written messages you upload to be included in your experience.</li>
              <li>Basic technical data (IP address, browser, pages viewed) collected through standard server logs.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">3. How we use your information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To design, build and deliver your personalized Xenium experience.</li>
              <li>To send transactional emails (order confirmations, delivery links, support replies).</li>
              <li>To respond to your questions and provide customer support.</li>
              <li>To improve our service and prevent fraud or misuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">4. Sharing</h2>
            <p>
              We do not sell your personal information. We share data only with trusted processors who help us
              operate the service — including our cloud hosting and database provider and our transactional
              email provider — and only to the extent necessary to deliver your experience.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">5. Data retention & your rights</h2>
            <p>
              We retain your data for as long as needed to deliver your experience and meet legal obligations.
              You can request access to, correction of, or deletion of your personal data at any time by emailing{" "}
              <a href="mailto:xeniumgifts@gmail.com" className="text-foreground underline hover:text-xenium-amber transition-colors">
                xeniumgifts@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">6. Cookies</h2>
            <p>
              We use only essential cookies and local storage required for the site to function. We do not use
              advertising or third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">7. Children</h2>
            <p>
              Xenium is not directed to children under 13. We do not knowingly collect personal information
              from children.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">8. Changes</h2>
            <p>
              We may update this policy from time to time. Material changes will be reflected by updating the
              "Last updated" date above.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">9. Contact</h2>
            <p>
              Questions or requests? Reach us at{" "}
              <a href="mailto:xeniumgifts@gmail.com" className="text-foreground underline hover:text-xenium-amber transition-colors">
                xeniumgifts@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
