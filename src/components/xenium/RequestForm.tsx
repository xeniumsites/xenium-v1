import { forwardRef, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  AlertCircle,
  Home,
  RefreshCw,
  Cake,
  Heart,
  Diamond,
  Flower2,
  BookHeart,
  Sunset,
  Building2,
  HelpCircle,
  Image as ImageIcon,
  Video,
  Clock,
  MessageSquareHeart,
  Music,
  Type,
  Users,
  QrCode,
  Loader2,
  ShieldCheck,
  Lock,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/paymentClient";
import { DELIVERY_SHORT } from "@/lib/delivery";
import {
  OCCASIONS,
  MOODS,
  FEATURES,
  DEADLINES,
  requestFormSchema,
  type RequestFormValues,
  stepFields,
  formatPhoneInput,
  countWords,
} from "@/lib/validation";

const occasionIcons: Record<(typeof OCCASIONS)[number], LucideIcon> = {
  Birthday: Cake,
  Anniversary: Heart,
  Proposal: Diamond,
  "Memorial / Tribute": Flower2,
  "Love Story": BookHeart,
  Retirement: Sunset,
  "Corporate / Employee": Building2,
  Other: HelpCircle,
};

const featureIcons: Record<(typeof FEATURES)[number], LucideIcon> = {
  "Photo Gallery": ImageIcon,
  "Video Embed": Video,
  Timeline: Clock,
  "Written Messages": MessageSquareHeart,
  "Background Music": Music,
  "Animated Text": Type,
  "Guest Messages": Users,
  "QR Code": QrCode,
};

const stepHelpers = [
  "Choose the moment you want us to bring to life.",
  "Tell us who this experience is meant for.",
  "So we know where to reach you and who's behind the story.",
  "Help us understand how it should feel and what it should include.",
  "Tell us what makes this moment meaningful.",
];

const stepLabels = ["Occasion", "Recipient", "Your Details", "Mood & Features", "Story"];

const DRAFT_KEY = "xenium-request-draft";

const initial: RequestFormValues = {
  occasion: undefined as unknown as RequestFormValues["occasion"],
  recipientName: "",
  recipientRelation: "",
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  mood: undefined as unknown as RequestFormValues["mood"],
  features: [],
  story: "",
  deadline: undefined as unknown as RequestFormValues["deadline"],
  website: "",
};

const inputBase =
  "w-full bg-muted/20 border border-border/60 rounded-xl px-5 py-3.5 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20 focus:bg-muted/30 transition-all duration-300 text-base sm:text-sm";
const inputError = "border-xenium-rose/60 focus:border-xenium-rose/80 focus:ring-xenium-rose/20";

function loadDraft(): Partial<RequestFormValues> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as Partial<RequestFormValues>;
  } catch {
    // ignore
  }
  return null;
}

