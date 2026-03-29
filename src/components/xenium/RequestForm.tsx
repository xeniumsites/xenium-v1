import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Check, AlertCircle } from "lucide-react";

const occasions = ["Birthday", "Anniversary", "Proposal", "Memorial / Tribute", "Love Story", "Retirement", "Corporate / Employee", "Other"];
const moods = ["Cinematic & Grand", "Warm & Nostalgic", "Romantic & Dreamy", "Fun & Playful", "Elegant & Minimal", "Bold & Modern"];
const featureOptions = ["Photo Gallery", "Video Embed", "Timeline", "Written Messages", "Background Music", "Animated Text", "Guest Messages", "QR Code"];

interface FormData {
  occasion: string;
  recipientName: string;
  recipientRelation: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  mood: string;
  features: string[];
  story: string;
  deadline: string;
}

const initial: FormData = {
  occasion: "",
  recipientName: "",
  recipientRelation: "",
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  mood: "",
  features: [],
  story: "",
  deadline: "",
};

export default function RequestForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const totalSteps = 5;

  const validate = (): string[] => {
    const errs: string[] = [];
    switch (step) {
      case 0:
        if (!form.occasion) errs.push("Please select an occasion.");
        break;
      case 1:
        if (!form.recipientName.trim()) errs.push("Recipient name is required.");
        if (!form.recipientRelation.trim()) errs.push("Relationship is required.");
        break;
      case 2:
        if (!form.senderName.trim()) errs.push("Your name is required.");
        if (!form.senderEmail.trim()) errs.push("Email is required.");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.senderEmail)) errs.push("Please enter a valid email.");
        if (!form.senderPhone.trim()) errs.push("Phone number is required.");
        break;
      case 3:
        if (!form.mood) errs.push("Please select a mood.");
        if (form.features.length === 0) errs.push("Please select at least one feature.");
        break;
      case 4:
        if (!form.story.trim()) errs.push("Please share a brief story or context.");
        if (!form.deadline.trim()) errs.push("Please provide a deadline.");
        break;
    }
    return errs;
  };

  const next = () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };
  const prev = () => { setErrors([]); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);

    const subject = encodeURIComponent(`New Xenium Request — ${form.occasion} for ${form.recipientName}`);
    const body = encodeURIComponent(
      `XENIUM REQUEST\n` +
      `══════════════════════\n\n` +
      `Occasion: ${form.occasion}\n` +
      `Recipient: ${form.recipientName}\n` +
      `Relationship: ${form.recipientRelation}\n\n` +
      `Sender: ${form.senderName}\n` +
      `Email: ${form.senderEmail}\n` +
      `Phone: ${form.senderPhone}\n\n` +
      `Mood: ${form.mood}\n` +
      `Features: ${form.features.join(", ")}\n\n` +
      `Story / Context:\n${form.story}\n\n` +
      `Deadline: ${form.deadline}\n`
    );

    window.open(`mailto:xeniumgifts@gmail.com?subject=${subject}&body=${body}`, "_self");
    setSubmitted(true);
  };

  const toggleFeature = (f: string) =>
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f],
    }));

  const inputClass = "w-full bg-muted/30 border border-border rounded-xl px-5 py-3.5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-xenium-violet-mid/60 focus:ring-1 focus:ring-xenium-violet-mid/30 transition-all text-sm";
  const errorInputClass = "border-destructive/60 focus:border-destructive focus:ring-destructive/30";

  if (submitted) {
    return (
      <section id="create" className="py-40 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto glass-card p-16 text-center"
        >
          <div className="w-20 h-20 rounded-full gradient-full flex items-center justify-center mx-auto mb-8">
            <Check size={36} className="text-foreground" />
          </div>
          <h3 className="font-display text-4xl font-medium mb-4">Your Xenium is on its way.</h3>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your email client should have opened with your request details. Please send the email to complete your submission. We'll be in touch within 24 hours.
          </p>
        </motion.div>
      </section>
    );
  }

  const steps = [
    // Step 0: Occasion
    <div className="space-y-4">
      <label className="block text-sm font-medium text-muted-foreground mb-2">What's the occasion? *</label>
      <div className="flex flex-wrap gap-3">
        {occasions.map((o) => (
          <button
            key={o}
            onClick={() => setForm({ ...form, occasion: o })}
            className={`px-5 py-2.5 rounded-full text-sm border transition-all ${
              form.occasion === o
                ? "gradient-full text-foreground border-transparent glow-violet"
                : "border-border text-muted-foreground hover:border-xenium-violet-mid/40 hover:text-foreground"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Recipient
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Recipient's name *</label>
        <input
          type="text"
          placeholder="e.g. Sarah"
          value={form.recipientName}
          onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
          className={`${inputClass} ${!form.recipientName.trim() && errors.length ? errorInputClass : ""}`}
          maxLength={100}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Your relationship *</label>
        <input
          type="text"
          placeholder="e.g. Partner, Mother, Best Friend, Manager"
          value={form.recipientRelation}
          onChange={(e) => setForm({ ...form, recipientRelation: e.target.value })}
          className={`${inputClass} ${!form.recipientRelation.trim() && errors.length ? errorInputClass : ""}`}
          maxLength={100}
        />
      </div>
    </div>,

    // Step 2: Sender details
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Your name *</label>
        <input
          type="text"
          placeholder="Your full name"
          value={form.senderName}
          onChange={(e) => setForm({ ...form, senderName: e.target.value })}
          className={`${inputClass} ${!form.senderName.trim() && errors.length ? errorInputClass : ""}`}
          maxLength={100}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Your email *</label>
        <input
          type="email"
          placeholder="you@email.com"
          value={form.senderEmail}
          onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
          className={`${inputClass} ${!form.senderEmail.trim() && errors.length ? errorInputClass : ""}`}
          maxLength={255}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Phone number *</label>
        <input
          type="tel"
          placeholder="+91 98765 43210"
          value={form.senderPhone}
          onChange={(e) => setForm({ ...form, senderPhone: e.target.value })}
          className={`${inputClass} ${!form.senderPhone.trim() && errors.length ? errorInputClass : ""}`}
          maxLength={20}
        />
      </div>
    </div>,

    // Step 3: Mood & Features
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-3">Desired mood *</label>
        <div className="flex flex-wrap gap-3">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setForm({ ...form, mood: m })}
              className={`px-5 py-2.5 rounded-full text-sm border transition-all ${
                form.mood === m
                  ? "gradient-full text-foreground border-transparent"
                  : "border-border text-muted-foreground hover:border-xenium-violet-mid/40 hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-3">Features you'd like * <span className="text-xs text-muted-foreground/60">(select at least one)</span></label>
        <div className="flex flex-wrap gap-3">
          {featureOptions.map((f) => (
            <button
              key={f}
              onClick={() => toggleFeature(f)}
              className={`px-5 py-2.5 rounded-full text-sm border transition-all ${
                form.features.includes(f)
                  ? "gradient-violet-rose text-foreground border-transparent"
                  : "border-border text-muted-foreground hover:border-xenium-rose/40 hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 4: Story & Deadline
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Tell us the story *</label>
        <textarea
          rows={4}
          placeholder="Share the context, emotions, memories, or anything you'd like us to know..."
          value={form.story}
          onChange={(e) => setForm({ ...form, story: e.target.value })}
          className={`${inputClass} resize-none ${!form.story.trim() && errors.length ? errorInputClass : ""}`}
          maxLength={2000}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">When do you need it? *</label>
        <input
          type="text"
          placeholder="e.g. Before March 15, 2026"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          className={`${inputClass} ${!form.deadline.trim() && errors.length ? errorInputClass : ""}`}
          maxLength={100}
        />
      </div>
    </div>,
  ];

  const stepLabels = ["Occasion", "Recipient", "Your Details", "Mood & Features", "Story"];

  return (
    <section id="create" className="py-40 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Create</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Let's bring your<br />
            <span className="italic gradient-text">story to life.</span>
          </h2>
        </div>
        <div className="glass-card p-8 md:p-12">
          {/* Progress */}
          <div className="flex items-center gap-1 mb-10">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className={`h-1 w-full rounded-full transition-all duration-500 ${i <= step ? "gradient-full" : "bg-muted/30"}`} />
                <span className={`text-[10px] mt-2 transition-colors ${i <= step ? "text-foreground" : "text-muted-foreground/50"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Error display */}
          <AnimatePresence>
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/5"
              >
                {errors.map((e, i) => (
                  <p key={i} className="text-destructive text-sm flex items-center gap-2">
                    <AlertCircle size={14} /> {e}
                  </p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={prev}
              className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${step === 0 ? "invisible" : ""}`}
            >
              <ArrowLeft size={16} /> Back
            </button>
            {step < totalSteps - 1 ? (
              <button
                onClick={next}
                className="gradient-full text-foreground font-semibold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-all flex items-center gap-2"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="gradient-full text-foreground font-semibold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-all glow-violet flex items-center gap-2"
              >
                <Sparkles size={16} /> Submit Request
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
