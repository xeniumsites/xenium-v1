import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Check, AlertCircle, Home, RefreshCw, Cake, Heart, Diamond, Flower2, BookHeart, Sunset, Building2, HelpCircle, Image, Video, Clock, MessageSquareHeart, Music, Type, Users, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const occasions = [
  { label: "Birthday", icon: Cake },
  { label: "Anniversary", icon: Heart },
  { label: "Proposal", icon: Diamond },
  { label: "Memorial / Tribute", icon: Flower2 },
  { label: "Love Story", icon: BookHeart },
  { label: "Retirement", icon: Sunset },
  { label: "Corporate / Employee", icon: Building2 },
  { label: "Other", icon: HelpCircle },
];

const moods = ["Cinematic & Grand", "Warm & Nostalgic", "Romantic & Dreamy", "Fun & Playful", "Elegant & Minimal", "Bold & Modern"];

const featureOptions = [
  { label: "Photo Gallery", icon: Image },
  { label: "Video Embed", icon: Video },
  { label: "Timeline", icon: Clock },
  { label: "Written Messages", icon: MessageSquareHeart },
  { label: "Background Music", icon: Music },
  { label: "Animated Text", icon: Type },
  { label: "Guest Messages", icon: Users },
  { label: "QR Code", icon: QrCode },
];

const deadlineOptions = ["Within 2 days", "Within 1 week", "Within 2 weeks", "Flexible"];

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

const stepHelpers = [
  "Choose the moment you want us to bring to life.",
  "Tell us who this experience is meant for.",
  "So we know where to reach you and who's behind the story.",
  "Help us understand how it should feel and what it should include.",
  "Tell us what makes this moment meaningful.",
];

