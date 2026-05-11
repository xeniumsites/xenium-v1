import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import Footer from "@/components/xenium/Footer";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service | Xenium";
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
          Terms of <span className="italic gradient-text">Service</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">1. Acceptance of terms</h2>
            <p>
              By submitting a request or using xenium-sites.com you agree to these Terms. If you do not agree,
              please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">2. The service</h2>
            <p>
              Xenium designs and delivers personalized digital gifting experiences (web pages, cinematic
              tributes, memory timelines and similar) based on the details and media you provide. All
              experiences are offered at a fixed price of ₹750 unless otherwise stated.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">3. Order, delivery &amp; revisions</h2>
            <p>
              After you submit a request we will confirm receipt and contact you to finalize details and
              payment. Orders placed before 12 PM IST are delivered the same day; orders placed after 12 PM
              IST are delivered within 24 hours of payment confirmation. Every order includes free unlimited
              revisions until you are satisfied with the result.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">4. Payment, refunds &amp; the Happiness Guarantee</h2>
            <p>
              Payment is collected before production begins. Every order is backed by our 100% Happiness
              Guarantee: if you are not satisfied with the final Xenium after revisions, or if we are unable
              to deliver the experience for any reason on our side, you will receive a full refund — no
              questions asked. Refunds are issued to the original payment method within 5–7 business days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">5. Your content</h2>
            <p>
              You retain ownership of all photos, videos, audio and text you upload. You grant Xenium a limited,
              non-exclusive license to use that content solely to create, host and deliver your experience. You
              confirm you have the right to share the content you upload and the consent of anyone identifiable
              in it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">6. Acceptable use</h2>
            <p>
              You agree not to upload content that is illegal, infringes someone else's rights, is hateful,
              harassing, sexually explicit, or otherwise harmful. We may refuse or remove any request that
              violates this policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">7. Intellectual property</h2>
            <p>
              The Xenium name, logo, site design and underlying code are owned by Xenium. You may not copy,
              resell or redistribute the service without written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">8. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Xenium's total liability for any claim related to the
              service is limited to the amount you paid for the relevant order. We are not liable for indirect
              or consequential losses.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">9. Changes to terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the service after changes are
              posted constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">10. Governing law</h2>
            <p>These Terms are governed by the laws of India.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">11. Contact</h2>
            <p>
              For any questions about these Terms, reach us at{" "}
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
