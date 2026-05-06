import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save, AlertCircle } from "lucide-react";
import { adminCreateManualOrder } from "@/lib/adminClient";
import { OCCASIONS, MOODS, FEATURES, DEADLINES } from "@/lib/validation";

const DEFAULT_AMOUNT = 750;

export default function AdminCreateOrder() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    occasion: "Anniversary" as (typeof OCCASIONS)[number],
    recipientName: "",
    recipientRelation: "",
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    mood: "Cinematic & Grand" as (typeof MOODS)[number],
    features: [FEATURES[0], FEATURES[1]] as Array<(typeof FEATURES)[number]>,
    story: "",
    deadline: "Within 1 week" as (typeof DEADLINES)[number],
    amountRupees: DEFAULT_AMOUNT,
    skipPayment: false,
    emailCustomer: true,
  });

  useEffect(() => {
    document.title = "Admin · New order | Xenium";
  }, []);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const toggleFeature = (f: (typeof FEATURES)[number]) =>
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f],
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.recipientName.trim() || !form.senderName.trim() || !form.senderEmail.trim() || !form.story.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!form.skipPayment && form.amountRupees < 1) {
      setError("Amount must be at least ₹1, or tick 'skip payment'.");
      return;
    }
    setBusy(true);
    try {
      const res = await adminCreateManualOrder({
        occasion: form.occasion,
        recipientName: form.recipientName.trim(),
        recipientRelation: form.recipientRelation.trim() || undefined,
        senderName: form.senderName.trim(),
        senderEmail: form.senderEmail.trim().toLowerCase(),
        senderPhone: form.senderPhone.trim() || undefined,
        mood: form.mood,
        features: form.features,
        story: form.story.trim(),
        deadline: form.deadline,
        amountPaise: Math.round(form.amountRupees * 100),
        skipPayment: form.skipPayment,
        emailCustomer: form.emailCustomer,
      });
      navigate(`/admin/orders/${res.order.short_code}`, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create order");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={14} /> Back to orders
      </Link>

      <h1 className="font-display text-3xl sm:text-4xl font-light mb-1">New manual order</h1>
      <p className="text-sm text-muted-foreground mb-6">Use this for phone / WhatsApp orders, corporate volume, or comp orders.</p>

      {error && (
        <div className="mb-4 p-4 rounded-xl border border-xenium-rose/30 bg-xenium-rose/5 text-xenium-rose text-sm flex items-start gap-2">
          <AlertCircle size={14} className="mt-0.5 shrink-0" /> <span>{error}</span>
        </div>
      )}

      <form onSubmit={submit} className="glass-card p-6 sm:p-8 space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Customer</legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input id="senderName" label="Name" value={form.senderName} onChange={(v) => update("senderName", v)} required />
            <Input id="senderEmail" label="Email" type="email" value={form.senderEmail} onChange={(v) => update("senderEmail", v)} required />
          </div>
          <Input id="senderPhone" label="Phone (optional)" value={form.senderPhone} onChange={(v) => update("senderPhone", v)} />
        </fieldset>

        <fieldset className="space-y-4 border-t border-border/40 pt-5">
          <legend className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Brief</legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select id="occasion" label="Occasion" value={form.occasion} onChange={(v) => update("occasion", v as typeof form.occasion)} options={[...OCCASIONS]} />
            <Select id="mood" label="Mood" value={form.mood} onChange={(v) => update("mood", v as typeof form.mood)} options={[...MOODS]} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input id="recipientName" label="Recipient" value={form.recipientName} onChange={(v) => update("recipientName", v)} required />
            <Input id="recipientRelation" label="Relation (optional)" value={form.recipientRelation} onChange={(v) => update("recipientRelation", v)} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {FEATURES.map((f) => {
                const active = form.features.includes(f);
                return (
                  <button
                    type="button"
                    key={f}
                    onClick={() => toggleFeature(f)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      active
                        ? "bg-xenium-violet-deep/30 border-xenium-violet-mid/60 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
          <Textarea id="story" label="Story / brief" value={form.story} onChange={(v) => update("story", v)} required />
          <Select id="deadline" label="Deadline" value={form.deadline} onChange={(v) => update("deadline", v as typeof form.deadline)} options={[...DEADLINES]} />
        </fieldset>

        <fieldset className="space-y-4 border-t border-border/40 pt-5">
          <legend className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Payment</legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              id="amount"
              label="Amount (₹ rupees)"
              type="number"
              min="0"
              step="1"
              value={String(form.amountRupees)}
              onChange={(v) => update("amountRupees", Math.max(0, Number(v) || 0))}
              disabled={form.skipPayment}
            />
            <div className="flex flex-col gap-2 sm:pt-7">
              <label className="text-sm flex items-center gap-2">
                <input type="checkbox" checked={form.skipPayment} onChange={(e) => update("skipPayment", e.target.checked)} className="accent-xenium-violet-mid" />
                Skip payment (comp order — mark as waived)
              </label>
              <label className="text-sm flex items-center gap-2">
                <input type="checkbox" checked={form.emailCustomer} onChange={(e) => update("emailCustomer", e.target.checked)} className="accent-xenium-violet-mid" />
                Email the customer the payment link
              </label>
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={busy}
          className="gradient-full text-foreground font-semibold inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm disabled:opacity-60"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Create order
        </button>
      </form>
    </div>
  );
}

function Input({ id, label, value, onChange, ...rest }: { id: string; label: string; value: string; onChange: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1 block">
        {label}{rest.required && <span className="text-xenium-amber"> *</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20 disabled:opacity-50"
        {...rest}
      />
    </div>
  );
}

function Textarea({ id, label, value, onChange, ...rest }: { id: string; label: string; value: string; onChange: (v: string) => void } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1 block">
        {label}{rest.required && <span className="text-xenium-amber"> *</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20"
        {...rest}
      />
    </div>
  );
}

function Select({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <div>
      <label htmlFor={id} className="text-[11px] uppercase tracking-widest text-muted-foreground/60 mb-1 block">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted/20 border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-xenium-violet-mid/40"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
