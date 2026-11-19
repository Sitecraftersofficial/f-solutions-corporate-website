import { supabase } from "@/integrations/supabase/browser";
import type { CachedQuery } from "@/lib/query";

export const currentUserQuery: CachedQuery<
  (Awaited<ReturnType<typeof supabase.auth.getUser>>["data"]["user"] & { isAdmin: boolean }) | null
> = {
  key: "current-user",
  queryFn: async (signal) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    const role = await supabase
      .rpc("has_role", { _user_id: data.user.id, _role: "admin" })
      .abortSignal(signal);
    return { ...data.user, isAdmin: role.data === true && !role.error };
  },
  staleTime: 30_000,
};
