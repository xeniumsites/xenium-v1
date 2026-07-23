import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthState {
  session: Session | null;
  isAdmin: boolean | null; // null = unknown, false = signed in but not admin
  loading: boolean;
}

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({ session: null, isAdmin: null, loading: true });

  useEffect(() => {
    let cancelled = false;

    const evaluate = async (session: Session | null) => {
      if (!session) {
        if (!cancelled) setState({ session: null, isAdmin: null, loading: false });
        return;
      }
      try {
        // Bound the admin check so the page can never spin forever, even if the
        // network/backend stalls.
        const query = (supabase as any)
          .from("admin_users")
          .select("user_id")
          .eq("user_id", session.user.id)
          .maybeSingle();
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("admin_check_timeout")), 8000),
        );
        const { data, error } = (await Promise.race([query, timeout])) as {
          data: unknown;
          error: unknown;
        };
        if (cancelled) return;
        setState({ session, isAdmin: error ? false : !!data, loading: false });
      } catch {
        if (!cancelled) setState({ session, isAdmin: false, loading: false });
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      void evaluate(data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      // IMPORTANT: never await a Supabase call directly inside this callback.
      // It runs while the auth lock is held, and the query's own token refresh
      // needs that same lock — awaiting here deadlocks and hangs the admin page
      // forever. Defer with setTimeout(0) so evaluate runs outside the lock.
      setTimeout(() => {
        if (!cancelled) void evaluate(session);
      }, 0);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
