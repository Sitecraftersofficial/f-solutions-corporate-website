import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/admin")({ beforeLoad: async ({ context }) => {
  const result = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
  if (result.error || !result.data) throw redirect({ to: "/auth" });
}, component: AdminShell });