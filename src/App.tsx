import { useEffect } from "react";
import { BrowserRouter, useNavigate, useRoutes } from "react-router-dom";
import { SWRConfig, useSWRConfig } from "swr";
import { Toaster } from "@/components/ui/sonner";
import { appRoutes } from "@/app-routes";
import { clearCachedData } from "@/lib/query";
import { supabase } from "@/integrations/supabase/browser";

function AuthListener() {
  const navigate = useNavigate();
  const { mutate, cache } = useSWRConfig();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (!["SIGNED_IN", "SIGNED_OUT", "USER_UPDATED", "TOKEN_REFRESHED"].includes(event)) return;
      if (event === "SIGNED_OUT") {
        clearCachedData(cache, (key) => {
          void mutate(key, undefined, { revalidate: false });
        });
        void mutate("current-user", null, { revalidate: false });
        if (window.location.pathname.startsWith("/admin")) {
          navigate("/auth", { replace: true });
        }
        return;
      }
      window.setTimeout(() => {
        for (const key of cache.keys()) void mutate(key);
      }, 0);
    });
    return () => data.subscription.unsubscribe();
  }, [cache, mutate, navigate]);

  return null;
}

function AppRoutes() {
  return useRoutes(appRoutes);
}

export function App() {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <BrowserRouter>
        <AuthListener />
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </SWRConfig>
  );
}