export default function RequestForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
        if (!form.deadline) errs.push("Please select a timeline.");
        break;
    }
    return errs;
  };

  const next = () => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const prev = () => { setErrors([]); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = async () => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-xenium-request', {
        body: form,
      });

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFeature = (f: string) =>
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f],
    }));

  const inputClass = "w-full bg-muted/20 border border-border/60 rounded-xl px-5 py-3.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/10 focus:bg-muted/30 transition-all duration-300 text-sm";

  if (submitted) {
    return (
      <section id="create" className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto glass-card p-16 text-center"
        >
          <div className="w-20 h-20 rounded-full gradient-full flex items-center justify-center mx-auto mb-8">
            <Check size={36} className="text-foreground" />
          </div>
          <h3 className="font-display text-3xl md:text-4xl font-medium mb-4">Your Xenium request has been received.</h3>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-10">
            We've received your story and details. We'll reach out to you shortly via email with the next steps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" })}
              className="glass-card text-foreground font-medium px-6 py-3 rounded-full text-sm hover:bg-muted/30 transition-all flex items-center gap-2 hover:border-xenium-violet-mid/40"
            >
              <Home size={16} /> Return to Home
            </button>
            <button
              onClick={() => { setSubmitted(false); setForm(initial); setStep(0); }}
              className="gradient-full text-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-all flex items-center gap-2"
            >
              <RefreshCw size={16} /> Create Another Request
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  const steps = [
    // Step 0: Occasion with icons
    <div className="space-y-4">
      <label className="block text-sm font-medium text-muted-foreground mb-2">What's the occasion? *</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {occasions.map((o) => (
          <button
            key={o.label}
            onClick={() => setForm({ ...form, occasion: o.label })}
            className={`flex flex-col items-center gap-2.5 px-4 py-5 rounded-xl border transition-all duration-300 ${
              form.occasion === o.label
                ? "gradient-full text-foreground border-transparent glow-violet scale-[1.02]"
                : "border-border text-muted-foreground hover:border-xenium-violet-mid/40 hover:text-foreground hover:bg-muted/10"
            }`}
          >
            <o.icon size={22} className={form.occasion === o.label ? "text-foreground" : "text-muted-foreground/60"} />
            <span className="text-xs font-medium">{o.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Recipient
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Recipient's name *</label>
        <input
          type="text"
          placeholder="e.g. Sarah"
          value={form.recipientName}
          onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
          className={inputClass}
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
          className={inputClass}
          maxLength={100}
        />
      </div>
    </div>,

    // Step 2: Sender details
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Your name *</label>
        <input
          type="text"
          placeholder="Your full name"
          value={form.senderName}
          onChange={(e) => setForm({ ...form, senderName: e.target.value })}
          className={inputClass}
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
          className={inputClass}
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
          className={inputClass}
          maxLength={20}
        />
      </div>
    </div>,

    // Step 3: Mood & Features with icons
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-3">Desired mood *</label>
        <div className="flex flex-wrap gap-3">
          {moods.map((m) => (
            <button
              key={m}
              onClick={() => setForm({ ...form, mood: m })}
              className={`px-5 py-2.5 rounded-full text-sm border transition-all duration-300 ${
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featureOptions.map((f) => (
            <button
              key={f.label}
              onClick={() => toggleFeature(f.label)}
              className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all duration-300 ${
                form.features.includes(f.label)
                  ? "gradient-violet-rose text-foreground border-transparent scale-[1.02]"
                  : "border-border text-muted-foreground hover:border-xenium-rose/40 hover:text-foreground hover:bg-muted/10"
              }`}
            >
              <f.icon size={18} className={form.features.includes(f.label) ? "text-foreground" : "text-muted-foreground/50"} />
              <span className="text-xs font-medium text-center">{f.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>,

    // Step 4: Story & Deadline
    <div className="space-y-6">
      <p className="text-foreground/30 text-xs italic font-display mb-2">This is where your story begins.</p>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Tell us the story *</label>
        <textarea
          rows={4}
          placeholder="Share the context, emotions, memories, or anything you'd like us to know..."
          value={form.story}
          onChange={(e) => setForm({ ...form, story: e.target.value })}
          className={`${inputClass} resize-none`}
          maxLength={2000}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">When do you need it? *</label>
        <div className="flex flex-wrap gap-3">
          {deadlineOptions.map((d) => (
            <button
              key={d}
              onClick={() => setForm({ ...form, deadline: d })}
              className={`px-5 py-2.5 rounded-full text-sm border transition-all duration-300 ${
                form.deadline === d
                  ? "gradient-full text-foreground border-transparent"
                  : "border-border text-muted-foreground hover:border-xenium-violet-mid/40 hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>,
  ];

  const stepLabels = ["Occasion", "Recipient", "Your Details", "Mood & Features", "Story"];

  return (
    <section id="create" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xenium-amber text-sm tracking-[0.2em] uppercase mb-4">Create</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
            Let's bring your<br />
            <span className="italic gradient-text">story to life.</span>
          </h2>
          <p className="text-muted-foreground/50 text-sm mt-4 font-light">Let's create something meaningful.</p>
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

          {/* Step helper text */}
          <p className="text-muted-foreground/70 text-sm italic mb-6">{stepHelpers[step]}</p>

          {/* Error display */}
          <AnimatePresence>
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl border border-xenium-rose/20 bg-xenium-rose/5"
              >
                {errors.map((e, i) => (
                  <p key={i} className="text-xenium-rose text-sm flex items-center gap-2">
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
                className="gradient-full text-foreground font-semibold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-all flex items-center gap-2 hover:shadow-[0_0_40px_-10px_hsl(var(--xenium-violet-deep)/0.4)]"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="gradient-full text-foreground font-semibold px-8 py-3 rounded-full text-sm hover:opacity-90 transition-all glow-violet flex items-center gap-2 disabled:opacity-60"
              >
                <Sparkles size={16} /> {submitting ? "Submitting..." : "Submit Request"}
              </button>
            )}
          </div>
        </div>

        {/* Trust block */}
        <div className="mt-16 glass-card p-8 md:p-10">
          <h3 className="font-display text-2xl font-medium text-center mb-8">What happens next?</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { num: "01", text: "We review your request" },
              { num: "02", text: "We reach out via email" },
              { num: "03", text: "We collect your memories and media" },
              { num: "04", text: "We craft your Xenium experience" },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-4">
                <span className="text-xenium-amber/60 font-display text-2xl font-light">{item.num}</span>
                <p className="text-muted-foreground text-sm pt-1">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground/40 text-xs mt-6 italic">Most Xeniums are delivered within a few days.</p>
        </div>

        {/* Social proof */}
        <p className="text-center text-muted-foreground/30 text-xs mt-8 tracking-wide">
          Created for birthdays, proposals, and life's most meaningful moments. Loved by early users, friends, and first believers.
        </p>
      </div>
    </section>
  );
}
