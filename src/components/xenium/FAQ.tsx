import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";

export const faqs = [
  {
    q: "What exactly is a Xenium?",
    a: "A Xenium is a private, beautifully designed digital experience created around one specific person and one specific story. We weave photos, videos, written messages, music, animated text and a timeline into a cinematic microsite that lives at a private link — opened on any phone, kept forever.",
  },
  {
    q: "How does the process work?",
    a: "You fill out the request form (3 minutes). We email you within 24 hours to confirm details and collect any photos, videos or notes you want included. Our design team builds your Xenium, sends a preview, takes one round of revisions, and delivers the final private link — typically within 48–72 hours of confirmation.",
  },
  {
    q: "How long does it take to create?",
    a: "Most Xeniums are delivered within 48–72 hours of confirmation. If your moment is sooner, flag it on the form and we'll do everything we can to meet the deadline — same-day turnarounds are possible for simpler experiences.",
  },
  {
    q: "Is my Xenium private?",
    a: "Yes. Every Xenium is hosted on a private, unguessable URL that only you and your recipient can open. There's no sign-up required for them. Optional password protection is available — just request it on the form.",
  },
  {
    q: "Can I see a real sample first?",
    a: "Absolutely — the Examples section above has six full sample experiences (birthday, anniversary, proposal, memorial, retirement and corporate). Click any of them to walk through a real preview before you decide.",
  },
  {
    q: "What if I'm not happy with the result?",
    a: "Every order includes one round of revisions to refine copy, swap photos, change music or adjust the design. If we're unable to deliver the experience for reasons on our side, you'll receive a full refund — see the Terms page for the full policy.",
  },
  {
    q: "What media can I include?",
    a: "Photos (JPG, PNG, HEIC), short videos (MP4, MOV — under 100 MB each), audio messages, written letters, song lyrics, recipient handles, anything that helps tell the story. We also handle gentle photo retouching at no extra cost.",
  },
  {
    q: "Are my photos and data secure?",
    a: "Yes. Media you share is stored encrypted on our cloud provider, accessed only by the small team building your Xenium, and removed from our working storage after delivery. We never sell or share your data — see the Privacy Policy for full details.",
  },
  {
    q: "Can I gift this to someone abroad?",
    a: "Yes — a Xenium is just a link, so it works anywhere with internet. We've delivered Xeniums to recipients in the US, UK, UAE, Singapore and Australia. Pricing remains in INR; international cards work fine through our payment partner.",
  },
  {
    q: "What payment methods do you accept?",
    a: "UPI, debit and credit cards (Visa, Mastercard, RuPay, Amex), and net banking — all through our secure payment partner. Payment is collected after we confirm your request and before production begins.",
  },
  {
    q: "How is the final Xenium delivered?",
    a: "You'll get a private, shareable link via email along with a QR code (for printing on a card or gift tag) and a downloadable cover image you can use on social or WhatsApp.",
  },
  {
    q: "Do you offer corporate or team packages?",
    a: "Yes — we craft employee appreciation experiences, retirement tributes and team recognition Xeniums regularly. For volume requests (5 or more), email xeniumgifts@gmail.com for custom pricing and faster turnarounds.",
  },
  {
    q: "Do recipients need an app or account?",
    a: "Never. The Xenium opens in any phone or laptop browser — no install, no login, no friction. They tap the link, the experience loads, that's it.",
  },
  {
    q: "Can I include an Indian-language message or song?",
    a: "Yes. We routinely include Hindi, Tamil, Telugu, Kannada, Marathi, Bengali, Punjabi and Malayalam messages and music. Mention the language and any specific lyrics or fonts you'd like in the story field.",
  },
];

export default function FAQ() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="faq" className="py-20 sm:py-24 px-4 sm:px-6" ref={ref} aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">FAQ</p>
          <h2 id="faq-heading" className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Questions?<br />
            <span className="italic gradient-text">We've got answers.</span>
          </h2>
        </div>
        <div className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`} className="glass-card px-4 sm:px-6 border rounded-xl border-border">
                <AccordionTrigger className="text-left font-sans text-sm sm:text-base font-medium hover:no-underline py-4 sm:py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-10 sm:mt-12 text-center glass-card p-6 sm:p-8">
          <MessageCircleQuestion size={20} className="text-xenium-amber mx-auto mb-3" aria-hidden="true" />
          <p className="font-display text-lg sm:text-xl text-foreground/90 mb-2">Still have a question?</p>
          <p className="text-muted-foreground text-sm mb-4">We reply to every email within 24 hours, usually faster.</p>
          <a
            href="mailto:xeniumgifts@gmail.com"
            className="inline-flex items-center gap-2 text-sm font-medium text-xenium-amber hover:text-foreground transition-colors"
          >
            xeniumgifts@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
