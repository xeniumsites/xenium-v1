import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const occasionOptions = ["Birthday", "Anniversary", "Proposal", "Memorial / Tribute", "Love Story", "Retirement", "Corporate / Employee"];
const moodOptions = ["Romantic", "Emotional", "Elegant", "Nostalgic", "Joyful", "Heartfelt", "Luxury", "Cinematic", "Soft & Warm", "Playful"];
const featureOptions = ["Photo Gallery", "Video Embed", "Timeline of Moments", "Heartfelt Messages", "Background Music", "Animated Text", "Guest Messages", "Countdown Reveal", "Surprise Section", "QR Code Sharing", "Password Protection", "Custom Intro Screen"];
const styleOptions = ["Elegant", "Romantic", "Minimal", "Luxury", "Modern", "Cinematic", "Dreamy", "Emotional", "Premium Editorial"];
const packageOptions = ["Essential", "Signature", "Bespoke"];

const TOTAL_STEPS = 6;

interface FormData {
  occasion: string;
  recipientName: string;
  yourName: string;
  relationship: string;
  occasionDate: string;
  mood: string;
  story: string;
  features: string[];
  style: string;
  colors: string;
  inspiration: string;
  additionalNotes: string;
  email: string;
  phone: string;
  needByDate: string;
  preferredPackage: string;
  finalNotes: string;
}

export default function RequestForm() {
  const { ref, isVisible } = useScrollReveal();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    occasion: "", recipientName: "", yourName: "", relationship: "",
    occasionDate: "", mood: "", story: "", features: [],
    style: "", colors: "", inspiration: "", additionalNotes: "",
    email: "", phone: "", needByDate: "", preferredPackage: "", finalNotes: "",
  });

  const update = (field: keyof FormData, value: string | string[]) =>
    setForm((p) => ({ ...p, [field]: value }));

  const toggleFeature = (f: string) =>
    setForm((p) => ({
      ...p,
      features: p.features.includes(f)
        ? p.features.filter((x) => x !== f)
        : [...p.features, f],
    }));

  const next = () => step < TOTAL_STEPS && setStep(step + 1);
  const prev = () => step > 1 && setStep(step - 1);
  const handleSubmit = () => setSubmitted(true);

  const ChipSelect = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`px-4 py-2 rounded-full text-sm transition-all border ${
            value === o
              ? "gradient-full text-foreground border-transparent"
              : "border-border text-muted-foreground hover:text-foreground hover:border-xenium-violet-mid/40"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );

  const InputField = ({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
    <div>
      <label className="text-sm text-muted-foreground mb-2 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-xenium-violet-mid/60 transition-colors"
      />
    </div>
  );

  if (submitted) {
    return (
      <section id="create" className="py-32 px-6" ref={ref}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 rounded-full gradient-full flex items-center justify-center mx-auto mb-8">
              <Check size={32} className="text-foreground" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-light mb-4">
              Your Xenium request<br /><span className="italic gradient-text">has been received.</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              We'll reach out via email with the next steps.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="create" className="py-32 px-6" ref={ref}>
      <div className="max-w-2xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Start Here</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Start Your<br /><span className="italic gradient-text">Xenium</span>
          </h2>
        </div>

        <div className={`glass-card p-8 md:p-10 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Progress */}
          <div className="flex items-center gap-1 mb-10">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className="flex-1 flex items-center">
                <div className={`h-1 w-full rounded-full transition-colors ${i < step ? "gradient-full" : "bg-muted"}`} />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest">Step {step} of {TOTAL_STEPS}</p>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {step === 1 && (
                <div>
                  <h3 className="font-display text-2xl mb-6">Choose the occasion</h3>
                  <ChipSelect options={occasionOptions} value={form.occasion} onChange={(v) => update("occasion", v)} />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-5">
                  <h3 className="font-display text-2xl mb-6">Who is it for?</h3>
                  <InputField label="Recipient Name" value={form.recipientName} onChange={(v) => update("recipientName", v)} placeholder="Their name" />
                  <InputField label="Your Name" value={form.yourName} onChange={(v) => update("yourName", v)} placeholder="Your name" />
                  <InputField label="Relationship to Them" value={form.relationship} onChange={(v) => update("relationship", v)} placeholder="e.g. Partner, Friend, Manager" />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-5">
                  <h3 className="font-display text-2xl mb-6">Tell us about the moment</h3>
                  <InputField label="Occasion Date" value={form.occasionDate} onChange={(v) => update("occasionDate", v)} type="date" />
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Desired emotional tone</label>
                    <ChipSelect options={moodOptions} value={form.mood} onChange={(v) => update("mood", v)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Your story / message</label>
                    <textarea
                      value={form.story}
                      onChange={(e) => update("story", e.target.value)}
                      placeholder="Share the story, the memories, the emotion..."
                      rows={5}
                      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-xenium-violet-mid/60 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}
              {step === 4 && (
                <div>
                  <h3 className="font-display text-2xl mb-6">What should be included?</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {featureOptions.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFeature(f)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-left transition-all border ${
                          form.features.includes(f)
                            ? "border-xenium-violet-mid/60 bg-xenium-violet-deep/20 text-foreground"
                            : "border-border text-muted-foreground hover:border-xenium-violet-mid/30"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          form.features.includes(f) ? "gradient-full border-transparent" : "border-border"
                        }`}>
                          {form.features.includes(f) && <Check size={10} className="text-foreground" />}
                        </div>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 5 && (
                <div className="space-y-5">
                  <h3 className="font-display text-2xl mb-6">Design preferences</h3>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Preferred style</label>
                    <ChipSelect options={styleOptions} value={form.style} onChange={(v) => update("style", v)} />
                  </div>
                  <InputField label="Preferred colors" value={form.colors} onChange={(v) => update("colors", v)} placeholder="e.g. Gold and navy, soft pastels" />
                  <InputField label="Inspiration link" value={form.inspiration} onChange={(v) => update("inspiration", v)} placeholder="Pinterest board, website, etc." />
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Additional notes</label>
                    <textarea
                      value={form.additionalNotes}
                      onChange={(e) => update("additionalNotes", e.target.value)}
                      placeholder="Anything else we should know..."
                      rows={3}
                      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-xenium-violet-mid/60 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}
              {step === 6 && (
                <div className="space-y-5">
                  <h3 className="font-display text-2xl mb-6">Delivery details</h3>
                  <InputField label="Email Address" value={form.email} onChange={(v) => update("email", v)} type="email" placeholder="your@email.com" />
                  <InputField label="Phone Number (optional)" value={form.phone} onChange={(v) => update("phone", v)} type="tel" placeholder="+1 (555) 000-0000" />
                  <InputField label="Need-by Date" value={form.needByDate} onChange={(v) => update("needByDate", v)} type="date" />
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Preferred Package</label>
                    <ChipSelect options={packageOptions} value={form.preferredPackage} onChange={(v) => update("preferredPackage", v)} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Final notes</label>
                    <textarea
                      value={form.finalNotes}
                      onChange={(e) => update("finalNotes", e.target.value)}
                      placeholder="Any last thoughts..."
                      rows={3}
                      className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-xenium-violet-mid/60 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <button
              onClick={prev}
              className={`flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ${step === 1 ? "invisible" : ""}`}
            >
              <ChevronLeft size={16} /> Back
            </button>
            {step < TOTAL_STEPS ? (
              <button
                onClick={next}
                className="gradient-full text-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-all flex items-center gap-1"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="gradient-full text-foreground font-semibold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-all glow-violet flex items-center gap-2"
              >
                <Sparkles size={16} /> Create My Xenium
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
