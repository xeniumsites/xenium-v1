import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import logo from "@/assets/xenium-logo.png";

export default function AdminLayout() {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={20} />
      </div>
    );
  }

  if (!auth.session || auth.isAdmin === false) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const signOut = () => {
    // Forcefully remove the token immediately
    localStorage.removeItem("xenium-auth-token-v3");
    
    // Attempt network signout but don't wait for it, preventing hangs
    supabase.auth.signOut().catch(console.error);
    
    // Hard navigate instantly
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logo} alt="Xenium" className="h-7 w-auto" />
            <span className="text-xs uppercase tracking-[0.2em] text-xenium-amber">Admin</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `text-sm flex items-center gap-1.5 min-h-[40px] px-3 rounded-full transition-colors ${
                  isActive ? "bg-muted/30 text-foreground" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <LayoutDashboard size={14} /> Orders
            </NavLink>
            <NavLink
              to="/admin/orders/new"
              className={({ isActive }) =>
                `text-sm flex items-center gap-1.5 min-h-[40px] px-3 rounded-full transition-colors ${
                  isActive ? "bg-muted/30 text-foreground" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <Plus size={14} /> New
            </NavLink>
            <button
              type="button"
              onClick={signOut}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors min-h-[40px] px-3 rounded-full flex items-center gap-1.5"
            >
              <LogOut size={14} /> Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Outlet />
      </main>
    </div>
  );
}
