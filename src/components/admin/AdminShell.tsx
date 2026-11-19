import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  PawPrint,
  Handshake,
  FileCheck2,
  Image,
  FileText,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  History,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/browser";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDataCache } from "@/lib/query";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/animals", label: "Animal Types", icon: PawPrint },
  { to: "/admin/partners", label: "Partners", icon: Handshake },
  { to: "/admin/documents", label: "Compliance Documents", icon: FileCheck2 },
  { to: "/admin/media", label: "Media Library", icon: Image },
  { to: "/admin/content", label: "Website Content", icon: FileText },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { to: "/admin/activity", label: "Activity Log", icon: History },
  { to: "/admin/settings", label: "Account Settings", icon: Settings },
] as const;
export function AdminShell() {
  const cache = useDataCache();
  const navigate = useNavigate();
  async function signOut() {
    cache.clear();
    const r = await supabase.auth.signOut();
    if (r.error) {
      toast.error(r.error.message);
      return;
    }
    navigate("/auth", { replace: true });
  }
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-border bg-muted lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-5">
          <Link to="/">
            <Logo className="h-16" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            title="Sign out"
            aria-label="Sign out"
            onClick={signOut}
            className="lg:hidden"
          >
            <LogOut />
          </Button>
        </div>
        <p className="px-5 pb-4 text-xs font-bold uppercase text-muted-foreground">
          Administration
        </p>
        <nav
          aria-label="Administrator"
          className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col"
        >
          {links.map(({ to, label, icon: Icon }) => (
            <Button key={to} variant="ghost" asChild className="shrink-0 justify-start">
              <NavLink
                to={to}
                end
                className={({ isActive }) => (isActive ? "bg-secondary text-primary" : "")}
              >
                <Icon />
                {label}
              </NavLink>
            </Button>
          ))}
        </nav>
        <div className="hidden space-y-2 border-t border-border p-3 lg:block">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link to="/">
              <ExternalLink />
              View website
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
            <LogOut />
            Sign out
          </Button>
        </div>
      </aside>
      <main className="min-w-0 px-5 py-8 md:px-10">
        <Outlet />
      </main>
    </div>
  );
}
