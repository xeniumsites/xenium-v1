import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "What exactly is a Xenium?", a: "A Xenium is a beautifully designed, private digital experience created around a personal story or moment. It combines photos, videos, messages, music, and animations into an immersive microsite that can be shared via a private link." },
  { q: "How does the process work?", a: "Simply fill out our request form with details about the occasion, the person, and the story. Our design team then crafts a unique digital experience and delivers it to you via a private link within the agreed timeline." },
  { q: "Is my Xenium private?", a: "Absolutely. Every Xenium is hosted on a private link that only you and your recipient can access. We also offer password protection for added privacy." },
  { q: "How long does it take to create?", a: "Essential experiences are typically delivered within 3–5 business days. Signature within 5–7 days. Bespoke projects have custom timelines based on complexity." },
  { q: "Can I request something custom?", a: "Yes! Our Bespoke package is designed for fully custom requests. From unique animations to custom illustrations, we can bring any vision to life." },
  { q: "What media can I include?", a: "You can include photos, videos, written messages, background music, timelines, animated text, guest messages, and more depending on your package." },
  { q: "How is it delivered?", a: "You'll receive a private, shareable link via email. You can also get a QR code to print on a physical card or gift." },
  { q: "Do you offer corporate or team packages?", a: "Yes! We create employee appreciation experiences, retirement tributes, and team recognition Xeniums. Contact us for corporate pricing." },
];

export default function FAQ() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="faq" className="py-32 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">FAQ</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Questions?<br />
            <span className="italic gradient-text">We've got answers.</span>
          </h2>
        </div>
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="glass-card px-6 border rounded-xl border-border">
                <AccordionTrigger className="text-left font-sans text-base font-medium hover:no-underline py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
