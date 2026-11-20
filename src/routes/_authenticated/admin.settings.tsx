import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/browser";
import { useSeo } from "@/lib/seo";
import { logAction } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function SettingsAdminPage() {
  useSeo("Account Settings", "F-Solutions Ltd administrator account security settings.");
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  return <section className="max-w-xl"><h1 className="text-3xl font-bold text-primary-deep">Account Settings</h1><h2 className="mt-8 text-xl font-bold">Change password</h2><form className="mt-5 space-y-5" onSubmit={async (e) => { e.preventDefault(); const form = e.currentTarget; const fd = new FormData(form); const password = String(fd.get("password")); if (password !== fd.get("confirm")) { setError("The new passwords do not match."); return; } setBusy(true); setError(""); try { const r = await supabase.auth.updateUser({ password, current_password: String(fd.get("current")) }); if (r.error) throw r.error; await logAction("Changed password", "account"); form.reset(); toast.success("Password changed"); } catch (error) { setError(error instanceof Error ? error.message : "Could not change password"); } finally { setBusy(false); } }}>
    {[{ name: "current", label: "Current password", auto: "current-password" }, { name: "password", label: "New password", auto: "new-password" }, { name: "confirm", label: "Confirm new password", auto: "new-password" }].map((f) => <div key={f.name}><Label htmlFor={`password-${f.name}`}>{f.label}</Label><Input id={`password-${f.name}`} name={f.name} type="password" autoComplete={f.auto} required className="mt-2" /></div>)}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={busy}>{busy ? "Updating…" : "Change password"}</Button>
  </form></section>;
}