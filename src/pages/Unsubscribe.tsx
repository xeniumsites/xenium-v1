import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState<'loading' | 'valid' | 'already' | 'invalid' | 'success' | 'error'>('loading');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Unsubscribe | Xenium';
  }, []);

  useEffect(() => {
    if (!token) { setState('invalid'); return; }
    fetch(`${FN_URL}?token=${encodeURIComponent(token)}`, { headers: { apikey: ANON } })
      .then(r => r.json())
      .then(d => {
        if (d.valid) setState('valid');
        else if (d.reason === 'already_unsubscribed') setState('already');
        else setState('invalid');
      })
      .catch(() => setState('error'));
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const r = await fetch(FN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON },
        body: JSON.stringify({ token }),
      });
      const d = await r.json();
      setState(d.success ? 'success' : d.reason === 'already_unsubscribed' ? 'already' : 'error');
    } catch {
      setState('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-border/50 bg-card/50">
        <h1 className="font-serif text-3xl">Email preferences</h1>
        {state === 'loading' && <p className="text-muted-foreground">Loading…</p>}
        {state === 'invalid' && <p className="text-muted-foreground">This unsubscribe link is invalid or expired.</p>}
        {state === 'already' && <p className="text-muted-foreground">You're already unsubscribed. No further emails will be sent.</p>}
        {state === 'valid' && (
          <>
            <p className="text-muted-foreground">Click below to unsubscribe from Xenium emails.</p>
            <Button onClick={confirm} disabled={submitting} size="lg">
              {submitting ? 'Processing…' : 'Confirm unsubscribe'}
            </Button>
          </>
        )}
        {state === 'success' && <p className="text-muted-foreground">You've been unsubscribed. We're sorry to see you go.</p>}
        {state === 'error' && <p className="text-muted-foreground">Something went wrong. Please try again later.</p>}
        <div className="pt-4">
          <Link to="/" className="text-sm text-primary hover:underline">Back to Xenium</Link>
        </div>
      </div>
    </main>
  );
}
