import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminLogin() {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Admin sign in | Xenium";
  }, []);

  // Already signed in as admin → bounce to dashboard.
  if (!auth.loading && auth.session && auth.isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  if (!auth.loading && auth.session && auth.isAdmin === false) {
    // Signed in but not an admin — sign out so the user can try again.
    void supabase.auth.signOut();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signErr) {
      setError(signErr.message || "Sign in failed.");
      setSubmitting(false);
      return;
    }
    // Re-check admin status; useAdminAuth will pick up the new session.
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      const { data: adm } = await (supabase as any).from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
      if (!adm) {
        await supabase.auth.signOut();
        setError("This account is not an admin. Contact the site owner.");
        setSubmitting(false);
        return;
      }
      navigate("/admin", { replace: true });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-20">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
          <ArrowLeft size={16} /> Back to home
        </Link>
        <header className="text-center mb-8">
          <p className="text-xenium-amber text-xs tracking-[0.2em] uppercase mb-3">Admin</p>
          <h1 className="font-display text-3xl sm:text-4xl font-light">Sign in to manage orders</h1>
        </header>

        {error && (
          <div className="mb-4 p-4 rounded-xl border border-xenium-rose/30 bg-xenium-rose/5 text-xenium-rose text-sm flex items-start gap-2" role="alert">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-5">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-muted/20 border border-border/60 rounded-xl px-5 py-3.5 text-foreground focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20 text-base sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-muted/20 border border-border/60 rounded-xl px-5 py-3.5 text-foreground focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20 text-base sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="gradient-full text-foreground font-semibold w-full py-3.5 rounded-full text-sm flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-60"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />} Sign in
          </button>
        </form>

        <p className="text-center text-[11px] text-muted-foreground/60 mt-5">
          Admin accounts are created from the Supabase dashboard. Contact xeniumgifts@gmail.com if you need access.
        </p>
      </div>
    </div>
  );
}
