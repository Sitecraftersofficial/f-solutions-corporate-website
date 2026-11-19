import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { supabase } from "@/integrations/supabase/browser";
import { currentUserQuery } from "@/lib/auth";
import { useSeo } from "@/lib/seo";
import { useCachedData, useDataCache } from "@/lib/query";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInPage() {
  useSeo("Administrator Sign In", "Secure administrator access for F-Solutions Ltd.");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { data: user } = useCachedData(currentUserQuery);
  const navigate = useNavigate();
  const cache = useDataCache();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const result = await supabase.auth.signInWithPassword({
        email: String(data.get("email")).trim(),
        password: String(data.get("password")),
      });
      if (result.error) throw result.error;
      const role = await supabase.rpc("has_role", {
        _user_id: result.data.user.id,
        _role: "admin",
      });
      if (role.error || !role.data) {
        await supabase.auth.signOut();
        throw new Error("This account does not have administrator access.");
      }
      cache.invalidate();
      navigate("/admin");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex justify-center">
          <Logo className="h-28" />
        </Link>
        <div className="rounded-lg border border-border bg-card p-7 shadow-card">
          <LockKeyhole className="size-7 text-primary" />
          <h1 className="mt-4 text-2xl font-bold text-primary-deep">Administrator sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">F-Solutions Ltd</p>
          {user?.isAdmin ? (
            <div className="mt-6">
              <Button asChild className="w-full">
                <Link to="/admin">Open dashboard</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-2"
                />
              </div>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          )}
        </div>
        <Link to="/" className="mt-6 block text-center text-sm text-primary">
          Back to website
        </Link>
      </div>
    </main>
  );
}