export default function RequestForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{
    shortCode?: string;
    paymentLinkUrl?: string | null;
    amountPaise?: number;
  } | null>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const totalSteps = 5;

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    setValue,
    reset,
    setFocus,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: initial,
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  // Restore draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      reset({ ...initial, ...draft });
    }
  }, [reset]);

  // Persist draft as user types (excluding honeypot)
  const watched = watch();
  useEffect(() => {
    if (submitted) return;
    const { website: _hp, ...persistable } = watched;
    void _hp;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(persistable));
    } catch {
      // localStorage quota or denied — silently ignore
    }
  }, [watched, submitted]);

  const next = async () => {
    setSubmitError(null);
    // Validate each field of this step and find the first invalid one from the
    // trigger result directly — the `errors` object from formState lags by a
    // render, so reading it here would miss brand-new errors on the first click.
    let firstError: keyof RequestFormValues | null = null;
    for (const f of stepFields[step]) {
      const ok = await trigger(f);
      if (!ok && !firstError) firstError = f;
    }
    if (firstError) {
      if (firstError !== "features" && firstError !== "occasion" && firstError !== "mood" && firstError !== "deadline") {
        setFocus(firstError as "recipientName" | "recipientRelation" | "senderName" | "senderEmail" | "senderPhone" | "story");
      }
      return;
    }
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const prev = () => {
    setSubmitError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async (values: RequestFormValues) => {
    setSubmitError(null);
    if (values.website && values.website.length > 0) {
      // Honeypot triggered — silently succeed without sending.
      setSubmitted(true);
      return;
    }
    try {
      const { website: _hp, ...payload } = values;
      void _hp;
      const { data, error } = await supabase.functions.invoke<{
        shortCode?: string;
        paymentLinkUrl?: string | null;
        amountPaise?: number;
      }>("submit-xenium-request", { body: payload });
      if (error) throw error;
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      setPaymentInfo({
        shortCode: data?.shortCode,
        paymentLinkUrl: data?.paymentLinkUrl ?? null,
        amountPaise: data?.amountPaise,
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setSubmitError(
        err instanceof Error && err.message
          ? `We couldn't send your request: ${err.message}. Please try again or email xeniumgifts@gmail.com.`
          : "We couldn't send your request. Please try again, or email xeniumgifts@gmail.com.",
      );
    }
  };

  const startOver = () => {
    setSubmitted(false);
    setSubmitError(null);
    setStep(0);
    reset(initial);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  };

  // Smooth scroll to form top when step changes (mobile UX)
  useEffect(() => {
    formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  if (submitted) {
    const code = paymentInfo?.shortCode;
    const payUrl = paymentInfo?.paymentLinkUrl;
    const amountLabel = paymentInfo?.amountPaise != null ? formatINR(paymentInfo.amountPaise) : null;
    return (
      <section id="create" className="py-20 sm:py-24 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto glass-card p-8 sm:p-12 md:p-16 text-center"
          role="status"
          aria-live="polite"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full gradient-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <Check size={32} className="text-foreground" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium mb-3">
            Your Xenium request is ready.
          </h3>
          {code && (
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-2 text-sm">
              Order ID: <span className="font-mono text-foreground/90">{code}</span>
            </p>
          )}
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-6">
            {payUrl
              ? `To begin production, please complete the payment${amountLabel ? ` of ${amountLabel}` : ""} below. We've also emailed you the link.`
              : "We've received your details and emailed your team. Production starts as soon as payment is received."}
          </p>

          {payUrl && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6">
              <a
                href={payUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-full text-foreground font-semibold inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base glow-violet min-h-[52px]"
              >
                <Sparkles size={16} /> {amountLabel ? `Pay ${amountLabel} securely` : "Pay securely"}
              </a>
              {code && (
                <button
                  type="button"
                  onClick={() => navigate(`/track/${code}`)}
                  className="glass-card text-foreground font-medium px-7 py-3.5 rounded-full text-base hover:bg-muted/30 transition-all flex items-center justify-center gap-2 hover:border-xenium-violet-mid/40 min-h-[52px]"
                >
                  <RefreshCw size={16} /> Track this order
                </button>
              )}
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto mb-8 text-left text-xs sm:text-sm">
            <div className="glass-card p-3 sm:p-4 rounded-xl">
              <Mail size={14} className="text-xenium-amber mb-2" />
              <p className="text-foreground/85 font-medium">Pay & confirm</p>
              <p className="text-muted-foreground/70 text-[11px] sm:text-xs">Secure UPI / cards</p>
            </div>
            <div className="glass-card p-3 sm:p-4 rounded-xl">
              <ImageIcon size={14} className="text-xenium-rose mb-2" />
              <p className="text-foreground/85 font-medium">Share your media</p>
              <p className="text-muted-foreground/70 text-[11px] sm:text-xs">We email you within 24 hrs</p>
            </div>
            <div className="glass-card p-3 sm:p-4 rounded-xl">
              <Sparkles size={14} className="text-xenium-violet-mid mb-2" />
              <p className="text-foreground/85 font-medium">Receive your Xenium</p>
              <p className="text-muted-foreground/70 text-[11px] sm:text-xs">Same day · {DELIVERY_SHORT.toLowerCase()}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => document.querySelector("#home")?.scrollIntoView({ behavior: "smooth" })}
              className="glass-card text-foreground font-medium px-6 py-3 rounded-full text-sm hover:bg-muted/30 transition-all flex items-center justify-center gap-2 hover:border-xenium-violet-mid/40 min-h-[44px]"
            >
              <Home size={16} /> Return to Home
            </button>
            <button
              type="button"
              onClick={startOver}
              className="glass-card text-foreground font-medium px-6 py-3 rounded-full text-sm hover:bg-muted/30 transition-all flex items-center justify-center gap-2 hover:border-xenium-violet-mid/40 min-h-[44px]"
            >
              <RefreshCw size={16} /> Create Another Request
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  const story = watched.story ?? "";
  const storyChars = story.length;
  const storyWords = countWords(story);
  const storyMin = 30;
  const storyMax = 2000;
  const storyOver = storyChars > storyMax * 0.9;
  const storyOK = storyChars >= storyMin && storyChars <= storyMax;

  // Live error list for the current step (for accessible summary)
  const stepErrorEntries = stepFields[step]
    .map((field) => ({ field, message: errors[field]?.message as string | undefined }))
    .filter((e) => Boolean(e.message));

  return (
    <section id="create" className="py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xenium-amber text-xs sm:text-sm tracking-[0.2em] uppercase mb-3 sm:mb-4">Create</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            Let's bring your<br />
            <span className="italic gradient-text">story to life.</span>
          </h2>
          <p className="text-muted-foreground/60 text-sm mt-3 sm:mt-4 font-light">Takes about 3 minutes. No payment required to start.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Honeypot — visually hidden but reachable for bots only */}
          <div aria-hidden="true" className="absolute left-[-9999px] w-px h-px overflow-hidden" tabIndex={-1}>
            <label>
              Leave this field empty
              <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </label>
          </div>

          <div ref={formCardRef} className="glass-card p-5 sm:p-8 md:p-12 scroll-mt-24">
            {/* Progress */}
            <div className="flex items-center gap-1 mb-8 sm:mb-10" role="progressbar" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={step + 1} aria-label="Form progress">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex-1 flex flex-col items-center">
                  <div className={`h-1 w-full rounded-full transition-all duration-500 ${i <= step ? "gradient-full" : "bg-muted/30"}`} />
                  <span className={`text-[10px] mt-2 transition-colors hidden sm:inline ${i <= step ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center sm:hidden text-xs text-muted-foreground/70 mb-2">
              Step {step + 1} of {totalSteps} · {stepLabels[step]}
            </p>

            <p className="text-muted-foreground/70 text-sm italic mb-5 sm:mb-6">{stepHelpers[step]}</p>

            {/* Submission error */}
            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 p-4 rounded-xl border border-xenium-rose/30 bg-xenium-rose/5"
                  role="alert"
                >
                  <p className="text-xenium-rose text-sm flex items-start gap-2">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step error summary */}
            <AnimatePresence>
              {stepErrorEntries.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 p-3 sm:p-4 rounded-xl border border-xenium-rose/20 bg-xenium-rose/5"
                  role="alert"
                  aria-live="assertive"
                >
                  <ul className="space-y-1">
                    {stepErrorEntries.map((e) => (
                      <li key={e.field} className="text-xenium-rose text-xs sm:text-sm flex items-start gap-2">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" />
                        <span>{e.message}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Step 0: Occasion */}
                {step === 0 && (
                  <div className="space-y-4">
                    <label id="occasion-label" className="block text-sm font-medium text-muted-foreground mb-2">
                      What's the occasion? <span className="text-xenium-amber">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="occasion"
                      render={({ field }) => (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3" role="radiogroup" aria-labelledby="occasion-label" aria-invalid={!!errors.occasion}>
                          {OCCASIONS.map((label) => {
                            const Icon = occasionIcons[label];
                            const isActive = field.value === label;
                            return (
                              <button
                                type="button"
                                key={label}
                                role="radio"
                                aria-checked={isActive}
                                onClick={() => field.onChange(label)}
                                className={`flex flex-col items-center gap-2.5 px-3 py-4 sm:px-4 sm:py-5 rounded-xl border transition-all duration-300 min-h-[88px] ${
                                  isActive
                                    ? "gradient-full text-foreground border-transparent glow-violet scale-[1.02]"
                                    : "border-border text-muted-foreground hover:border-xenium-violet-mid/40 hover:text-foreground hover:bg-muted/10"
                                }`}
                              >
                                <Icon size={20} className={isActive ? "text-foreground" : "text-muted-foreground/60"} />
                                <span className="text-[11px] sm:text-xs font-medium leading-tight text-center">{label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* Step 1: Recipient */}
                {step === 1 && (
                  <div className="space-y-5 sm:space-y-6">
                    <FieldText
                      id="recipientName"
                      label="Recipient's name"
                      placeholder="e.g. Sarah"
                      required
                      maxLength={80}
                      autoComplete="off"
                      error={errors.recipientName?.message}
                      {...register("recipientName")}
                    />
                    <FieldText
                      id="recipientRelation"
                      label="Your relationship"
                      placeholder="e.g. Partner, Mother, Best Friend, Manager"
                      required
                      maxLength={60}
                      autoComplete="off"
                      error={errors.recipientRelation?.message}
                      {...register("recipientRelation")}
                    />
                  </div>
                )}

                {/* Step 2: Your details */}
                {step === 2 && (
                  <div className="space-y-5 sm:space-y-6">
                    <FieldText
                      id="senderName"
                      label="Your name"
                      placeholder="Your full name"
                      required
                      maxLength={80}
                      autoComplete="name"
                      error={errors.senderName?.message}
                      {...register("senderName")}
                    />
                    <FieldText
                      id="senderEmail"
                      label="Your email"
                      type="email"
                      inputMode="email"
                      placeholder="you@email.com"
                      required
                      maxLength={255}
                      autoComplete="email"
                      error={errors.senderEmail?.message}
                      {...register("senderEmail")}
                    />
                    <Controller
                      control={control}
                      name="senderPhone"
                      render={({ field }) => (
                        <FieldText
                          id="senderPhone"
                          label="Phone number"
                          type="tel"
                          inputMode="tel"
                          placeholder="+91 98765 43210"
                          required
                          maxLength={20}
                          autoComplete="tel"
                          help="Indian numbers: just 10 digits also work."
                          error={errors.senderPhone?.message}
                          name={field.name}
                          ref={field.ref}
                          value={field.value}
                          onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Mood & Features */}
                {step === 3 && (
                  <div className="space-y-7 sm:space-y-8">
                    <Controller
                      control={control}
                      name="mood"
                      render={({ field }) => (
                        <div>
                          <label id="mood-label" className="block text-sm font-medium text-muted-foreground mb-3">
                            Desired mood <span className="text-xenium-amber">*</span>
                          </label>
                          <div className="flex flex-wrap gap-2 sm:gap-3" role="radiogroup" aria-labelledby="mood-label" aria-invalid={!!errors.mood}>
                            {MOODS.map((m) => {
                              const isActive = field.value === m;
                              return (
                                <button
                                  type="button"
                                  key={m}
                                  role="radio"
                                  aria-checked={isActive}
                                  onClick={() => field.onChange(m)}
                                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm border transition-all duration-300 min-h-[40px] ${
                                    isActive
                                      ? "gradient-full text-foreground border-transparent"
                                      : "border-border text-muted-foreground hover:border-xenium-violet-mid/40 hover:text-foreground"
                                  }`}
                                >
                                  {m}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    />
                    <Controller
                      control={control}
                      name="features"
                      render={({ field }) => (
                        <div>
                          <label id="features-label" className="block text-sm font-medium text-muted-foreground mb-3">
                            Features you'd like <span className="text-xenium-amber">*</span>{" "}
                            <span className="text-xs text-muted-foreground/60 font-normal">(select at least one)</span>
                          </label>
                          <div
                            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3"
                            role="group"
                            aria-labelledby="features-label"
                            aria-invalid={!!errors.features}
                          >
                            {FEATURES.map((f) => {
                              const Icon = featureIcons[f];
                              const isActive = field.value.includes(f);
                              return (
                                <button
                                  type="button"
                                  key={f}
                                  role="checkbox"
                                  aria-checked={isActive}
                                  onClick={() =>
                                    field.onChange(
                                      isActive ? field.value.filter((x) => x !== f) : [...field.value, f],
                                    )
                                  }
                                  className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border transition-all duration-300 min-h-[88px] ${
                                    isActive
                                      ? "gradient-violet-rose text-foreground border-transparent scale-[1.02]"
                                      : "border-border text-muted-foreground hover:border-xenium-rose/40 hover:text-foreground hover:bg-muted/10"
                                  }`}
                                >
                                  <Icon size={18} className={isActive ? "text-foreground" : "text-muted-foreground/50"} />
                                  <span className="text-[11px] sm:text-xs font-medium text-center leading-tight">{f}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* Step 4: Story & Deadline */}
                {step === 4 && (
                  <div className="space-y-5 sm:space-y-6">
                    <p className="text-foreground/60 text-xs italic font-display mb-1">This is where your story begins.</p>
                    <div>
                      <label htmlFor="story" className="block text-sm font-medium text-muted-foreground mb-2">
                        Tell us the story <span className="text-xenium-amber">*</span>
                      </label>
                      <textarea
                        id="story"
                        rows={5}
                        placeholder="Share the context, emotions, memories, or anything you'd like us to know..."
                        maxLength={storyMax}
                        aria-invalid={!!errors.story}
                        aria-describedby="story-help story-counter"
                        className={`${inputBase} resize-none ${errors.story ? inputError : ""}`}
                        {...register("story")}
                      />
                      <div className="flex flex-wrap justify-between gap-2 mt-2 text-[11px]">
                        <span id="story-help" className="text-muted-foreground/50">
                          {storyOK
                            ? "Looks great. The more you share, the better."
                            : storyChars === 0
                            ? "Aim for at least 1 sentence so we can do this justice."
                            : `Add ${Math.max(0, storyMin - storyChars)} more characters to continue.`}
                        </span>
                        <span
                          id="story-counter"
                          className={`tabular-nums ${storyOver ? "text-xenium-rose" : "text-muted-foreground/50"}`}
                        >
                          {storyWords} {storyWords === 1 ? "word" : "words"} · {storyChars}/{storyMax}
                        </span>
                      </div>
                    </div>
                    <Controller
                      control={control}
                      name="deadline"
                      render={({ field }) => (
                        <div>
                          <label id="deadline-label" className="block text-sm font-medium text-muted-foreground mb-2">
                            When do you need it? <span className="text-xenium-amber">*</span>
                          </label>
                          <div className="flex flex-wrap gap-2 sm:gap-3" role="radiogroup" aria-labelledby="deadline-label" aria-invalid={!!errors.deadline}>
                            {DEADLINES.map((d) => {
                              const isActive = field.value === d;
                              return (
                                <button
                                  type="button"
                                  key={d}
                                  role="radio"
                                  aria-checked={isActive}
                                  onClick={() => field.onChange(d)}
                                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm border transition-all duration-300 min-h-[40px] ${
                                    isActive
                                      ? "gradient-full text-foreground border-transparent"
                                      : "border-border text-muted-foreground hover:border-xenium-violet-mid/40 hover:text-foreground"
                                  }`}
                                >
                                  {d}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 sm:mt-10 gap-4">
              <button
                type="button"
                onClick={prev}
                className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[44px] px-2 -ml-2 ${
                  step === 0 ? "invisible" : ""
                }`}
                aria-hidden={step === 0}
              >
                <ArrowLeft size={16} /> Back
              </button>
              {step < totalSteps - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="gradient-full text-foreground font-semibold px-6 sm:px-8 py-3 rounded-full text-sm hover:opacity-90 transition-all flex items-center gap-2 hover:shadow-[0_0_40px_-10px_hsl(var(--xenium-violet-deep)/0.4)] min-h-[44px]"
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gradient-full text-foreground font-semibold px-6 sm:px-8 py-3 rounded-full text-sm hover:opacity-90 transition-all glow-violet flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Submit Request
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="mt-6 text-[11px] text-muted-foreground flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <Lock size={11} /> Private & secure
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={11} /> No payment to submit
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail size={11} /> Reply within 24 hrs
              </span>
            </p>
          </div>
        </form>

        {/* Trust block */}
        <div className="mt-12 sm:mt-16 glass-card p-6 sm:p-8 md:p-10">
          <h3 className="font-display text-xl sm:text-2xl font-medium text-center mb-6 sm:mb-8">What happens next?</h3>
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
            {[
              { num: "01", text: "We review your request" },
              { num: "02", text: "We reach out via email within 24 hours" },
              { num: "03", text: "We collect your memories and media" },
              { num: "04", text: "We craft and deliver your Xenium within 24 hours" },
            ].map((item) => (
              <div key={item.num} className="flex items-start gap-4">
                <span className="text-xenium-amber/60 font-display text-2xl font-light shrink-0">{item.num}</span>
                <p className="text-muted-foreground text-sm pt-1 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-xs mt-6 italic">Order before 12 PM IST for same-day delivery, otherwise within 24 hours.</p>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6 sm:mt-8 tracking-wide max-w-md mx-auto">
          Created for birthdays, proposals and life's most meaningful moments. Hand-crafted in India.
        </p>
      </div>
    </section>
  );
}

type FieldTextProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  help?: string;
};

const FieldText = forwardRef<HTMLInputElement, FieldTextProps>(function FieldText(
  { id, label, required, error, help, className, ...rest },
  ref,
) {
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-2">
        {label}
        {required && <span className="text-xenium-amber"> *</span>}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : help ? helpId : undefined}
        className={`${inputBase} ${error ? inputError : ""} ${className ?? ""}`}
        {...rest}
      />
      {!error && help && (
        <p id={helpId} className="text-[11px] text-muted-foreground/50 mt-1.5">
          {help}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[11px] text-xenium-rose mt-1.5 flex items-center gap-1.5" role="alert">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
});
