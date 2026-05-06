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
      const { data, error } = await (supabase as any)
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        setState({ session, isAdmin: false, loading: false });
        return;
      }
      setState({ session, isAdmin: !!data, loading: false });
    };

    supabase.auth.getSession().then(({ data }) => evaluate(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => evaluate(session));
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
