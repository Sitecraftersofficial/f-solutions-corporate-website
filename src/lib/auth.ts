import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const currentUserQuery = queryOptions({ queryKey: ["current-user"], queryFn: async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const role = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
  return { ...data.user, isAdmin: role.data === true && !role.error };
}, retry: false, staleTime: 30_000 });