import { Navigate } from "react-router-dom";
import { AdminShell } from "./AdminShell";
import { useCachedData } from "@/lib/query";
import { currentUserQuery } from "@/lib/auth";

export function RequireAdmin() {
  const { data: user, isLoading } = useCachedData(currentUserQuery);
  if (isLoading) return <div className="container-site py-20 text-muted-foreground">Loading…</div>;
  if (!user?.isAdmin) return <Navigate to="/auth" replace />;
  return <AdminShell />;
}
